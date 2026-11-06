import type { Metadata } from "next";

import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "पेज नहीं मिला",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent lang="hi" />;
}
