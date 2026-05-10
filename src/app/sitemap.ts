import type { MetadataRoute } from "next";

import { getAllArticles } from "@/lib/news";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const articles = await getAllArticles();

  const staticRoutes = ["", "about/", "contact/", "gallery/", "sponsors/"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: new URL(`articles/${article.slug}/`, siteUrl).toString(),
    lastModified: new Date(article.publishedAt),
    changeFrequency: "weekly",
    priority: article.featured ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...articleEntries];
}