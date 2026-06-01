"use client";

import { useCallback, useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Comic = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  publishedAt: string;
  tags: string[];
};

const comics: Comic[] = [
  {
    id: "cm-001",
    title: "Digital Arrest — Ek Saazish (Hindi Comic)",
    description:
      "An 8-panel Hindi comic strip exposing the Digital Arrest scam step-by-step — from the fraudster's first call to the money transfer. Learn how to stay alert, never trust unknown video calls, and report fraud on 1930 or cybercrime.gov.in.",
    imageSrc: "/comics/comics_1.jpeg",
    publishedAt: "2026-05-13",
    tags: ["digital arrest", "comic", "Hindi", "scam", "awareness"],
  },
  {
    id: "cm-002",
    title: "Digital Arrest Kaise Hota Hai — CyberVani Guide (Hindi Comic)",
    description:
      "A Hindi comic guide in 8 panels showing exactly how the Digital Arrest fraud unfolds — fake CBI call, threats, sham video arrest, and forced bank transfer — and how CyberVani helps you file a complaint, get expert advice, and protect your family.",
    imageSrc: "/comics/comics_2.jpeg",
    publishedAt: "2026-05-19",
    tags: ["digital arrest", "comic", "Hindi", "CBI fraud", "CyberVani"],
  },
  {
    id: "cm-003",
    title: "Digitalization aur Cyber Khatra — Bharat Ko Khatre Mein Daalne Wali Saazish (Hindi Comic)",
    description:
      "An 8-panel Hindi educational comic tracing how India's rapid digitalization — UPI, e-commerce, online education, 5G — has simultaneously expanded the cyber attack surface. Panels cover phishing, malware, ransomware, data theft, identity fraud, and the growing toll on ordinary citizens. The final panels highlight India's key defenders (CERT-In, Cyber Swachhta Kendra, Digital India, I4C) and close with a call to action: strong passwords, 2FA, software updates, avoiding unknown links, regular backups, and spreading cyber awareness. Published by CyberVani — Jagrukta hi suraksha hai.",
    imageSrc: "/comics/comics_3.jpeg",
    publishedAt: "2026-06-01",
    tags: ["digitalization", "cyber threat", "Hindi", "awareness", "CERT-In", "India", "comic"],
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ComicsClient() {
  const [lightboxItem, setLightboxItem] = useState<Comic | null>(null);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxItem, closeLightbox]);

  return (
    <>
      <section>
        <div className="grid gap-6 sm:grid-cols-2">
          {comics.map((comic) => (
            <article
              key={comic.id}
              className="group overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_16px_50px_-35px_rgba(15,23,42,0.3)] transition hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)]"
            >
              <button
                type="button"
                onClick={() => setLightboxItem(comic)}
                className="block w-full cursor-zoom-in overflow-hidden"
                aria-label={`View ${comic.title} full size`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}${comic.imageSrc}`}
                  alt={comic.title}
                  className="w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </button>
              <div className="p-6">
                <time className="text-xs text-muted" dateTime={comic.publishedAt}>
                  {formatDate(comic.publishedAt)}
                </time>
                <h2 className="mt-2 text-lg font-black leading-snug text-hero transition group-hover:text-accent">
                  {comic.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">{comic.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {comic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-border bg-surface-strong px-2 py-0.5 text-[11px] font-semibold text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <a
                    href={`${basePath}${comic.imageSrc}`}
                    download
                    className="inline-block rounded-xl border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                  >
                    Download ↓
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
        >
          <div className="relative mx-4 w-full max-w-7xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-2xl leading-none text-white transition hover:bg-black/75"
              aria-label="Close lightbox"
            >
              &times;
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}${lightboxItem.imageSrc}`}
              alt={lightboxItem.title}
              className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />

            <div className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-black/60 px-4 py-3 backdrop-blur-sm">
              <div>
                <p className="text-sm font-black leading-snug text-white">{lightboxItem.title}</p>
                <p className="mt-0.5 text-xs text-white/60">Comic Strip</p>
              </div>
              <a
                href={`${basePath}${lightboxItem.imageSrc}`}
                download
                className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/20"
                onClick={(event) => event.stopPropagation()}
              >
                Download ↓
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}