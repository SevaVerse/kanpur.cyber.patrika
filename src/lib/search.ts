import { briefingPath, getAllBriefings } from "@/lib/briefings";
import { getLibraryItems, libraryItemText, libraryPath } from "@/lib/library";

/** Flat, serialisable shape handed to the client-side search dialog. */
export type SearchEntry = {
  id: string;
  href: string;
  title: string;
  description: string;
  category: string;
  lang: "en" | "hi";
  /** Lower-cased text the query is matched against. */
  haystack: string;
};

/**
 * Everything searchable on the site: awareness guides first (they answer the
 * questions people actually type), then weekly briefings.
 */
export function getSearchEntries(): SearchEntry[] {
  const library = getLibraryItems().map((item) => ({
    id: `${item.lang}-${item.slug}`,
    href: libraryPath(item),
    title: item.title,
    description: item.description,
    category: item.category,
    lang: item.lang,
    haystack: `${libraryItemText(item)} ${item.tags.join(" ")}`.toLowerCase(),
  }));

  const briefings = getAllBriefings().map((briefing) => ({
    id: `briefing-${briefing.date}`,
    href: briefingPath(briefing),
    title: briefing.title,
    description:
      briefing.summary || `${briefing.stories.length} curated stories from the week of ${briefing.date}.`,
    category: "Weekly Briefing",
    lang: "en" as const,
    haystack: [
      briefing.title,
      briefing.summary,
      ...briefing.stories.flatMap((story) => [story.headline, story.source, story.take ?? ""]),
    ]
      .join(" ")
      .toLowerCase(),
  }));

  return [...library, ...briefings];
}
