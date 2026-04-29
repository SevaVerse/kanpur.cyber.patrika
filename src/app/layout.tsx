import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.github.io/kanpur_cyber_patrika/"),
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
