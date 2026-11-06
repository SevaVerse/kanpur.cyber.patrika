import { statSync } from "node:fs";
import { join } from "node:path";

import { briefingPath, getAllBriefings } from "@/lib/briefings";
import { formatRfc822 } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import { getLibraryItems, libraryPath } from "@/lib/library";
import { getSiteUrl } from "@/lib/site";
import { absoluteUrl, canonicalUrl } from "@/lib/site-metadata";

const FEEDS: Record<Lang, { title: string; description: string; language: string; path: string }> = {
  en: {
    title: "Cyber Vani",
    description: "Weekly cyber fraud briefings and English awareness guides from Cyber Vani.",
    language: "en-in",
    path: "/feed.xml",
  },
  hi: {
    title: "साइबर वाणी",
    description: "साइबर वाणी की हिंदी जागरूकता गाइड और कॉमिक्स — साइबर ठगी से बचाव की आसान जानकारी।",
    language: "hi-in",
    path: "/hi/feed.xml",
  },
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS enclosure for a poster in public/, which requires its byte length. */
function enclosure(src: string) {
  try {
    const { size } = statSync(join(process.cwd(), "public", src));
    return `      <enclosure url="${escapeXml(absoluteUrl(src))}" length="${size}" type="image/jpeg" />`;
  } catch {
    return null;
  }
}

type Entry = {
  title: string;
  link: string;
  description: string;
  date: string;
  category: string;
  image?: string;
};

/**
 * One feed per language. The English feed used to carry Hindi guides under
 * `<language>en-in</language>`; feed readers and aggregators take that at its
 * word, so Hindi now has a feed of its own.
 */
export function buildFeed(lang: Lang) {
  const feed = FEEDS[lang];

  const entries: Entry[] = [
    ...(lang === "en"
      ? getAllBriefings().map((briefing) => ({
          title: briefing.title,
          link: canonicalUrl(briefingPath(briefing)),
          description:
            briefing.summary || `${briefing.stories.length} curated cyber fraud stories from this week.`,
          date: briefing.date,
          category: "Weekly Briefing",
        }))
      : []),
    ...getLibraryItems(lang).map((item) => ({
      title: item.title,
      link: canonicalUrl(libraryPath(item)),
      description: item.description,
      date: item.publishedAt,
      category: item.category,
      image: item.assets[0]?.src,
    })),
  ].sort((left, right) => right.date.localeCompare(left.date));

  const items = entries
    .map((entry) =>
      [
        "    <item>",
        `      <title>${escapeXml(entry.title)}</title>`,
        `      <link>${escapeXml(entry.link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(entry.link)}</guid>`,
        `      <description>${escapeXml(entry.description)}</description>`,
        `      <category>${escapeXml(entry.category)}</category>`,
        `      <pubDate>${formatRfc822(entry.date)}</pubDate>`,
        entry.image ? enclosure(entry.image) : null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  const lastBuildDate = entries[0] ? formatRfc822(entries[0].date) : new Date().toUTCString();

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(feed.title)}</title>`,
    `    <link>${escapeXml(getSiteUrl().toString())}</link>`,
    `    <description>${escapeXml(feed.description)}</description>`,
    `    <language>${feed.language}</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(absoluteUrl(feed.path))}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}

export function feedResponse(lang: Lang) {
  return new Response(buildFeed(lang), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
