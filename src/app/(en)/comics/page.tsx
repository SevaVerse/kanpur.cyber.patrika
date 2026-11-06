import type { Metadata } from "next";
import Link from "next/link";

import { LibraryGrid } from "@/components/library-grid";
import { getComics, toLibraryCard } from "@/lib/library";
import { pageMetadata } from "@/lib/site-metadata";

const description =
  "साइबर जागरूकता कॉमिक्स — डिजिटल अरेस्ट, ठगी के तरीके और बचाव के उपाय आसान हिंदी में, चित्रों के साथ। हर कॉमिक के साथ पूरी लिखित जानकारी भी।";

export const metadata: Metadata = pageMetadata({
  title: "Comics Kona — साइबर ठगी पर हिंदी कॉमिक्स",
  description,
  path: "/comics",
  lang: "hi",
});

export default function ComicsPage() {
  const cards = getComics().map(toLibraryCard);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-panel border border-border bg-hero px-6 py-8 text-white shadow-panel sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-hero text-hero-accent">Visual Storytelling</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Comics Kona</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base" lang="hi">
          साइबर ठगी कैसे होती है और बचाव कैसे करें — आसान हिंदी कॉमिक्स में समझें। हर कॉमिक के साथ पूरी लिखित
          जानकारी भी उपलब्ध है।
        </p>
      </section>

      <LibraryGrid items={cards} />

      <section className="rounded-panel border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-hero text-accent">Explore More</p>
        <h2 className="mt-3 text-3xl font-bold text-hero">Want infographics too?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          Browse the infographic collection for posters and quick-reference visuals on cyber safety, scams, and digital hygiene.
        </p>
        <Link
          href="/gallery"
          className="mt-6 inline-block rounded-card bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Open Gallery
        </Link>
      </section>
    </div>
  );
}
