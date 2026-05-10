import type { Metadata } from "next";

import { getAllArticles } from "@/lib/news";
import { getSiteUrl } from "@/lib/site";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;
const metadataBase = getSiteUrl();

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cyber Vani",
  url: metadataBase.toString(),
  logo: new URL(logoPath.replace(/^\//, ""), metadataBase).toString(),
  description:
    "A static cyber security news publication covering breaches, malware, policy, and threat intelligence.",
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Cyber Vani | Weekly Cyber Security Briefing",
    template: "%s | Cyber Vani",
  },
  description:
    "A static cyber security news publication built with Next.js, covering breaches, malware, policy, and threat intelligence.",
  keywords: ["cyber security news", "threat intelligence", "data breach", "ransomware", "Cyber Vani"],
  icons: {
    icon: logoPath,
    shortcut: logoPath,
    apple: logoPath,
  },
  openGraph: {
    title: "Cyber Vani | Weekly Cyber Security Briefing",
    description:
      "A static cyber security news publication built with Next.js, covering breaches, malware, policy, and threat intelligence.",
    siteName: "Cyber Vani",
    type: "website",
    images: [
      {
        url: logoPath,
        alt: "Cyber Vani logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Vani | Weekly Cyber Security Briefing",
    description:
      "A static cyber security news publication built with Next.js, covering breaches, malware, policy, and threat intelligence.",
    images: [logoPath],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <div className="relative min-h-screen">
          <Navbar articles={searchArticles} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
