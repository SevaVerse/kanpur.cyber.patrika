import type { Metadata } from "next";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
