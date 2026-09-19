import type { Metadata } from "next";
import Link from "next/link";

import { LibraryGrid } from "@/components/library-grid";
import { getComics, toLibraryCard } from "@/lib/library";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;

const description =
  "साइबर जागरूकता कॉमिक्स — डिजिटल अरेस्ट, ठगी के तरीके और बचाव के उपाय आसान हिंदी में, चित्रों के साथ। हर कॉमिक के साथ पूरी लिखित जानकारी भी।";

export const metadata: Metadata = {
  title: "Comics Kona",
  description,
  alternates: { canonical: "comics/" },
  openGraph: {
    title: "Comics Kona | Cyber Vani",
    description,
    siteName: "Cyber Vani",
    locale: "hi_IN",
    type: "website",
    url: "comics/",
    images: [{ url: logoPath, alt: "Cyber Vani logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comics Kona | Cyber Vani",
    description,
    images: [logoPath],
  },
};

export default function ComicsPage() {
  const cards = getComics().map(toLibraryCard);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Visual Storytelling</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">Comics Kona</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base" lang="hi">
          साइबर ठगी कैसे होती है और बचाव कैसे करें — आसान हिंदी कॉमिक्स में समझें। हर कॉमिक के साथ पूरी लिखित
          जानकारी भी उपलब्ध है।
        </p>
      </section>

      <LibraryGrid items={cards} />

      <section className="rounded-4xl border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Explore More</p>
        <h2 className="mt-3 text-3xl font-black text-hero">Want infographics too?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          Browse the infographic collection for posters and quick-reference visuals on cyber safety, scams, and digital hygiene.
        </p>
        <Link
          href="/gallery"
          className="mt-6 inline-block rounded-2xl bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Open Gallery
        </Link>
      </section>
    </div>
  );
}
