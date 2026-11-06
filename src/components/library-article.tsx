import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { AlertIcon, ArrowLeftIcon, DownloadIcon, ExternalIcon, PhoneIcon, SrOnly, WhatsAppIcon } from "@/components/icons";
import { Picture } from "@/components/picture";
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
import { whatsappShareUrl } from "@/lib/share";
import { canonicalUrl } from "@/lib/site-metadata";

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
    home: "Home",
    gallery: "Infographics",
    comics: "Comics Kona",
    breadcrumb: "Breadcrumb",
    by: "By",
    reviewedBy: "Reviewed by",
    updated: "Updated",
    download: "Download poster",
    whatsapp: "Share on WhatsApp",
    whatsappShort: "WhatsApp",
    newTab: "(opens in a new tab)",
    actions: "Quick actions",
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
    home: "होम",
    gallery: "इन्फोग्राफिक्स",
    comics: "कॉमिक्स कोना",
    breadcrumb: "ब्रेडक्रम्ब",
    by: "लेखक",
    reviewedBy: "समीक्षा",
    updated: "अपडेट",
    download: "पोस्टर डाउनलोड करें",
    whatsapp: "WhatsApp पर शेयर करें",
    whatsappShort: "WhatsApp",
    newTab: "(नए टैब में खुलता है)",
    actions: "त्वरित विकल्प",
  },
} as const;

function Blocks({ blocks }: { blocks: LibraryBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return (
              <h2 key={index} className="mt-10 text-2xl font-bold text-hero first:mt-0 sm:text-3xl">
                {block.text}
              </h2>
            );
          case "para":
            return (
              <p key={index} className="mt-4 text-base leading-8 text-slate-700 first:mt-0 sm:text-lg sm:leading-9">
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
            return block.tone === "warn" ? (
              <aside
                key={index}
                className="mt-6 flex gap-3 rounded-card border border-danger/20 bg-danger-soft p-5 text-base font-semibold leading-8 text-hero"
              >
                <AlertIcon className="mt-1.5 h-5 w-5 text-danger" />
                <span>{block.text}</span>
              </aside>
            ) : (
              <aside
                key={index}
                className="mt-6 rounded-card border border-info/15 bg-info-soft p-5 text-base leading-8 text-slate-700"
              >
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
  const shareUrl = whatsappShareUrl(item.title, canonicalUrl(libraryPath(item)));

  // Portrait posters sit in a sticky column beside the text on wide screens.
  // Landscape comics need the full width to stay legible, so they stack.
  const firstSize = item.assets[0] ? getImageDimensions(item.assets[0].src) : null;
  const sideBySide = Boolean(firstSize && firstSize.height > firstSize.width);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: "/" },
          { name: item.kind === "comic" ? t.comics : t.gallery, href: backHref },
          { name: item.title },
        ]}
      />

      <article lang={item.lang}>
        <header className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-bold text-danger">{item.category}</span>
            <time dateTime={item.publishedAt} className="text-muted">
              {formatDate(item.publishedAt)}
            </time>
            {alternate ? (
              <Link
                href={libraryPath(alternate)}
                lang={alternate.lang}
                hrefLang={alternate.lang}
                className="rounded-full border border-border bg-surface-strong px-3 py-1 text-xs font-bold text-hero transition hover:border-accent hover:text-accent"
              >
                {t.readIn}
              </Link>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold leading-tight text-hero text-balance sm:text-4xl lg:text-5xl">
            {item.headline}
          </h1>
          <p className="text-lg leading-8 text-slate-700">{item.description}</p>
          {item.author || item.reviewedBy || item.updatedAt ? (
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              {item.author ? (
                <span>
                  {t.by} <span className="font-semibold text-hero">{item.author.name}</span>
                  {item.author.role ? `, ${item.author.role}` : ""}
                </span>
              ) : null}
              {item.reviewedBy ? (
                <span>
                  {t.reviewedBy} <span className="font-semibold text-hero">{item.reviewedBy.name}</span>
                  {item.reviewedBy.role ? `, ${item.reviewedBy.role}` : ""}
                </span>
              ) : null}
              {item.updatedAt ? (
                <span>
                  {t.updated} <time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
                </span>
              ) : null}
            </p>
          ) : null}
        </header>

        <div
          className={
            sideBySide
              ? "mt-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-12"
              : "mt-8"
          }
        >
          <div className={sideBySide ? "space-y-4 lg:sticky lg:top-24" : "space-y-4"}>
            {item.assets.map((asset, index) => (
              <figure key={asset.src}>
                <Picture
                  src={asset.src}
                  alt={asset.alt}
                  sizes={sideBySide ? "(min-width: 1152px) 440px, (min-width: 1024px) 38vw, 92vw" : "(min-width: 1152px) 1088px, 92vw"}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  className="h-auto w-full rounded-card border border-border bg-surface-strong shadow-card"
                />
                {asset.caption ? (
                  <figcaption className="mt-2 text-sm leading-6 text-muted">{asset.caption}</figcaption>
                ) : null}
              </figure>
            ))}

            <div className="flex flex-wrap gap-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-safe px-5 text-sm font-bold text-white transition hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.whatsapp}
                <SrOnly>{t.newTab}</SrOnly>
              </a>
              {item.assets[0] ? (
                <a
                  href={`${basePath}${item.assets[0].src}`}
                  download
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-strong px-5 text-sm font-bold text-hero transition hover:border-accent hover:text-accent"
                >
                  <DownloadIcon className="h-4 w-4" />
                  {t.download}
                </a>
              ) : null}
            </div>
          </div>

          <div className={sideBySide ? "mt-10 lg:mt-0" : "mx-auto mt-10 max-w-3xl"}>
            <Blocks blocks={item.blocks} />

            {item.howTo ? (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-hero sm:text-3xl">{t.steps}</h2>
                <ol className="mt-6 space-y-4">
                  {item.howTo.steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="flex gap-4 rounded-card border border-border bg-surface-strong p-5 shadow-card"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-safe-soft text-base font-bold text-safe"
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-hero">{step.title}</h3>
                        <p className="mt-1 text-base leading-8 text-slate-700">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {item.credit ? (
              <p className="mt-10 rounded-card border border-border bg-surface px-5 py-4 text-sm leading-7 text-muted">
                <span className="font-bold">{t.credit}:</span> {item.credit}
              </p>
            ) : null}

            <section className="mt-12 rounded-panel bg-hero p-7 text-white sm:p-8">
              <h2 className="text-2xl font-bold">{t.helplineTitle}</h2>
              <p className="mt-2 text-base leading-8 text-slate-300">{t.helplineBody}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${HELPLINE_NUMBER}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-hero transition hover:bg-hero-accent"
                >
                  <PhoneIcon className="h-4 w-4 text-accent" />
                  {t.callAction}
                </a>
                <a
                  href={CYBERCRIME_PORTAL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:border-hero-accent hover:text-hero-accent"
                >
                  cybercrime.gov.in
                  <ExternalIcon className="h-4 w-4" />
                  <SrOnly>{t.newTab}</SrOnly>
                </a>
              </div>
            </section>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10" lang={item.lang}>
          <h2 className="text-2xl font-bold text-hero">{t.related}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((entry) => (
              <Link
                key={`${entry.lang}-${entry.slug}`}
                href={libraryPath(entry)}
                lang={entry.lang}
                className="group rounded-card border border-border bg-surface-strong p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-card"
              >
                <p className="text-xs font-bold text-accent">{entry.category}</p>
                <h3 className="mt-2 text-base font-bold leading-snug text-hero group-hover:text-accent">
                  {entry.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Link
        href={backHref}
        className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-accent"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {backLabel}
      </Link>

      {/*
        Mobile action bar. `sticky` rather than `fixed`: it rides the bottom of
        the screen while the guide is in view, then settles at the end of the
        content instead of covering the footer.
      */}
      <nav
        aria-label={t.actions}
        lang={item.lang}
        className="sticky bottom-0 z-30 -mx-4 mt-10 grid grid-cols-2 gap-2 border-t border-border bg-surface-strong/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:hidden"
      >
        <a
          href={`tel:${HELPLINE_NUMBER}`}
          className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white"
        >
          <PhoneIcon className="h-4 w-4" />
          {t.callAction}
        </a>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-safe text-sm font-bold text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t.whatsappShort}
          <SrOnly>{t.newTab}</SrOnly>
        </a>
      </nav>
    </div>
  );
}
