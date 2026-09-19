import type { Metadata } from "next";
import Link from "next/link";

import { LibraryGrid } from "@/components/library-grid";
import { getInfographics, toLibraryCard } from "@/lib/library";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;

const description =
  "Free cyber security infographics in Hindi and English — e-challan fraud, OTP scams, WhatsApp hacking, digital arrest, safe banking and more. Every poster has a full text guide.";

export const metadata: Metadata = {
  title: "Infographics Gallery",
  description,
  alternates: { canonical: "gallery/" },
  openGraph: {
    title: "Infographics Gallery | Cyber Vani",
    description,
    siteName: "Cyber Vani",
    locale: "en_IN",
    type: "website",
    url: "gallery/",
    images: [{ url: logoPath, alt: "Cyber Vani logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infographics Gallery | Cyber Vani",
    description,
    images: [logoPath],
  },
};

export default function GalleryPage() {
  const cards = getInfographics().map(toLibraryCard);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-panel border border-border bg-hero px-6 py-8 text-white shadow-panel sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-hero text-hero-accent">Visual Resources</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          Infographics Gallery — cyber security made visual.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Download and share these free infographics to spread cyber awareness in your organisation, school, or
          community. Every poster also has a full written guide you can read, search and share.
        </p>
        <Link
          href="/comics"
          className="mt-6 inline-block rounded-card border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/20"
        >
          Visit Comics Kona
        </Link>
      </section>

      <LibraryGrid items={cards} />

      <section className="rounded-panel border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-hero text-accent">Contribute</p>
        <h2 className="mt-3 text-3xl font-bold text-hero">Have an infographic to share?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          We welcome submissions from security researchers, educators, and organisations. Send your infographic along
          with a short description and your attribution details to the editorial desk.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-card bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Submit Infographic
        </Link>
      </section>
    </div>
  );
}
