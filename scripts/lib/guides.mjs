/**
 * Loads the awareness library so the drafter can match each news story to a
 * relevant guide.
 *
 * The content files use `import type` only, so Node's type stripping erases
 * their sole TypeScript import and they load without a bundler or path-alias
 * resolution. That keeps one source of truth — there is no second copy of the
 * guide list to drift out of sync.
 */

export async function loadGuides() {
  const [en, hi] = await Promise.all([
    import("../../src/lib/library-en.ts"),
    import("../../src/lib/library-hi.ts"),
  ]);

  return [...en.englishItems, ...hi.hindiItems].map((item) => ({
    slug: item.slug,
    lang: item.lang,
    path: item.lang === "hi" ? `/awareness/hi/${item.slug}` : `/awareness/${item.slug}`,
    title: item.title,
    description: item.description,
    tags: item.tags,
  }));
}

/** Compact catalogue for the model to choose from. */
export function guideCatalogue(guides) {
  return guides
    .map(
      (guide) =>
        `- id: ${guide.lang}:${guide.slug}\n  title: ${guide.title}\n  covers: ${guide.tags.join(", ")}`,
    )
    .join("\n");
}

export function findGuide(guides, id) {
  if (!id || typeof id !== "string") return null;

  const [lang, slug] = id.split(":");
  return guides.find((guide) => guide.lang === lang && guide.slug === slug) ?? null;
}
