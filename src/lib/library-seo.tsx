import type { Metadata } from "next";

import { getImageDimensions } from "@/lib/image-manifest";
import {
  type LibraryItem,
  type LibraryPerson,
  getAlternateLanguageItem,
  libraryItemText,
  libraryModifiedAt,
  libraryPath,
} from "@/lib/library";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME, absoluteUrl, canonicalUrl, pageMetadata } from "@/lib/site-metadata";

const absolute = absoluteUrl;

function canonicalFor(item: LibraryItem) {
  return canonicalUrl(libraryPath(item));
}

export function buildLibraryMetadata(item: LibraryItem): Metadata {
  const canonical = canonicalFor(item);
  const alternate = getAlternateLanguageItem(item);
  const poster = item.assets[0];
  const size = poster ? getImageDimensions(poster.src) : null;

  const languages = alternate
    ? {
        [item.lang]: canonical,
        [alternate.lang]: canonicalFor(alternate),
        "x-default": item.lang === "en" ? canonical : canonicalFor(alternate),
      }
    : undefined;

  return pageMetadata({
    title: item.title,
    description: item.description,
    path: libraryPath(item),
    lang: item.lang,
    type: "article",
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
    languages,
    // The poster is the most shareable thing on the page, so it is the card.
    image: poster
      ? { url: poster.src, alt: poster.alt, ...(size ?? {}) }
      : undefined,
  });
}

function person(entry: LibraryPerson) {
  return {
    "@type": "Person",
    name: entry.name,
    ...(entry.role ? { jobTitle: entry.role } : {}),
    ...(entry.url ? { url: entry.url } : {}),
  };
}

/**
 * Structured data for a topic page.
 *
 * `Article` describes the transcribed page text, which is ours. Each poster
 * additionally gets an `ImageObject`, carrying `creditText` when the artwork
 * came from somewhere else (government awareness material, for instance).
 * `HowTo` is emitted only where the source really is a sequence of steps.
 */
export function buildLibrarySchemas(item: LibraryItem) {
  const siteUrl = getSiteUrl();
  const canonical = canonicalFor(item);
  const wordCount = libraryItemText(item).split(/\s+/).filter(Boolean).length;

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: item.headline,
      description: item.description,
      inLanguage: item.lang === "hi" ? "hi-IN" : "en-IN",
      datePublished: item.publishedAt,
      dateModified: libraryModifiedAt(item),
      wordCount,
      keywords: item.tags.join(", "),
      articleSection: item.category,
      mainEntityOfPage: canonical,
      url: canonical,
      author: item.author
        ? person(item.author)
        : { "@type": "Organization", name: SITE_NAME, url: siteUrl.toString() },
      ...(item.reviewedBy ? { reviewedBy: person(item.reviewedBy) } : {}),
      publisher: { "@id": `${siteUrl.toString()}#organization` },
      isAccessibleForFree: true,
      image: item.assets.map((asset) => absolute(asset.src)),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: item.lang === "hi" ? "होम" : "Home", item: siteUrl.toString() },
        {
          "@type": "ListItem",
          position: 2,
          name:
            item.kind === "comic"
              ? item.lang === "hi"
                ? "कॉमिक्स कोना"
                : "Comics Kona"
              : item.lang === "hi"
                ? "इन्फोग्राफिक्स"
                : "Infographics",
          item: absolute(item.kind === "comic" ? "/comics/" : "/gallery/"),
        },
        { "@type": "ListItem", position: 3, name: item.title, item: canonical },
      ],
    },
  ];

  for (const asset of item.assets) {
    const size = getImageDimensions(asset.src);

    schemas.push({
      "@context": "https://schema.org",
      "@type": "ImageObject",
      contentUrl: absolute(asset.src),
      caption: asset.caption ?? asset.alt,
      description: asset.alt,
      ...(size ? { width: size.width, height: size.height } : {}),
      ...(item.credit ? { creditText: item.credit } : { creditText: SITE_NAME }),
    });
  }

  if (item.howTo) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: item.howTo.name,
      description: item.description,
      inLanguage: item.lang === "hi" ? "hi-IN" : "en-IN",
      step: item.howTo.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.text,
      })),
    });
  }

  return schemas;
}

export { JsonLd } from "@/lib/json-ld";
