import type { Metadata } from "next";

import { NotFoundContent } from "@/components/not-found-content";
import { SiteShell } from "@/components/site-shell";
import { rootMetadata } from "@/lib/site-metadata";

/**
 * 404 for URLs that match no route at all. Needed because the app has two
 * root layouts (English and Hindi), so there is no single layout for Next.js
 * to compose a not-found page from. The static export writes this to
 * 404.html, which GitHub Pages serves for unknown paths.
 */
export const metadata: Metadata = {
  ...rootMetadata("en"),
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <SiteShell lang="en">
      <NotFoundContent lang="en" />
    </SiteShell>
  );
}
