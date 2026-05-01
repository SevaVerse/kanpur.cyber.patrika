"use client";

import { useState, useEffect, useCallback } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Infographic = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageSrc?: string;
  publishedAt: string;
  tags: string[];
};

const infographics: Infographic[] = [
  {
    id: "ig-001",
    title: "Digital Arrest — A New-Age Scam",
    description:
      "Scammers impersonate police or government officials and threaten victims with 'digital arrest' to extort money. This infographic explains the red flags and how to stay safe.",
    category: "Social Engineering",
    imageSrc: "/infographics/infographics_1.jpeg",
    publishedAt: "2024-05-01",
    tags: ["digital arrest", "scam", "impersonation", "India"],
  },
  {
    id: "ig-002",
    title: "Ransomware Kill Chain",
    description:
      "Illustrates the seven stages of a ransomware attack: initial access, persistence, lateral movement, data exfiltration, encryption, and ransom demand.",
    category: "Ransomware",
    imageSrc: "/infographics/infographics_2.jpeg",
    publishedAt: "2026-04-08",
    tags: ["ransomware", "kill chain", "malware"],
  },
  {
    id: "ig-003",
    title: "10 Rules of Digital Hygiene",
    description:
      "Quick-reference poster covering password managers, MFA, software updates, public Wi-Fi risks, and secure backup practices.",
    category: "Awareness",
    imageSrc: "/infographics/infographics_3.jpeg",
    publishedAt: "2026-04-15",
    tags: ["awareness", "passwords", "MFA", "updates"],
  },
  {
    id: "ig-004",
    title: "Social Engineering Red Flags",
    description:
      "Visual guide to recognising social engineering tactics: urgency cues, impersonation, pretexting, and baiting in everyday digital interactions.",
    category: "Social Engineering",
    imageSrc: "/infographics/infographics_4.jpeg",
    publishedAt: "2026-04-22",
    tags: ["social engineering", "awareness", "impersonation"],
  },
  {
    id: "ig-005",
    title: "India Cyber Crime Report 2025",
    description:
      "Key statistics from India's 2025 cyber crime landscape — sector-wise losses, top attack vectors, and state-level incident counts.",
    category: "Statistics",
    publishedAt: "2026-04-29",
    tags: ["statistics", "India", "cyber crime"],
  },
  {
    id: "ig-006",
    title: "Secure Your UPI Transactions",
    description:
      "Common UPI fraud patterns in India — fake collect requests, SIM swap, screen-share scams — and how to avoid them.",
    category: "Financial Security",
    publishedAt: "2026-04-29",
    tags: ["UPI", "fraud", "financial security"],
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Phishing: {
    bg: "bg-[rgba(220,38,38,0.07)]",
    text: "text-[#b91c1c]",
    border: "border-[#b91c1c]/20",
    icon: "🎣",
  },
  Ransomware: {
    bg: "bg-[rgba(180,35,24,0.07)]",
    text: "text-[#b42318]",
    border: "border-[#b42318]/20",
    icon: "🔒",
  },
  Awareness: {
    bg: "bg-[rgba(21,128,61,0.07)]",
    text: "text-[#15803d]",
    border: "border-[#15803d]/20",
    icon: "💡",
  },
  "Social Engineering": {
    bg: "bg-[rgba(124,58,237,0.07)]",
    text: "text-[#7c3aed]",
    border: "border-[#7c3aed]/20",
    icon: "🎭",
  },
  Statistics: {
    bg: "bg-[rgba(30,64,175,0.07)]",
    text: "text-[#1e40af]",
    border: "border-[#1e40af]/20",
    icon: "📊",
  },
  "Financial Security": {
    bg: "bg-[rgba(180,83,9,0.07)]",
    text: "text-[#b45309]",
    border: "border-[#b45309]/20",
    icon: "💳",
  },
};

function categoryStyle(cat: string) {
  return (
    categoryColors[cat] ?? {
      bg: "bg-[rgba(15,23,42,0.05)]",
      text: "text-slate-600",
      border: "border-slate-200",
      icon: "🖼",
    }
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GalleryClient() {
  const [lightboxItem, setLightboxItem] = useState<Infographic | null>(null);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
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
      {/* Grid */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {infographics.map((item) => {
            const style = categoryStyle(item.category);
            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_16px_50px_-35px_rgba(15,23,42,0.3)] transition hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)]"
              >
                {/* Image area */}
                <div
                  className={`flex aspect-video items-center justify-center ${style.bg} border-b ${style.border} ${item.imageSrc ? "cursor-zoom-in" : ""}`}
                  onClick={() => item.imageSrc && setLightboxItem(item)}
                  role={item.imageSrc ? "button" : undefined}
                  tabIndex={item.imageSrc ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (item.imageSrc && (e.key === "Enter" || e.key === " ")) setLightboxItem(item);
                  }}
                  aria-label={item.imageSrc ? `View ${item.title} full size` : undefined}
                >
                  {item.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${basePath}${item.imageSrc}`}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <span className="text-5xl" role="img" aria-label={item.category}>
                        {style.icon}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
                        Infographic Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
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

                  <h2 className="mt-3 text-lg font-black leading-snug text-hero group-hover:text-accent transition">
                    {item.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-slate-700">{item.description}</p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border bg-surface-strong px-2 py-0.5 text-[11px] font-semibold text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Download */}
                  {item.imageSrc && (
                    <a
                      href={`${basePath}${item.imageSrc}`}
                      download
                      className="mt-5 inline-block rounded-xl border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download ↓
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
        >
          <div
            className="relative mx-4 max-h-[90vh] max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition"
              aria-label="Close lightbox"
            >
              Close ✕
            </button>

            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}${lightboxItem.imageSrc}`}
              alt={lightboxItem.title}
              className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
            />

            {/* Caption bar */}
            <div className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-black/60 px-4 py-3 backdrop-blur-sm">
              <div>
                <p className="text-sm font-black text-white leading-snug">{lightboxItem.title}</p>
                <p className="mt-0.5 text-xs text-white/60">{lightboxItem.category}</p>
              </div>
              <a
                href={`${basePath}${lightboxItem.imageSrc}`}
                download
                className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/20"
                onClick={(e) => e.stopPropagation()}
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
