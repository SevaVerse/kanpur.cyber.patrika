/**
 * The awareness library: the site's original, evergreen content.
 *
 * Each poster and comic holds 200-300 words of genuinely useful guidance that
 * search engines cannot read while it lives only inside a JPEG. The `blocks`
 * on every item transcribe the text *in* the artwork, so each topic renders as
 * real HTML that can be indexed, searched and read aloud.
 *
 * This is the single source of truth for /gallery, /comics, the /awareness
 * topic pages, the sitemap, the RSS feed and navbar search.
 */

import { getImageDimensions } from "@/lib/image-manifest";
import { englishItems } from "@/lib/library-en";
import { hindiItems } from "@/lib/library-hi";
import type { LibraryItem } from "@/lib/library-types";

export type { LibraryAsset, LibraryBlock, LibraryItem, LibraryStep } from "@/lib/library-types";
export { CYBERCRIME_PORTAL, HELPLINE_NUMBER } from "@/lib/library-types";

/**
 * Newest first. A slug is only unique *within* a language — `digital-arrest`
 * deliberately exists in both, as an hreflang pair.
 */
export const libraryItems: LibraryItem[] = [...englishItems, ...hindiItems].sort(
  (left, right) => right.publishedAt.localeCompare(left.publishedAt),
);

/** URL for an item. Hindi lives under /awareness/hi/ so hreflang stays clean. */
export function libraryPath(item: Pick<LibraryItem, "slug" | "lang">) {
  return item.lang === "hi" ? `/awareness/hi/${item.slug}` : `/awareness/${item.slug}`;
}

export function getLibraryItems(lang?: LibraryItem["lang"]) {
  return lang ? libraryItems.filter((item) => item.lang === lang) : libraryItems;
}

export function getLibraryItem(slug: string, lang: LibraryItem["lang"]) {
  return libraryItems.find((item) => item.slug === slug && item.lang === lang) ?? null;
}

/** Items shown on /gallery. */
export function getInfographics() {
  return libraryItems.filter((item) => item.kind === "infographic");
}

/** Items shown on /comics. */
export function getComics() {
  return libraryItems.filter((item) => item.kind === "comic");
}

/**
 * Related items, resolved within the same language so a Hindi reader is never
 * handed an English page mid-flow. Falls back to same-category items when the
 * curated list comes up short.
 */
export function getRelatedItems(item: LibraryItem, limit = 3) {
  const curated = item.related
    .map((slug) => getLibraryItem(slug, item.lang))
    .filter((candidate): candidate is LibraryItem => candidate !== null);

  if (curated.length >= limit) {
    return curated.slice(0, limit);
  }

  const seen = new Set([item.slug, ...curated.map((candidate) => candidate.slug)]);
  const filler = libraryItems.filter(
    (candidate) => candidate.lang === item.lang && !seen.has(candidate.slug),
  );

  return [...curated, ...filler].slice(0, limit);
}

/** The hreflang counterpart, when the topic exists in both languages. */
export function getAlternateLanguageItem(item: LibraryItem) {
  if (!item.altLangSlug) {
    return null;
  }

  return getLibraryItem(item.altLangSlug, item.lang === "en" ? "hi" : "en");
}

/** Plain-text rendering of an item's blocks, for search and feed summaries. */
export function libraryItemText(item: LibraryItem) {
  const fromBlocks = item.blocks.flatMap((block) => {
    switch (block.kind) {
      case "list":
        return block.items;
      case "para":
      case "heading":
      case "callout":
        return [block.text];
    }
  });

  const fromSteps = item.howTo?.steps.flatMap((step) => [step.title, step.text]) ?? [];

  return [item.title, item.headline, item.description, ...fromBlocks, ...fromSteps].join(" ");
}

/** Projects an item down to the lean shape the client-side grid needs. */
export function toLibraryCard(item: LibraryItem) {
  const asset = item.assets[0];
  const size = asset ? getImageDimensions(asset.src) : null;

  return {
    slug: item.slug,
    lang: item.lang,
    href: libraryPath(item),
    title: item.title,
    description: item.description,
    category: item.category,
    publishedAt: item.publishedAt,
    tags: item.tags,
    imageSrc: asset?.src ?? "",
    imageAlt: asset?.alt ?? item.title,
    imageWidth: size?.width,
    imageHeight: size?.height,
  };
}

export default libraryItems;
