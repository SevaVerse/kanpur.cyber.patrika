import type { Metadata } from "next";
import Link from "next/link";

import { briefingPath, getAllBriefings } from "@/lib/briefings";
import { formatLongDate } from "@/lib/format";
import { pageMetadata } from "@/lib/site-metadata";
import { PageHeader } from "@/components/page-header";

const description =
  "Every Cyber Vani weekly briefing, newest first. Curated cyber security stories with our own take on why each one matters — links always go to the original publisher.";

export const metadata: Metadata = pageMetadata({
  title: "Weekly Cyber Fraud Briefings",
  description,
  path: "/briefing",
});

export default function BriefingIndexPage() {
  const briefings = getAllBriefings();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader kicker="Weekly briefings" title="Every weekly briefing we have published">
        The cyber fraud stories that mattered each week, every Saturday, each linked to the guide that explains how
        to stay safe. Nothing here is ever deleted — each edition keeps its own permanent link.
      </PageHeader>

      {briefings.length > 0 ? (
        <div className="space-y-5">
          {briefings.map((briefing) => (
            <Link
              key={briefing.date}
              href={briefingPath(briefing)}
              className="block rounded-panel border border-border bg-surface p-7 transition hover:border-accent hover:bg-surface-strong"
            >
              <p className="text-xs font-bold uppercase tracking-label text-muted">
                <time dateTime={briefing.date}>{formatLongDate(briefing.date)}</time>
                {" · "}
                {briefing.stories.length} stories
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-snug text-hero">{briefing.title}</h2>
              {briefing.summary ? (
                <p className="mt-3 text-base leading-8 text-slate-700">{briefing.summary}</p>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-panel border border-dashed border-border bg-surface-strong px-6 py-14 text-center">
          <p className="text-lg font-bold text-hero">The first briefing is on its way.</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-700">
            In the meantime, our awareness library covers the scams doing the rounds right now — in Hindi and
            English.
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-label text-white transition hover:bg-accent-dark"
          >
            Browse the library
          </Link>
        </div>
      )}
    </div>
  );
}
