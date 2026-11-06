import type { Metadata } from "next";

import type { Lang } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

/**
 * One place for site-wide metadata, so every page emits a complete and
 * consistent set of Open Graph and Twitter tags.
 *
 * Next.js replaces a nested `openGraph` object wholesale rather than merging
 * it, which is how pages used to lose their image or locale. Building every
 * page's metadata through `pageMetadata` avoids that by construction.
 */

export const SITE_NAME = "Cyber Vani";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const DEFAULT_OG_IMAGE = "/og/site.png";

export const siteDescription: Record<Lang, string> = {
  en: "Weekly cyber fraud alerts and free Hindi and English guides on digital arrest, UPI and OTP scams, fake e-challans and WhatsApp hacking. Been defrauded? Call 1930.",
  hi: "साइबर ठगी से बचाव की आसान जानकारी — डिजिटल अरेस्ट, UPI और OTP फ्रॉड, फर्जी ई-चालान और WhatsApp हैकिंग पर मुफ़्त हिंदी गाइड। ठगी हुई है? तुरंत 1930 पर कॉल करें।",
};

export const siteTitle: Record<Lang, string> = {
  en: "Cyber Vani — Cyber fraud alerts and safety guides in Hindi & English",
  hi: "साइबर वाणी — साइबर ठगी से बचाव की जानकारी हिंदी में",
};

export const ogLocale: Record<Lang, string> = { en: "en_IN", hi: "hi_IN" };

export function absoluteUrl(pathname: string) {
  return new URL(pathname.replace(/^\//, ""), getSiteUrl()).toString();
}

/** Canonical form of a route: absolute, with the trailing slash the export uses. */
export function canonicalUrl(pathname: string) {
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return absoluteUrl(withSlash);
}

type ImageInput = { url: string; alt: string; width?: number; height?: number };

type PageMetadataInput = {
  title?: string;
  /** Use the title as-is, without the "| Cyber Vani" template. */
  absoluteTitle?: boolean;
  description: string;
  path: string;
  lang?: Lang;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  image?: ImageInput;
  languages?: Record<string, string>;
  robots?: Metadata["robots"];
};

/**
 * RSS discovery links. Declared on every page because a page's `alternates`
 * replaces the root layout's wholesale, which silently dropped them.
 */
export const feedAlternates = {
  "application/rss+xml": [
    { url: "/feed.xml", title: `${SITE_NAME} (English)` },
    { url: "/hi/feed.xml", title: `${SITE_NAME} (हिंदी)` },
  ],
};

export function pageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  lang = "en",
  type = "website",
  publishedTime,
  modifiedTime,
  image,
  languages,
  robots,
}: PageMetadataInput): Metadata {
  const canonical = canonicalUrl(path);
  const shareTitle = title && !absoluteTitle ? `${title} | ${SITE_NAME}` : (title ?? siteTitle[lang]);
  const ogImage = image ?? {
    url: DEFAULT_OG_IMAGE,
    alt: `${SITE_NAME} — cyber fraud alerts and awareness guides`,
    ...OG_IMAGE_SIZE,
  };

  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    description,
    alternates: { canonical, ...(languages ? { languages } : {}), types: feedAlternates },
    openGraph: {
      type,
      title: shareTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale[lang],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      images: [{ ...ogImage, url: absoluteUrl(ogImage.url) }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [absoluteUrl(ogImage.url)],
    },
    ...(robots ? { robots } : {}),
  };
}

/** Root-layout metadata shared by both language trees. */
export function rootMetadata(lang: Lang): Metadata {
  return {
    metadataBase: getSiteUrl(),
    title: { default: siteTitle[lang], template: `%s | ${SITE_NAME}` },
    description: siteDescription[lang],
    applicationName: SITE_NAME,
    alternates: { types: feedAlternates },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const EDITORIAL_POLICY_PATH = "/editorial-policy";

/**
 * NewsMediaOrganization rather than Organization: it carries the publishing
 * principles and corrections policy that search engines use as trust signals
 * for a publication covering financial fraud.
 */
export function organizationSchema() {
  const siteUrl = getSiteUrl().toString();

  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${siteUrl}#organization`,
    name: SITE_NAME,
    alternateName: "साइबर वाणी",
    url: siteUrl,
    logo: { "@type": "ImageObject", url: absoluteUrl("/Site_logo.jpeg"), width: 1254, height: 1254 },
    description: siteDescription.en,
    areaServed: ["Uttar Pradesh", "India"],
    knowsLanguage: ["en-IN", "hi-IN"],
    publishingPrinciples: canonicalUrl(EDITORIAL_POLICY_PATH),
    correctionsPolicy: `${canonicalUrl(EDITORIAL_POLICY_PATH)}#corrections`,
    actionableFeedbackPolicy: canonicalUrl("/contact"),
  };
}

export function webSiteSchema(lang: Lang) {
  const siteUrl = getSiteUrl().toString();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
    description: siteDescription[lang],
    publisher: { "@id": `${siteUrl}#organization` },
  };
}
