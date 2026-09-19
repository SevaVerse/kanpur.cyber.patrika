import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Weekly briefings, read from committed JSON at build time.
 *
 * They live in the repo rather than being refetched on each build because the
 * deploy publishes with `force_orphan`, which wipes gh-pages every time. Any
 * page that cannot be regenerated from source disappears the following week —
 * which is precisely what used to happen to the old /articles URLs.
 */

const CONTENT_DIR = join(process.cwd(), "src", "content", "briefings");

/** Link from a story into our own awareness library. */
export type BriefingGuideLink = {
  path: string;
  title: string;
  lang: "en" | "hi";
};

export type BriefingStory = {
  headline: string;
  source: string;
  url: string;
  publishedAt?: string | null;
  /**
   * Why this matters to a Cyber Vani reader, generated from the source article
   * and validated against it. Optional by design: a story whose source could
   * not be read, or whose take failed validation, ships without one rather
   * than with a guess. It still renders as a curated link, which is honest.
   */
  take?: string;
  /**
   * The guide in our awareness library that explains this threat. The part of
   * the briefing no aggregator can reproduce, and a weekly internal link into
   * the evergreen pages.
   */
  guide?: BriefingGuideLink;
};

export type Briefing = {
  date: string;
  title: string;
  summary: string;
  published: boolean;
  /** Set to "ai-assisted" by the drafter, which drives the on-page disclosure. */
  generated?: "ai-assisted";
  stories: BriefingStory[];
};

function isBriefing(value: unknown): value is Briefing {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Partial<Briefing>;

  return (
    typeof candidate.date === "string" &&
    typeof candidate.title === "string" &&
    Array.isArray(candidate.stories)
  );
}

function loadBriefings(): Briefing[] {
  if (!existsSync(CONTENT_DIR)) {
    return [];
  }

  const briefings: Briefing[] = [];

  for (const file of readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".json")) continue;

    const raw = JSON.parse(readFileSync(join(CONTENT_DIR, file), "utf8")) as unknown;

    if (!isBriefing(raw)) {
      console.warn(`Skipping malformed briefing: ${file}`);
      continue;
    }

    // Drafts stay out of the build until an editor flips the flag.
    if (raw.published !== true) continue;

    briefings.push({
      ...raw,
      stories: raw.stories.filter((story) => story.headline && story.url),
    });
  }

  return briefings.sort((left, right) => right.date.localeCompare(left.date));
}

const briefings = loadBriefings();

export function getAllBriefings() {
  return briefings;
}

export function getLatestBriefing() {
  return briefings[0] ?? null;
}

export function getBriefingByDate(date: string) {
  return briefings.find((briefing) => briefing.date === date) ?? null;
}

export function briefingPath(briefing: Pick<Briefing, "date">) {
  return `/briefing/${briefing.date}`;
}

/** Hostname shown next to a story, e.g. "business-standard.com". */
export function sourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
