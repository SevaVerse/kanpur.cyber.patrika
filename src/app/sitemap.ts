import type { MetadataRoute } from "next";

import { briefingPath, getAllBriefings } from "@/lib/briefings";
import {
  getAlternateLanguageItem,
  getComics,
  getInfographics,
  getLibraryItems,
  libraryModifiedAt,
  libraryPath,
} from "@/lib/library";
import { absoluteUrl, canonicalUrl } from "@/lib/site-metadata";

export const dynamic = "force-static";

/**
 * Last real change to the evergreen pages (about, contact, policies). Bump it
 * by hand when their text changes.
 *
 * `lastmod` used to be the build time for every static route, so each weekly
 * deploy claimed /about and /contact had changed. Search engines learn to
 * ignore a sitemap's dates when they are always "now".
 */
const EVERGREEN_UPDATED = "2026-11-06";

/** Latest of the given ISO dates; the fallback only applies when there are none. */
function newest(dates: string[], fallback: string) {
  return dates.length > 0 ? dates.reduce((latest, date) => (date > latest ? date : latest)) : fallback;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const briefings = getAllBriefings();
  const latestBriefing = briefings[0]?.date ?? EVERGREEN_UPDATED;
  const latestInfographic = newest(getInfographics().map(libraryModifiedAt), EVERGREEN_UPDATED);
  const latestComic = newest(getComics().map(libraryModifiedAt), EVERGREEN_UPDATED);
  const latestAnything = newest([latestBriefing, latestInfographic, latestComic], EVERGREEN_UPDATED);

  // priority and changefreq are omitted: Google ignores both.
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", lastModified: latestAnything },
    { path: "/briefing", lastModified: latestBriefing },
    { path: "/gallery", lastModified: latestInfographic },
    { path: "/comics", lastModified: latestComic },
    { path: "/about", lastModified: EVERGREEN_UPDATED },
    { path: "/editorial-policy", lastModified: EVERGREEN_UPDATED },
    { path: "/contact", lastModified: EVERGREEN_UPDATED },
    { path: "/sponsors", lastModified: EVERGREEN_UPDATED },
    { path: "/privacy", lastModified: EVERGREEN_UPDATED },
  ].map((route) => ({ url: canonicalUrl(route.path), lastModified: route.lastModified }));

  // Evergreen guides: the pages most worth crawling. Posters go in as image
  // entries, because "digital arrest poster" is a real image-search query.
  const libraryEntries: MetadataRoute.Sitemap = getLibraryItems().map((item) => {
    const alternate = getAlternateLanguageItem(item);

    return {
      url: canonicalUrl(libraryPath(item)),
      lastModified: libraryModifiedAt(item),
      images: item.assets.map((asset) => absoluteUrl(asset.src)),
      ...(alternate
        ? {
            alternates: {
              languages: {
                [item.lang]: canonicalUrl(libraryPath(item)),
                [alternate.lang]: canonicalUrl(libraryPath(alternate)),
              },
            },
          }
        : {}),
    };
  });

  const briefingEntries: MetadataRoute.Sitemap = briefings.map((briefing) => ({
    url: canonicalUrl(briefingPath(briefing)),
    lastModified: briefing.date,
  }));

  return [...staticRoutes, ...libraryEntries, ...briefingEntries];
}
