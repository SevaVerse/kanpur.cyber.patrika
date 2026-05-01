import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Infographics Gallery",
  description:
    "Visual infographics on cyber security topics — phishing, ransomware, safe browsing, and digital hygiene — published by Kanpur Cyber Patrika.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Hero */}
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Visual Resources</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
          Infographics Gallery — cyber security made visual.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Download and share these free infographics to spread cyber awareness in your organisation, school, or
          community. New graphics are added with every weekly edition.
        </p>
      </section>

      {/* Interactive grid + lightbox */}
      <GalleryClient />

      {/* Submission CTA */}
      <section className="rounded-4xl border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Contribute</p>
        <h2 className="mt-3 text-3xl font-black text-hero">Have an infographic to share?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          We welcome submissions from security researchers, educators, and organisations. Send your infographic along
          with a short description and your attribution details to the editorial desk.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-2xl bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Submit Infographic
        </a>
      </section>
    </div>
  );
}
