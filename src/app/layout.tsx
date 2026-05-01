import type { Metadata } from "next";

import { getAllArticles } from "@/lib/news";
import { Navbar } from "@/components/navbar";

import "./globals.css";

function getMetadataBase() {
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

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Kanpur Cyber Patrika | Weekly Cyber Security Briefing",
    template: "%s | Kanpur Cyber Patrika",
  },
  description:
    "A static cyber security news publication built with Next.js, covering breaches, malware, policy, and threat intelligence.",
  keywords: ["cyber security news", "threat intelligence", "data breach", "ransomware", "Kanpur Cyber Patrika"],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const articles = await getAllArticles();
  const searchArticles = articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    sourceName: article.sourceName,
    keywords: article.keywords,
    publishedAt: article.publishedAt,
  }));

  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen">
          <Navbar articles={searchArticles} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
