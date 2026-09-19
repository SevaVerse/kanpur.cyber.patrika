import type { Metadata } from "next";

import { getImageDimensions } from "@/lib/image-manifest";
import { type LibraryItem, getAlternateLanguageItem, libraryItemText, libraryPath } from "@/lib/library";
import { getSiteUrl } from "@/lib/site";

const SITE_NAME = "Cyber Vani";

function absolute(pathname: string) {
  return new URL(pathname.replace(/^\//, ""), getSiteUrl()).toString();
}

function canonicalFor(item: LibraryItem) {
  return absolute(`${libraryPath(item)}/`.replace(/\/+$/, "/"));
}

export function buildLibraryMetadata(item: LibraryItem): Metadata {
  const canonical = canonicalFor(item);
  const alternate = getAlternateLanguageItem(item);
  const image = absolute(item.assets[0]?.src ?? "/Site_logo.jpeg");

  const languages = alternate
    ? {
        [item.lang]: canonical,
        [alternate.lang]: canonicalFor(alternate),
        "x-default": item.lang === "en" ? canonical : canonicalFor(alternate),
      }
    : undefined;

  return {
    title: item.title,
    description: item.description,
    keywords: item.tags,
    alternates: { canonical, languages },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: item.lang === "hi" ? "hi_IN" : "en_IN",
      publishedTime: item.publishedAt,
      images: [{ url: image, alt: item.assets[0]?.alt ?? item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [image],
    },
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
      dateModified: item.publishedAt,
      wordCount,
      keywords: item.tags.join(", "),
      articleSection: item.category,
      mainEntityOfPage: canonical,
      url: canonical,
      author: { "@type": "Organization", name: SITE_NAME, url: siteUrl.toString() },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: absolute("/Site_logo.jpeg") },
      },
      image: item.assets.map((asset) => absolute(asset.src)),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
        {
          "@type": "ListItem",
          position: 2,
          name: item.kind === "comic" ? "Comics Kona" : "Infographics",
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

export function JsonLd({ schemas }: { schemas: Record<string, unknown>[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
