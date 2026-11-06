import type { Metadata, Viewport } from "next";

import { SiteShell } from "@/components/site-shell";
import { rootMetadata } from "@/lib/site-metadata";

/**
 * Opts out of Chrome Android Auto Dark Theme, which recolours the page
 * algorithmically. (The white-on-white 1930 button was a separate bug — an
 * unlayered `a { color: inherit }` beating Tailwind utilities; see globals.css.)
 */
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0f172a",
};

export const metadata: Metadata = rootMetadata("en");

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
