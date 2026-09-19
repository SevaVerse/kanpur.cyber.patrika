"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { formatDate } from "@/lib/format";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Lean card shape, so the full library never reaches the client bundle. */
export type LibraryCard = {
  slug: string;
  lang: "en" | "hi";
  href: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
};

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Phishing: { bg: "bg-[rgba(220,38,38,0.07)]", text: "text-[#b91c1c]" },
  Ransomware: { bg: "bg-[rgba(180,35,24,0.07)]", text: "text-[#b42318]" },
  Awareness: { bg: "bg-[rgba(21,128,61,0.07)]", text: "text-[#15803d]" },
  "जागरूकता": { bg: "bg-[rgba(21,128,61,0.07)]", text: "text-[#15803d]" },
  "Social Engineering": { bg: "bg-[rgba(124,58,237,0.07)]", text: "text-[#7c3aed]" },
  "सोशल इंजीनियरिंग": { bg: "bg-[rgba(124,58,237,0.07)]", text: "text-[#7c3aed]" },
  Statistics: { bg: "bg-[rgba(30,64,175,0.07)]", text: "text-[#1e40af]" },
  "Financial Security": { bg: "bg-[rgba(180,83,9,0.07)]", text: "text-[#b45309]" },
};

function categoryStyle(category: string) {
  return categoryStyles[category] ?? { bg: "bg-[rgba(15,23,42,0.05)]", text: "text-slate-600" };
}

export function LibraryGrid({ items }: { items: LibraryCard[] }) {
  const [lightbox, setLightbox] = useState<LibraryCard | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  async function share(item: LibraryCard, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    // The item's own page, not the index — so a shared link lands on the guide.
    const url = `${window.location.origin}${basePath}${item.href}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.description, url });
      } catch {
        // user cancelled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(item.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const style = categoryStyle(item.category);

          return (
            <article
              key={`${item.lang}-${item.slug}`}
              lang={item.lang}
              className="group flex flex-col overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_16px_50px_-35px_rgba(15,23,42,0.3)] transition hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)]"
            >
              <Link href={item.href} className="block overflow-hidden border-b border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}${item.imageSrc}`}
                  alt={item.imageAlt}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  loading="lazy"
                  className="h-72 w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                />
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${style.bg} ${style.text}`}
                  >
                    {item.category}
                  </span>
                  <time className="text-xs text-muted" dateTime={item.publishedAt}>
                    {formatDate(item.publishedAt)}
                  </time>
                </div>

                <h3 className="mt-4 text-xl font-black leading-snug text-hero">
                  <Link href={item.href} className="transition hover:text-accent">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">{item.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                  <Link
                    href={item.href}
                    className="text-xs font-bold uppercase tracking-[0.2em] text-accent transition hover:text-accent-dark"
                  >
                    {item.lang === "hi" ? "पूरा पढ़ें" : "Read the guide"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLightbox(item)}
                    className="ml-auto rounded-xl border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted transition hover:border-accent hover:text-accent"
                  >
                    {item.lang === "hi" ? "बड़ा करें" : "Full size"}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => share(item, event)}
                    className="rounded-xl border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted transition hover:border-accent hover:text-accent"
                  >
                    {copiedSlug === item.slug ? (item.lang === "hi" ? "कॉपी हुआ" : "Copied") : "Share"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-xl border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:border-white"
          >
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}${lightbox.imageSrc}`}
            alt={lightbox.imageAlt}
            className="max-h-full max-w-full rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
