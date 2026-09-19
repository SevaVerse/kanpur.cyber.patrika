import type { MetadataRoute } from "next";

import { briefingPath, getAllBriefings } from "@/lib/briefings";
import { getLibraryItems, libraryPath } from "@/lib/library";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const url = (path: string) => new URL(path.replace(/^\//, ""), siteUrl).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "briefing/", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "gallery/", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "comics/", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "about/", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "contact/", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "sponsors/", priority: 0.4, changeFrequency: "monthly" as const },
  ].map((route) => ({
    url: url(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Evergreen guides: the pages most worth crawling.
  const libraryEntries: MetadataRoute.Sitemap = getLibraryItems().map((item) => ({
    url: url(`${libraryPath(item)}/`),
    lastModified: new Date(item.publishedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const briefingEntries: MetadataRoute.Sitemap = getAllBriefings().map((briefing) => ({
    url: url(`${briefingPath(briefing)}/`),
    lastModified: new Date(briefing.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...libraryEntries, ...briefingEntries];
}
