/**
 * The awareness library: the site's original, evergreen content.
 *
 * Each poster and comic holds 200-300 words of genuinely useful guidance that
 * search engines cannot read while it lives only inside a JPEG. `blocks` is a
 * transcription of the text *in* the artwork, so every item renders as real
 * HTML that can be indexed, translated, searched and read aloud.
 *
 * This is the single source of truth for /gallery, /comics, the topic pages,
 * the sitemap, the RSS feed and navbar search.
 */

export type LibraryBlock =
  | { kind: "para"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; tone: "warn" | "info"; text: string };

export type LibraryAsset = {
  src: string;
  alt: string;
  caption?: string;
};

export type LibraryStep = { title: string; text: string };

export type LibraryItem = {
  slug: string;
  lang: "en" | "hi";
  kind: "infographic" | "comic";
  /** Card + <title> text. */
  title: string;
  /** Page <h1>; may be longer and more query-shaped than the card title. */
  headline: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  assets: LibraryAsset[];
  /** Set when the artwork is not Cyber Vani's own, so attribution is explicit. */
  credit?: string;
  blocks: LibraryBlock[];
  /** Drives HowTo structured data where the poster is genuinely step-based. */
  howTo?: { name: string; steps: LibraryStep[] };
  /** Slug of the same topic in the other language, for hreflang. */
  altLangSlug?: string;
  related: string[];
};

export const HELPLINE_NUMBER = "1930";
export const CYBERCRIME_PORTAL = "https://cybercrime.gov.in";

