import type { Metadata } from "next";

import { getAllArticles } from "@/lib/news";
import { getSiteUrl } from "@/lib/site";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;
const metadataBase = getSiteUrl();

const siteDescription =
  "Your trusted source for cyber security news, threat intelligence, data breach reports, and digital safety guidance — published weekly.";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cyber Vani",
  url: metadataBase.toString(),
  logo: new URL(logoPath.replace(/^\//, ""), metadataBase).toString(),
  description: siteDescription,
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cyber Vani",
  url: metadataBase.toString(),
  description: siteDescription,
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Cyber Vani | Weekly Cyber Security Briefing",
    template: "%s | Cyber Vani",
  },
  description: siteDescription,
  keywords: ["cyber security news", "threat intelligence", "data breach", "ransomware", "Cyber Vani"],
  icons: {
    icon: logoPath,
    shortcut: logoPath,
    apple: logoPath,
  },
  openGraph: {
    title: "Cyber Vani | Weekly Cyber Security Briefing",
    description: siteDescription,
    siteName: "Cyber Vani",
    locale: "en_US",
    type: "website",
    url: "",
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
    description: siteDescription,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
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
