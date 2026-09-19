import type { Metadata } from "next";
import Link from "next/link";

import { briefingPath, getAllBriefings } from "@/lib/briefings";
import { formatLongDate } from "@/lib/format";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;

const description =
  "Every Cyber Vani weekly briefing, newest first. Curated cyber security stories with our own take on why each one matters — links always go to the original publisher.";

export const metadata: Metadata = {
  title: "Weekly Briefings",
  description,
  alternates: { canonical: "briefing/" },
  openGraph: {
    title: "Weekly Briefings | Cyber Vani",
    description,
    siteName: "Cyber Vani",
    locale: "en_IN",
    type: "website",
    url: "briefing/",
    images: [{ url: logoPath, alt: "Cyber Vani logo" }],
  },
  twitter: { card: "summary_large_image", title: "Weekly Briefings | Cyber Vani", description },
};

export default function BriefingIndexPage() {
  const briefings = getAllBriefings();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Archive</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          Every weekly briefing we have published.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          A curated read of the cyber security stories that matter, published every Saturday. Nothing here
          ever gets deleted — each edition stays at its own permanent link.
        </p>
      </section>

      {briefings.length > 0 ? (
        <div className="space-y-5">
          {briefings.map((briefing) => (
            <Link
              key={briefing.date}
              href={briefingPath(briefing)}
              className="block rounded-4xl border border-border bg-surface p-7 transition hover:border-accent hover:bg-surface-strong"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
                <time dateTime={briefing.date}>{formatLongDate(briefing.date)}</time>
                {" · "}
                {briefing.stories.length} stories
              </p>
              <h2 className="mt-3 text-2xl font-black leading-snug text-hero">{briefing.title}</h2>
              {briefing.summary ? (
                <p className="mt-3 text-base leading-8 text-slate-700">{briefing.summary}</p>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-dashed border-border bg-surface-strong px-6 py-14 text-center">
          <p className="text-lg font-black text-hero">The first briefing is on its way.</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-700">
            In the meantime, our awareness library covers the scams doing the rounds right now — in Hindi and
            English.
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-accent-dark"
          >
            Browse the library
          </Link>
        </div>
      )}
    </div>
  );
}
