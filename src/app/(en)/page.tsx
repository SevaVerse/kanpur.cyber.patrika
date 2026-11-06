import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon, ExternalIcon, PhoneIcon, ShieldIcon, SrOnly } from "@/components/icons";
import { LibraryGrid } from "@/components/library-grid";
import { type BriefingStory, briefingPath, getAllBriefings, getLatestBriefing, sourceHost } from "@/lib/briefings";
import { formatLongDate } from "@/lib/format";
import { getLibraryItem, getLibraryItems, libraryPath, toLibraryCard } from "@/lib/library";
import { pageMetadata, siteDescription, siteTitle } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: siteTitle.en,
  absoluteTitle: true,
  description: siteDescription.en,
  path: "/",
});

/**
 * Quick routes into the guides people most need. Entries whose guide does not
 * exist are dropped, so renaming a slug can never produce a dead chip.
 */
const SCAM_SHORTCUTS = [
  { slug: "digital-arrest", lang: "en", label: "Digital arrest" },
  { slug: "otp-scam", lang: "hi", label: "OTP फ्रॉड" },
  { slug: "fake-e-challan-scam", lang: "hi", label: "फर्जी ई-चालान" },
  { slug: "whatsapp-account-hack", lang: "hi", label: "WhatsApp हैक" },
  { slug: "mole-account", lang: "en", label: "Mole accounts" },
  { slug: "safe-digital-banking", lang: "en", label: "Safe banking" },
] as const;

function GuideChip({ story }: { story: BriefingStory }) {
  if (!story.guide) return null;

  return (
    <Link
      href={story.guide.path}
      lang={story.guide.lang}
      className="inline-flex items-center gap-1.5 rounded-full bg-safe-soft px-3 py-1.5 text-xs font-bold text-safe transition hover:bg-safe hover:text-white"
    >
      <ShieldIcon className="h-3.5 w-3.5" />
      {story.guide.lang === "hi" ? "बचाव कैसे करें" : "How to protect yourself"}
    </Link>
  );
}

function SourceLink({ story, className = "" }: { story: BriefingStory; className?: string }) {
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-semibold text-muted transition hover:text-accent ${className}`}
    >
      {sourceHost(story.url) || story.source}
      <ExternalIcon className="h-3 w-3" />
      <SrOnly>(opens in a new tab)</SrOnly>
    </a>
  );
}

export default function HomePage() {
  const latest = getLatestBriefing();
  const archive = getAllBriefings().slice(1, 4);
  const featured = getLibraryItems().slice(0, 6).map(toLibraryCard);
  const shortcuts = SCAM_SHORTCUTS.filter((entry) => getLibraryItem(entry.slug, entry.lang));

  const stories = latest?.stories ?? [];
  const lead = stories.find((story) => story.take) ?? stories[0];
  const rest = stories.filter((story) => story !== lead).slice(0, 5);

  return (
    <>
      {/* Hero — full bleed, the one dark band on the page */}
      <section className="relative overflow-hidden bg-hero text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(245,158,11,0.18),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(180,35,24,0.28),transparent_40%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:px-8 lg:py-20">
          <div className="animate-rise-in">
            <p className="flex items-center gap-2 text-sm font-semibold text-hero-accent">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-hero-accent" />
              Cyber fraud alerts · Hindi &amp; English
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] text-balance sm:text-6xl">
              Know the scam before it finds you.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Free guides on digital arrest, UPI and OTP fraud, fake e-challans and WhatsApp hacking — plus a weekly
              briefing of the cases making news, each linked to how to protect yourself.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-hero transition hover:bg-hero-accent"
              >
                Browse the guides
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              {latest ? (
                <Link
                  href={briefingPath(latest)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:border-hero-accent hover:text-hero-accent"
                >
                  This week&apos;s briefing
                </Link>
              ) : null}
            </div>
          </div>

          {/* Helpline — the most immediately useful thing on the page */}
          <aside
            aria-labelledby="helpline-heading"
            className="rounded-panel border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-7"
          >
            <h2 id="helpline-heading" className="text-lg font-bold">
              Been defrauded?
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Report it in the first few hours — that is when money is most likely to be recovered.
            </p>
            <a
              href="tel:1930"
              className="mt-5 flex items-center justify-center gap-3 rounded-card bg-white px-5 py-4 text-hero transition hover:bg-hero-accent"
            >
              <PhoneIcon className="h-7 w-7 text-accent" />
              <span className="text-4xl font-bold tracking-tight">1930</span>
              <SrOnly>— call the National Cyber Crime Helpline</SrOnly>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-card border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-hero-accent hover:text-hero-accent"
            >
              File at cybercrime.gov.in
              <ExternalIcon className="h-4 w-4" />
              <SrOnly>(opens in a new tab)</SrOnly>
            </a>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              National Cyber Crime Helpline, 24x7. In Uttar Pradesh you can also write to the UP Police Cyber Cell.
            </p>
          </aside>
        </div>

        {shortcuts.length > 0 ? (
          <nav aria-label="Scam guides" className="relative border-t border-white/10">
            <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
              <span className="shrink-0 self-center pr-1 text-xs font-semibold text-slate-400">Common scams:</span>
              {shortcuts.map((entry) => (
                <Link
                  key={`${entry.lang}-${entry.slug}`}
                  href={libraryPath(entry)}
                  lang={entry.lang}
                  className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-hero-accent hover:text-hero-accent"
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* This week — newspaper layout: one lead, a compact list */}
        {latest && lead ? (
          <section aria-labelledby="this-week" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-accent">
                  <time dateTime={latest.date}>{formatLongDate(latest.date)}</time>
                </p>
                <h2 id="this-week" className="mt-1 text-3xl font-bold text-hero">
                  This week in cyber fraud
                </h2>
              </div>
              <Link
                href={briefingPath(latest)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition hover:text-accent-dark"
              >
                All {latest.stories.length} stories
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="flex flex-col rounded-panel border border-border bg-surface-strong p-6 shadow-card sm:p-8">
                <p className="text-xs font-bold text-danger">Lead story</p>
                <h3 className="mt-3 text-2xl font-bold leading-snug text-hero text-balance sm:text-3xl">
                  <a href={lead.url} target="_blank" rel="noreferrer" className="transition hover:text-accent">
                    {lead.headline}
                    <SrOnly> (opens in a new tab)</SrOnly>
                  </a>
                </h3>
                {lead.take ? (
                  <div className="mt-5 border-l-4 border-accent/40 pl-4">
                    <p className="text-xs font-bold text-accent">Why it matters</p>
                    <p className="mt-1 text-base leading-8 text-slate-700">{lead.take}</p>
                  </div>
                ) : null}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <GuideChip story={lead} />
                  <SourceLink story={lead} className="ml-auto" />
                </div>
              </article>

              <ol className="divide-y divide-border rounded-panel border border-border bg-surface-strong px-5 shadow-card">
                {rest.map((story, index) => (
                  <li key={story.url} className="flex gap-4 py-4">
                    <span aria-hidden="true" className="w-6 shrink-0 pt-0.5 text-lg font-bold text-accent/60">
                      {index + 2}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold leading-snug text-hero">
                        <a href={story.url} target="_blank" rel="noreferrer" className="transition hover:text-accent">
                          {story.headline}
                          <SrOnly> (opens in a new tab)</SrOnly>
                        </a>
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <SourceLink story={story} />
                        <GuideChip story={story} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : (
          <div className="rounded-panel border border-dashed border-border bg-surface-strong p-6 text-sm text-slate-700">
            The next briefing publishes on Saturday. Meanwhile, browse the awareness library below.
          </div>
        )}

        {/* Awareness library */}
        <section aria-labelledby="library-heading" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-accent">Awareness library</p>
              <h2 id="library-heading" className="mt-1 text-3xl font-bold text-hero">
                Free guides in Hindi and English
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
                Every poster and comic, with its full text — easy to read, search and forward to family.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition hover:text-accent-dark"
            >
              Browse all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <LibraryGrid items={featured} />
        </section>

        {/* Archive */}
        {archive.length > 0 ? (
          <section aria-labelledby="archive-heading" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="archive-heading" className="text-3xl font-bold text-hero">
                Earlier briefings
              </h2>
              <Link
                href="/briefing"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition hover:text-accent-dark"
              >
                Full archive
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {archive.map((briefing) => (
                <Link
                  key={briefing.date}
                  href={briefingPath(briefing)}
                  className="group rounded-panel border border-border bg-surface-strong p-6 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-card"
                >
                  <p className="text-xs font-semibold text-muted">
                    <time dateTime={briefing.date}>{formatLongDate(briefing.date)}</time> ·{" "}
                    {briefing.stories.length} stories
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-hero group-hover:text-accent">
                    {briefing.title}
                  </h3>
                  {briefing.summary ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">{briefing.summary}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
