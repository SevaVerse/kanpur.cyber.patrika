import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeftIcon, ArrowRightIcon, ExternalIcon, ShieldIcon, SrOnly, WhatsAppIcon } from "@/components/icons";
import { formatLongDate } from "@/lib/format";
import { briefingPath, getAllBriefings, getBriefingByDate, sourceHost } from "@/lib/briefings";
import { JsonLd } from "@/lib/json-ld";
import { whatsappShareUrl } from "@/lib/share";
import { getSiteUrl } from "@/lib/site";
import { OG_IMAGE_SIZE, pageMetadata } from "@/lib/site-metadata";

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

  const description =
    briefing.summary ||
    `Cyber Vani's weekly cyber fraud briefing for ${formatLongDate(briefing.date)}, covering ${briefing.stories.length} stories.`;

  return pageMetadata({
    title: briefing.title,
    description,
    path: `/briefing/${briefing.date}`,
    type: "article",
    publishedTime: briefing.date,
    image: {
      url: `/og/briefing-${briefing.date}.png`,
      alt: `${briefing.title} — ${briefing.stories.length} stories`,
      ...OG_IMAGE_SIZE,
    },
  });
}

export default async function BriefingPage({ params }: BriefingPageProps) {
  const { date } = await params;
  const briefing = getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const canonical = new URL(`briefing/${briefing.date}/`, siteUrl).toString();

  // Briefings are sorted newest first.
  const all = getAllBriefings();
  const position = all.findIndex((entry) => entry.date === briefing.date);
  const newer = position > 0 ? all[position - 1] : null;
  const older = position >= 0 && position < all.length - 1 ? all[position + 1] : null;

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
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Weekly Briefings", href: "/briefing" },
          { name: briefing.title },
        ]}
      />

      <header className="space-y-4 border-b border-border pb-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-accent">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
          Weekly briefing
        </p>
        <h1 className="text-3xl font-bold leading-tight text-hero text-balance sm:text-4xl lg:text-5xl">
          {briefing.title}
        </h1>
        <p className="text-sm font-semibold text-muted">
          <time dateTime={briefing.date}>{formatLongDate(briefing.date)}</time>
          {" · "}
          {briefing.stories.length} stories
        </p>
        {briefing.summary ? <p className="text-lg leading-8 text-slate-700">{briefing.summary}</p> : null}
        <a
          href={whatsappShareUrl(briefing.title, canonical)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-safe px-5 text-sm font-bold text-white transition hover:opacity-90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Share this edition
          <SrOnly>on WhatsApp (opens in a new tab)</SrOnly>
        </a>
      </header>

      <ol className="mt-10 space-y-6">
        {briefing.stories.map((story, index) => (
          <li key={story.url} className="rounded-panel border border-border bg-surface-strong p-5 shadow-card sm:p-7">
            <div className="flex gap-4 sm:gap-5">
              <span aria-hidden="true" className="w-8 shrink-0 text-2xl font-bold text-accent/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold leading-snug text-hero text-balance sm:text-2xl">
                  <a href={story.url} target="_blank" rel="noreferrer" className="transition hover:text-accent">
                    {story.headline}
                    <SrOnly> (opens in a new tab)</SrOnly>
                  </a>
                </h2>
                <p className="mt-2 text-sm font-semibold text-muted">
                  {story.source}
                  {sourceHost(story.url) && sourceHost(story.url) !== story.source.toLowerCase()
                    ? ` · ${sourceHost(story.url)}`
                    : ""}
                </p>
                {story.take ? (
                  <div className="mt-4 border-l-4 border-accent/40 pl-4">
                    <p className="text-xs font-bold text-accent">Why it matters</p>
                    <p className="mt-1 text-base leading-8 text-slate-700">{story.take}</p>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {/* Route the reader into our own guide on this threat. */}
                  {story.guide ? (
                    <Link
                      href={story.guide.path}
                      lang={story.guide.lang}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-safe-soft px-4 text-sm font-bold text-safe transition hover:bg-safe hover:text-white sm:min-h-9"
                    >
                      <ShieldIcon className="h-4 w-4" />
                      <span>
                        {story.guide.lang === "hi" ? "बचाव कैसे करें" : "How to protect yourself"}:{" "}
                        <span className="font-semibold">{story.guide.title}</span>
                      </span>
                    </Link>
                  ) : null}
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition hover:text-accent-dark"
                  >
                    Read at {story.source}
                    <ExternalIcon className="h-3.5 w-3.5" />
                    <SrOnly>(opens in a new tab)</SrOnly>
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 space-y-3 rounded-card border border-border bg-surface px-5 py-4 text-sm leading-7 text-muted">
        <p>
          Every headline above links to the original publisher. Cyber Vani curates and comments; we do not
          reproduce other newsrooms&apos; reporting.
        </p>
        {briefing.generated === "ai-assisted" ? (
          <p>
            The &ldquo;why it matters&rdquo; notes in this edition are AI-assisted, written from the linked
            reporting and automatically checked against it before publication. Where a story could not be
            verified, we publish the link without a note rather than guess. See our{" "}
            <Link href="/editorial-policy" className="font-semibold text-accent hover:underline">
              editorial policy
            </Link>
            ; corrections are welcome via{" "}
            <Link href="/contact" className="font-semibold text-accent hover:underline">
              our contact page
            </Link>
            .
          </p>
        ) : null}
      </div>

      <nav aria-label="More editions" className="mt-10 grid gap-3 sm:grid-cols-2">
        {newer ? (
          <Link
            href={briefingPath(newer)}
            className="group rounded-card border border-border bg-surface-strong p-5 transition hover:border-accent"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Newer edition
            </span>
            <span className="mt-1 block font-bold text-hero group-hover:text-accent">{formatLongDate(newer.date)}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {older ? (
          <Link
            href={briefingPath(older)}
            className="group rounded-card border border-border bg-surface-strong p-5 text-right transition hover:border-accent"
          >
            <span className="flex items-center justify-end gap-1.5 text-xs font-semibold text-muted">
              Older edition
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 block font-bold text-hero group-hover:text-accent">{formatLongDate(older.date)}</span>
          </Link>
        ) : null}
      </nav>

      <Link
        href="/briefing"
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-accent"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All briefings
      </Link>
    </div>
  );
}
