import type { Metadata } from "next";
import Link from "next/link";

import { LibraryGrid } from "@/components/library-grid";
import { getInfographics, toLibraryCard } from "@/lib/library";
import { pageMetadata } from "@/lib/site-metadata";
import { PageHeader } from "@/components/page-header";

const description =
  "Free cyber security infographics in Hindi and English — e-challan fraud, OTP scams, WhatsApp hacking, digital arrest, safe banking and more. Every poster has a full text guide.";

export const metadata: Metadata = pageMetadata({
  title: "Cyber Fraud Awareness Posters in Hindi & English",
  description,
  path: "/gallery",
});

export default function GalleryPage() {
  const cards = getInfographics().map(toLibraryCard);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        kicker="Infographics"
        title="Cyber fraud awareness posters, in Hindi and English"
        actions={
          <Link
            href="/comics"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-strong px-5 py-2.5 text-sm font-bold text-hero transition hover:border-accent hover:text-accent"
          >
            Visit Comics Kona
          </Link>
        }
      >
        Free to download and share with your family, school or community. Every poster also has a full written
        guide you can read, search and forward.
      </PageHeader>

      <LibraryGrid items={cards} variant="masonry" filterable />

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
