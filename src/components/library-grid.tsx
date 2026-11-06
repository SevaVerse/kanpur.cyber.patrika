"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, ExpandIcon, ShareIcon, WhatsAppIcon } from "@/components/icons";
import { PictureView } from "@/components/picture-view";
import { formatDate } from "@/lib/format";
import type { ImageEntry } from "@/lib/image-manifest";
import { whatsappShareUrl } from "@/lib/share";

/** Lean card shape, so the full library never reaches the client bundle. */
export type LibraryCard = {
  slug: string;
  lang: "en" | "hi";
  href: string;
  /** Absolute canonical URL, for sharing. */
  shareUrl: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  image: ImageEntry | null;
};

/** Rendered card width: three columns at lg, two at sm, full width below. */
const CARD_SIZES = "(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw";

/** Category -> semantic colour token (see globals.css). */
const categoryTone: Record<string, string> = {
  Phishing: "bg-danger-soft text-danger",
  Ransomware: "bg-danger-soft text-danger",
  Awareness: "bg-safe-soft text-safe",
  "जागरूकता": "bg-safe-soft text-safe",
  "Social Engineering": "bg-social-soft text-social",
  "सोशल इंजीनियरिंग": "bg-social-soft text-social",
  Statistics: "bg-info-soft text-info",
  "Financial Security": "bg-warn-soft text-warn",
};

const labels = {
  en: { read: "Read the guide", full: "Full size", share: "Share", copied: "Copied", whatsapp: "Share on WhatsApp" },
  hi: { read: "पूरा पढ़ें", full: "बड़ा करें", share: "शेयर", copied: "कॉपी हुआ", whatsapp: "WhatsApp पर शेयर करें" },
} as const;

type Filter = "all" | "en" | "hi";

const filters: { value: Filter; label: string; lang?: string }[] = [
  { value: "all", label: "All · सभी" },
  { value: "hi", label: "हिंदी", lang: "hi" },
  { value: "en", label: "English", lang: "en" },
];

type LibraryGridProps = {
  items: LibraryCard[];
  /**
   * "masonry" shows each poster whole, in its own aspect ratio (gallery pages).
   * "grid" crops to a uniform 4:5 window for tidy rows (home page teaser).
   */
  variant?: "grid" | "masonry";
  /** Show the language filter when the set mixes Hindi and English. */
  filterable?: boolean;
};

export function LibraryGrid({ items, variant = "grid", filterable = false }: LibraryGridProps) {
  const [lightbox, setLightbox] = useState<LibraryCard | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const mixed = new Set(items.map((item) => item.lang)).size > 1;
  const visible = filter === "all" ? items : items.filter((item) => item.lang === filter);

  // Native <dialog>: focus trap, Escape and focus return come from the browser.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (lightbox && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!lightbox && dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  async function share(item: LibraryCard) {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.description, url: item.shareUrl });
      } catch {
        // user cancelled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(item.shareUrl);
      setCopiedSlug(`${item.lang}-${item.slug}`);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  const actionClass =
    "inline-flex min-h-11 items-center gap-1.5 rounded-control border border-border px-3 text-xs font-bold text-muted transition hover:border-accent hover:text-accent sm:min-h-9";

  return (
    <>
      {filterable && mixed ? (
        <div role="group" aria-label="Language · भाषा" className="mb-6 flex flex-wrap gap-2">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              lang={option.lang}
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition sm:min-h-9 ${
                filter === option.value
                  ? "border-hero bg-hero text-white"
                  : "border-border bg-surface-strong text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className={variant === "masonry" ? "gap-6 sm:columns-2 lg:columns-3" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
        {visible.map((item) => {
          const key = `${item.lang}-${item.slug}`;
          const t = labels[item.lang];

          return (
            <article
              key={key}
              lang={item.lang}
              className={`group flex flex-col overflow-hidden rounded-panel border border-border bg-surface-strong shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
                variant === "masonry" ? "mb-6 break-inside-avoid" : ""
              }`}
            >
              <Link href={item.href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden border-b border-border bg-surface">
                <PictureView
                  src={item.imageSrc}
                  entry={item.image}
                  alt=""
                  sizes={CARD_SIZES}
                  className={`w-full transition duration-300 group-hover:scale-[1.02] ${
                    variant === "masonry" ? "h-auto" : "aspect-[4/5] object-cover object-top"
                  }`}
                />
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      categoryTone[item.category] ?? "bg-surface text-muted"
                    }`}
                  >
                    {item.category}
                  </span>
                  <time className="text-xs text-muted" dateTime={item.publishedAt}>
                    {formatDate(item.publishedAt)}
                  </time>
                </div>

                <h3 className="mt-3 text-xl font-bold leading-snug text-hero">
                  <Link href={item.href} className="transition hover:text-accent">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-slate-700">{item.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Link href={item.href} className="mr-auto text-sm font-bold text-accent transition hover:text-accent-dark">
                    {t.read}
                    <span className="sr-only">: {item.title}</span>
                  </Link>
                  <a
                    href={whatsappShareUrl(item.title, item.shareUrl)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t.whatsapp}: ${item.title}`}
                    className={`${actionClass} hover:border-safe hover:text-safe`}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                  <button type="button" onClick={() => share(item)} className={actionClass}>
                    <ShareIcon className="h-3.5 w-3.5" />
                    {copiedSlug === key ? t.copied : t.share}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightbox(item)}
                    aria-label={`${t.full}: ${item.title}`}
                    className={actionClass}
                  >
                    <ExpandIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={lightbox?.title}
        onClose={() => setLightbox(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setLightbox(null);
        }}
        className="m-auto h-full max-h-none w-full max-w-none bg-transparent p-4 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {lightbox ? (
          <div
            className="flex h-full items-center justify-center"
            onClick={(event) => {
              if (event.target === event.currentTarget) setLightbox(null);
            }}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label={lightbox.lang === "hi" ? "बंद करें" : "Close"}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:border-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <PictureView
              src={lightbox.imageSrc}
              entry={lightbox.image}
              alt={lightbox.imageAlt}
              sizes="100vw"
              loading="eager"
              className="max-h-[calc(100vh-2rem)] w-auto max-w-full rounded-card object-contain"
            />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
