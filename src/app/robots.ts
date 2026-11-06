import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  // No `host`: it is a Yandex-only directive, and it was emitting a full URL
  // where Yandex expects a bare hostname.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("sitemap.xml", siteUrl).toString(),
  };
}
