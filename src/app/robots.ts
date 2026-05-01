import type { MetadataRoute } from "next";

export const dynamic = "force-static";

function getSiteUrl() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    return new URL("https://sevaverse.github.io/kanpur.cyber.patrika/");
  }

  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    return new URL("https://sevaverse.github.io/kanpur.cyber.patrika/");
  }

  return new URL(`https://${owner.toLowerCase()}.github.io/${repo}/`);
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("sitemap.xml", siteUrl).toString(),
    host: siteUrl.toString(),
  };
}