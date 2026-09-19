import Link from "next/link";

import { formatDate } from "@/lib/format";
import { getImageDimensions } from "@/lib/image-manifest";
import {
  CYBERCRIME_PORTAL,
  HELPLINE_NUMBER,
  type LibraryBlock,
  type LibraryItem,
  getAlternateLanguageItem,
  getRelatedItems,
  libraryPath,
} from "@/lib/library";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const strings = {
  en: {
    steps: "Step by step",
    related: "Related guides",
    helplineTitle: "Report cyber crime",
    helplineBody: "Call the national helpline or file a report online. The first few hours matter most.",
    callAction: "Call 1930",
    credit: "Image credit",
    readIn: "पढ़ें हिंदी में",
    backToGallery: "All infographics",
    backToComics: "All comics",
  },
  hi: {
    steps: "क्या करें — कदम दर कदम",
    related: "संबंधित जानकारी",
    helplineTitle: "साइबर अपराध की शिकायत करें",
    helplineBody:
      "राष्ट्रीय हेल्पलाइन पर कॉल करें या ऑनलाइन शिकायत दर्ज करें। शुरुआती कुछ घंटे सबसे महत्वपूर्ण होते हैं।",
    callAction: "1930 पर कॉल करें",
    credit: "चित्र सौजन्य",
    readIn: "Read in English",
    backToGallery: "सभी इन्फोग्राफिक्स",
    backToComics: "सभी कॉमिक्स",
  },
} as const;

function Blocks({ blocks }: { blocks: LibraryBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return (
              <h2 key={index} className="mt-10 text-2xl font-bold text-hero sm:text-3xl">
                {block.text}
              </h2>
            );
          case "para":
            return (
              <p key={index} className="mt-4 text-base leading-8 text-slate-700">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="mt-4 space-y-3">
                {block.items.map((entry) => (
                  <li key={entry} className="flex gap-3 text-base leading-8 text-slate-700">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={index}
                className={`mt-6 rounded-card border p-6 text-base leading-8 ${
                  block.tone === "warn"
                    ? "border-accent/25 bg-[rgba(180,35,24,0.06)] text-slate-800"
                    : "border-border bg-surface text-slate-700"
                }`}
              >
                {block.tone === "warn" ? (
                  <span aria-hidden="true" className="mr-2 font-bold text-accent">
                    !
                  </span>
                ) : null}
                {block.text}
              </aside>
            );
        }
      })}
    </>
  );
}

export function LibraryArticle({ item }: { item: LibraryItem }) {
  const t = strings[item.lang];
  const related = getRelatedItems(item);
  const alternate = getAlternateLanguageItem(item);
  const backHref = item.kind === "comic" ? "/comics" : "/gallery";
  const backLabel = item.kind === "comic" ? t.backToComics : t.backToGallery;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <article lang={item.lang}>
        <header className="space-y-4 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-label text-muted">
            <span className="text-accent">{item.category}</span>
            <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
            {alternate ? (
              <Link href={libraryPath(alternate)} className="underline transition hover:text-accent">
                {t.readIn}
              </Link>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold leading-tight text-hero sm:text-4xl lg:text-5xl">
            {item.headline}
          </h1>
          <p className="text-lg leading-8 text-slate-700">{item.description}</p>
        </header>

        {item.assets.map((asset, index) => {
          const size = getImageDimensions(asset.src);

          return (
            <figure key={asset.src} className="mt-8">
              {/* Plain <img>: static export disables Next image optimisation, and
                  poster aspect ratios vary too much for a fixed container. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}${asset.src}`}
                alt={asset.alt}
                width={size?.width}
                height={size?.height}
                loading={index === 0 ? "eager" : "lazy"}
                className="h-auto w-full rounded-card border border-border bg-surface-strong"
              />
              {asset.caption ? (
                <figcaption className="mt-3 text-sm leading-6 text-muted">{asset.caption}</figcaption>
              ) : null}
            </figure>
          );
        })}

        <div className="mt-8">
          <Blocks blocks={item.blocks} />
        </div>

        {item.howTo ? (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-hero sm:text-3xl">{t.steps}</h2>
            <ol className="mt-6 space-y-5">
              {item.howTo.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5 rounded-card border border-border bg-surface p-6">
                  <span className="text-2xl font-bold text-accent/80">{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold text-hero">{step.title}</h3>
                    <p className="mt-2 text-base leading-8 text-slate-700">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {item.credit ? (
          <p className="mt-10 rounded-card border border-border bg-surface px-5 py-4 text-sm leading-7 text-muted">
            <span className="font-bold uppercase tracking-label">{t.credit}:</span> {item.credit}
          </p>
        ) : null}

        <section className="mt-12 rounded-panel border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8">
          <h2 className="text-2xl font-bold text-hero">{t.helplineTitle}</h2>
          <p className="mt-3 text-base leading-8 text-slate-700">{t.helplineBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${HELPLINE_NUMBER}`}
              className="rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-label text-white transition hover:bg-accent-dark"
            >
              {t.callAction}
            </a>
            <a
              href={CYBERCRIME_PORTAL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-bold uppercase tracking-label text-hero transition hover:border-accent hover:text-accent"
            >
              cybercrime.gov.in
            </a>
          </div>
        </section>
      </article>

      {related.length > 0 ? (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-2xl font-bold text-hero">{t.related}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((entry) => (
              <Link
                key={`${entry.lang}-${entry.slug}`}
                href={libraryPath(entry)}
                lang={entry.lang}
                className="rounded-card border border-border bg-surface p-5 transition hover:border-accent hover:bg-surface-strong"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-label text-muted">
                  {entry.category}
                </p>
                <h3 className="mt-3 text-base font-bold leading-snug text-hero">{entry.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Link
        href={backHref}
        className="mt-10 inline-block text-sm font-bold uppercase tracking-label text-muted transition hover:text-accent"
      >
        ← {backLabel}
      </Link>
    </div>
  );
}
