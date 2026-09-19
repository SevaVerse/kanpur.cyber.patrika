import type { Metadata } from "next";
import Link from "next/link";

import { LibraryGrid } from "@/components/library-grid";
import { briefingPath, getAllBriefings, getLatestBriefing, sourceHost } from "@/lib/briefings";
import { formatLongDate } from "@/lib/format";
import { getLibraryItems, toLibraryCard } from "@/lib/library";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latest = getLatestBriefing();
  const archive = getAllBriefings().slice(1, 4);
  const featured = getLibraryItems().slice(0, 6).map(toLibraryCard);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Hero */}
      <section className="animate-rise-in overflow-hidden rounded-4xl border border-white/10 bg-hero text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.85)]">
        <div className="grid gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1.4fr_0.8fr] lg:px-12 lg:py-12">
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Weekly Briefing</p>
            <h1 className="max-w-4xl text-4xl font-black uppercase leading-none sm:text-5xl lg:text-6xl">
              Cyber security news you can trust, delivered fresh every week.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Every Saturday we curate the cyber security stories that matter — breaches, scams, threats and
              policy — and explain what they mean for you.
            </p>

            {latest ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-hero-accent">Latest Edition</p>
                <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
                  {latest.title}
                </h2>
                {latest.summary ? (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">{latest.summary}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                  <time dateTime={latest.date}>{formatLongDate(latest.date)}</time>
                  <span>{latest.stories.length} stories</span>
                  <Link
                    href={briefingPath(latest)}
                    className="rounded-full bg-white px-5 py-3 text-hero transition hover:bg-hero-accent"
                  >
                    Read the briefing
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
                The next briefing publishes on Saturday. Meanwhile, browse the awareness library below.
              </div>
            )}
          </div>

          {/* Helpline rail — the most immediately useful thing on the page */}
          <aside className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Been defrauded?</h2>
            <p className="text-sm leading-7 text-slate-300">
              Report it in the first few hours — that is when money is most likely to be recovered.
            </p>
            <a
              href="tel:1930"
              className="block rounded-2xl bg-white px-5 py-4 text-center text-3xl font-black text-hero transition hover:bg-hero-accent"
            >
              1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-white/20 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-hero-accent hover:text-hero-accent"
            >
              cybercrime.gov.in
            </a>
            <p className="text-xs leading-6 text-slate-400">
              National Cyber Crime Helpline, 24x7. For Uttar Pradesh incidents you can also write to the UP
              Police Cyber Cell.
            </p>
          </aside>
        </div>
      </section>

      {/* Latest briefing stories */}
      {latest ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">In This Edition</p>
              <h2 className="mt-2 text-3xl font-black uppercase text-hero">This week&apos;s stories</h2>
            </div>
            <Link
              href={briefingPath(latest)}
              className="text-sm font-bold uppercase tracking-[0.22em] text-accent transition hover:text-accent-dark"
            >
              See all {latest.stories.length} →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latest.stories.slice(0, 6).map((story) => (
              <article
                key={story.url}
                className="flex h-full flex-col rounded-[1.75rem] border border-border bg-surface p-6 transition hover:border-accent"
              >
                <a href={story.url} target="_blank" rel="noreferrer" className="group">
                  <h3 className="text-lg font-black leading-snug text-hero transition group-hover:text-accent">
                    {story.headline}
                  </h3>
                </a>
                {story.take ? (
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-slate-700">{story.take}</p>
                ) : (
                  <span className="flex-1" />
                )}
                {story.guide ? (
                  <Link
                    href={story.guide.path}
                    lang={story.guide.lang}
                    className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] text-accent transition hover:text-accent-dark"
                  >
                    🛡 {story.guide.lang === "hi" ? "बचाव कैसे करें" : "How to protect yourself"} →
                  </Link>
                ) : null}
                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 border-t border-border pt-4 text-xs font-bold uppercase tracking-[0.2em] text-muted transition hover:text-accent"
                >
                  {sourceHost(story.url) || story.source} ↗
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Awareness library */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Awareness Library</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-hero">Know the scam before it finds you</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
              Free guides in Hindi and English on the frauds doing the rounds right now — digital arrest, fake
              e-challans, OTP theft and more.
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-bold uppercase tracking-[0.22em] text-accent transition hover:text-accent-dark"
          >
            Browse all →
          </Link>
        </div>
        <LibraryGrid items={featured} />
      </section>

      {/* Archive */}
      {archive.length > 0 ? (
        <section className="space-y-6">
          <div className="border-b border-border pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Archive</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-hero">Earlier briefings</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {archive.map((briefing) => (
              <Link
                key={briefing.date}
                href={briefingPath(briefing)}
                className="rounded-[1.75rem] border border-border bg-surface p-6 transition hover:border-accent hover:bg-surface-strong"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">
                  <time dateTime={briefing.date}>{formatLongDate(briefing.date)}</time>
                </p>
                <h3 className="mt-3 text-lg font-black leading-snug text-hero">{briefing.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
