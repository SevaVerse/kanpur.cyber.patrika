import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatLongDate } from "@/lib/format";
import { getAllBriefings, getBriefingByDate, sourceHost } from "@/lib/briefings";
import { JsonLd } from "@/lib/library-seo";
import { getSiteUrl } from "@/lib/site";

type BriefingPageProps = {
  params: Promise<{ date: string }>;
};

export function generateStaticParams() {
  return getAllBriefings().map((briefing) => ({ date: briefing.date }));
}

export async function generateMetadata({ params }: BriefingPageProps): Promise<Metadata> {
  const { date } = await params;
  const briefing = getBriefingByDate(date);

  if (!briefing) {
    return { title: "Briefing not found" };
  }

  const canonical = new URL(`briefing/${briefing.date}/`, getSiteUrl()).toString();
  const description =
    briefing.summary ||
    `Cyber Vani's weekly cyber security briefing for ${briefing.date}, covering ${briefing.stories.length} stories.`;

  return {
    title: briefing.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: briefing.title,
      description,
      url: canonical,
      siteName: "Cyber Vani",
      locale: "en_IN",
      publishedTime: briefing.date,
    },
    twitter: { card: "summary_large_image", title: briefing.title, description },
  };
}

export default async function BriefingPage({ params }: BriefingPageProps) {
  const { date } = await params;
  const briefing = getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const canonical = new URL(`briefing/${briefing.date}/`, siteUrl).toString();

  /**
   * ItemList, not NewsArticle. We are curating and commenting on other
   * newsrooms' reporting, and the schema should say exactly that.
   */
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: briefing.title,
      description: briefing.summary || undefined,
      numberOfItems: briefing.stories.length,
      url: canonical,
      itemListElement: briefing.stories.map((story, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: story.headline,
        url: story.url,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
        {
          "@type": "ListItem",
          position: 2,
          name: "Weekly Briefings",
          item: new URL("briefing/", siteUrl).toString(),
        },
        { "@type": "ListItem", position: 3, name: briefing.title, item: canonical },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <JsonLd schemas={schemas} />

      <header className="space-y-4 border-b border-border pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Weekly Briefing</p>
        <h1 className="text-3xl font-black leading-tight text-hero sm:text-4xl lg:text-5xl">
          {briefing.title}
        </h1>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          <time dateTime={briefing.date}>{formatLongDate(briefing.date)}</time>
          {" · "}
          {briefing.stories.length} stories
        </p>
        {briefing.summary ? (
          <p className="text-lg leading-8 text-slate-700">{briefing.summary}</p>
        ) : null}
      </header>

      <ol className="mt-10 space-y-8">
        {briefing.stories.map((story, index) => (
          <li key={story.url} className="border-b border-border pb-8 last:border-0">
            <div className="flex gap-5">
              <span className="text-2xl font-black text-accent/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-black leading-snug text-hero sm:text-2xl">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-accent"
                  >
                    {story.headline}
                  </a>
                </h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-muted">
                  {story.source}
                  {sourceHost(story.url) ? ` · ${sourceHost(story.url)}` : ""}
                </p>
                {story.take ? (
                  <div className="mt-4 rounded-2xl border-l-4 border-accent/40 bg-surface px-5 py-4">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-accent">
                      Why it matters
                    </p>
                    <p className="mt-2 text-base leading-8 text-slate-700">{story.take}</p>
                  </div>
                ) : null}

                {/* Route the reader into our own guide on this threat. */}
                {story.guide ? (
                  <Link
                    href={story.guide.path}
                    lang={story.guide.lang}
                    className="mt-4 flex items-center gap-3 rounded-2xl border border-accent/25 bg-[rgba(180,35,24,0.05)] px-5 py-4 transition hover:border-accent hover:bg-[rgba(180,35,24,0.09)]"
                  >
                    <span aria-hidden="true" className="text-xl">
                      🛡
                    </span>
                    <span>
                      <span className="block text-[0.68rem] font-bold uppercase tracking-[0.25em] text-accent">
                        {story.guide.lang === "hi" ? "बचाव कैसे करें" : "How to protect yourself"}
                      </span>
                      <span className="mt-1 block text-sm font-bold text-hero">{story.guide.title}</span>
                    </span>
                  </Link>
                ) : null}

                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.22em] text-accent transition hover:text-accent-dark"
                >
                  Read at {story.source} ↗
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 space-y-3 rounded-2xl border border-border bg-surface px-5 py-4 text-sm leading-7 text-muted">
        <p>
          Every headline above links to the original publisher. Cyber Vani curates and comments; we do not
          reproduce other newsrooms&apos; reporting.
        </p>
        {briefing.generated === "ai-assisted" ? (
          <p>
            The &ldquo;why it matters&rdquo; notes in this edition are AI-assisted, written from the linked
            reporting and checked against it before publication. Where a story could not be verified, we
            publish the link without a note rather than guess. Corrections are welcome via{" "}
            <Link href="/contact" className="font-semibold text-accent hover:underline">
              our contact page
            </Link>
            .
          </p>
        ) : null}
      </div>

      <Link
        href="/briefing"
        className="mt-10 inline-block text-sm font-bold uppercase tracking-[0.24em] text-muted transition hover:text-accent"
      >
        ← All briefings
      </Link>
    </div>
  );
}
