import type { Metadata } from "next";

import { getSearchEntries } from "@/lib/search";
import { getSiteUrl } from "@/lib/site";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
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
  keywords: ["cyber security news", "cyber fraud India", "digital arrest", "OTP scam", "साइबर अपराध", "Cyber Vani"],
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchEntries = getSearchEntries();

  return (
    <html lang="en">
      <body>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Cyber Vani"
          href={`${basePath}/feed.xml`}
        />
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
        <div className="relative flex min-h-screen flex-col">
          <Navbar entries={searchEntries} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
