import { briefingPath, getAllBriefings } from "@/lib/briefings";
import { formatRfc822 } from "@/lib/format";
import { getLibraryItems, libraryPath } from "@/lib/library";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

const SITE_NAME = "Cyber Vani";
const SITE_DESCRIPTION =
  "Weekly cyber security briefings and a free Hindi/English awareness library from Cyber Vani.";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const siteUrl = getSiteUrl();
  const absolute = (path: string) => new URL(path.replace(/^\//, ""), siteUrl).toString();

  const entries = [
    ...getAllBriefings().map((briefing) => ({
      title: briefing.title,
      link: absolute(`${briefingPath(briefing)}/`),
      description:
        briefing.summary || `${briefing.stories.length} curated cyber security stories from this week.`,
      date: briefing.date,
      category: "Weekly Briefing",
    })),
    ...getLibraryItems().map((item) => ({
      title: item.title,
      link: absolute(`${libraryPath(item)}/`),
      description: item.description,
      date: item.publishedAt,
      category: item.category,
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
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${escapeXml(siteUrl.toString())}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>en-in</language>",
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(absolute("/feed.xml"))}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
