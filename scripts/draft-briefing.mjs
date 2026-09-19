/**
 * Drafts the next weekly briefing into src/content/briefings/.
 *
 * This is the ONLY place news APIs are touched. The site render no longer
 * fetches anything: briefings are committed content, so every build can
 * regenerate the whole archive even though the deploy wipes gh-pages each time.
 *
 * The pipeline is fully automated: it collects headlines, fetches each source
 * article, writes a take grounded in that article, matches the story to a
 * guide in our awareness library, and publishes. Any take that cannot be
 * verified against its source is dropped — the story then renders as a plain
 * curated link. Silence beats invention.
 *
 *   npm run draft:briefing            # next Saturday
 *   npm run draft:briefing -- --date 2026-09-26
 *   npm run draft:briefing -- --force # overwrite an existing draft
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { fetchArticleText } from "./lib/article-text.mjs";
import { enrichStories, summariseBriefing } from "./lib/enrich.mjs";
import { loadGuides } from "./lib/guides.mjs";

const OUTPUT_DIR = join("src", "content", "briefings");
const MAX_STORIES = 10;

const CYBER_KEYWORDS = [
  "cyber",
  "cybersecurity",
  "cyber fraud",
  "cyber crime",
  "cyber incident",
  "ransomware",
  "malware",
  "phishing",
  "breach",
  "zero-day",
  "zero day",
  "vulnerability",
  "infosec",
  "hacker",
  "threat",
  "security",
];

// ───────────────────────────── helpers ─────────────────────────────

function loadEnvFile(file) {
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

function parseArgs(argv) {
  const args = { force: false, date: null };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--force") args.force = true;
    if (argv[i] === "--date") args.date = argv[i + 1] ?? null;
  }

  return args;
}

function formatBriefingDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** The upcoming Saturday, or today when today is Saturday. */
function nextSaturday(from = new Date()) {
  const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + ((6 - date.getUTCDay() + 7) % 7));
  return date.toISOString().slice(0, 10);
}

function isCyberRelevant(...parts) {
  const haystack = parts.filter(Boolean).join(" ").toLowerCase();
  return CYBER_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

/** Collapses near-duplicates that both wires carry. */
function dedupeKey(headline) {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 8)
    .join(" ");
}

// ───────────────────────────── sources ─────────────────────────────

async function fetchNewsData() {
  const apiKey = process.env.NEWSDATA_API_KEY || process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("NEWSDATA_API_KEY not set — skipping NewsData.io.");
    return [];
  }

  const url = new URL("https://newsdata.io/api/1/latest");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("q", "cyber fraud OR cyber crime OR cyber incident");
  url.searchParams.set("language", "en");
  url.searchParams.set("country", "in");
  url.searchParams.set("category", "technology");

  const response = await fetch(url, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    console.warn(`NewsData.io returned ${response.status} — skipping.`);
    return [];
  }

  const payload = await response.json();

  return (payload.results ?? [])
    .filter((article) =>
      isCyberRelevant(article.title, article.description, (article.keywords ?? []).join(" ")),
    )
    .map((article) => ({
      headline: article.title?.trim() ?? "",
      source: article.source_name?.trim() || "NewsData.io",
      url: article.link?.trim() || article.source_url?.trim() || "",
      publishedAt: article.pubDate ?? null,
    }));
}

async function fetchNewsApiOrg() {
  const apiKey = process.env.NEWSAPI_ORG_KEY;
  if (!apiKey) {
    console.warn("NEWSAPI_ORG_KEY not set — skipping NewsAPI.org.");
    return [];
  }

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", '("cyber fraud" OR "cyber crime" OR "cyber incident" OR "cybersecurity") +India');
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "20");

  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-Api-Key": apiKey },
  });

  if (!response.ok) {
    console.warn(`NewsAPI.org returned ${response.status} — skipping.`);
    return [];
  }

  const payload = await response.json();

  if (payload.status !== "ok") {
    console.warn(`NewsAPI.org error: ${payload.code} — ${payload.message}`);
    return [];
  }

  return (payload.articles ?? [])
    .filter((article) => article.title && article.title !== "[Removed]")
    .filter((article) => isCyberRelevant(article.title, article.description))
    .map((article) => ({
      headline: article.title.trim(),
      source: article.source?.name?.trim() || "NewsAPI",
      url: article.url?.trim() ?? "",
      publishedAt: article.publishedAt ?? null,
    }));
}

// ────────────────────────────── main ──────────────────────────────

loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const date = args.date ?? nextSaturday();

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`Invalid --date "${date}". Expected YYYY-MM-DD.`);
  process.exit(1);
}

const outputPath = join(OUTPUT_DIR, `${date}.json`);

if (existsSync(outputPath) && !args.force) {
  console.error(`${outputPath} already exists. Re-run with --force to overwrite it.`);
  process.exit(1);
}

const settled = await Promise.allSettled([fetchNewsData(), fetchNewsApiOrg()]);

// Surface failures loudly. A silent catch here is exactly how the old build
// kept falling back to static content without anyone noticing.
settled.forEach((result, index) => {
  if (result.status === "rejected") {
    const name = index === 0 ? "NewsData.io" : "NewsAPI.org";
    console.warn(`${name} request failed: ${result.reason?.message ?? result.reason}`);
  }
});

const collected = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

const seen = new Set();
const stories = [];

for (const story of collected) {
  if (!story.headline || !story.url) continue;

  const key = dedupeKey(story.headline);
  if (seen.has(key)) continue;

  seen.add(key);
  stories.push(story);

  if (stories.length >= MAX_STORIES) break;
}

if (stories.length === 0) {
  console.error("No stories were returned by either source. Nothing written.");
  process.exit(1);
}

// Ground each story in its own source text, then write the take and match it
// to a guide. Anything unverifiable is dropped, never guessed.
const guides = await loadGuides();
const { stories: enrichedStories, stats } = await enrichStories(stories, guides, {
  fetchArticleText,
});

if (stats.dropped.length > 0) {
  console.log(`\n${stats.dropped.length} take(s) dropped rather than guessed:`);
  for (const drop of stats.dropped) {
    console.log(`  - ${drop.headline.slice(0, 70)} — ${drop.why}`);
  }
}

/*
 * Losing a few takes is normal: some publishers block bots, some articles are
 * too thin. Losing *every* take is not — it means a broken model id, a dead
 * key, or no outbound network. Fail before writing, so a systemic break shows
 * up as a red run instead of quietly publishing a briefing with no takes and
 * leaving last week's edition in place.
 */
if (process.env.GROQ_API_KEY && stats.attempted > 0 && stats.takes === 0) {
  console.error(
    `\nEvery take failed (0/${stats.attempted}). Refusing to publish a briefing with nothing written.\n` +
      "Check the errors above — a rejected model id is the usual cause.",
  );
  process.exit(1);
}

const summary = await summariseBriefing(enrichedStories);

mkdirSync(OUTPUT_DIR, { recursive: true });

const briefing = {
  date,
  title: `Cyber security briefing — ${formatBriefingDate(date)}`,
  summary,
  published: true,
  // Only claim AI assistance when something was actually written. Declaring it
  // on a briefing of bare links would be a false disclosure to readers.
  ...(stats.takes > 0 ? { generated: "ai-assisted" } : {}),
  stories: enrichedStories,
};

writeFileSync(outputPath, `${JSON.stringify(briefing, null, 2)}\n`, "utf8");

console.log(`\nWrote ${outputPath}`);
console.log(`  stories:      ${enrichedStories.length}`);
console.log(`  takes:        ${stats.takes}/${stats.attempted}`);
console.log(`  guide links:  ${stats.guides}/${stats.attempted}`);
