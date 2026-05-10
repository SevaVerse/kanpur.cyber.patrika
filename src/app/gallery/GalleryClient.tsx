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
    title: "Fake E-Challan — Cyber Crime Alert",
    description:
      "Cyber criminals send fake e-challan messages via SMS, WhatsApp and email with fraudulent payment links to steal money and personal data. Learn how to verify a challan only at echallan.parivahan.gov.in and report fraud on 1930.",
    category: "Social Engineering",
    imageSrc: "/infographics/infographics_1.jpeg",
    publishedAt: "2026-04-01",
    tags: ["e-challan", "scam", "phishing", "India", "awareness"],
  },
  {
    id: "ig-002",
    title: "Smartphone OTP Scam — How It Works",
    description:
      "Scammers pose as bank, KYC, or government officials to trick you into sharing your OTP in six steps — then drain your account. Learn the warning signs and how to protect yourself.",
    category: "Social Engineering",
    imageSrc: "/infographics/infographics_2.jpeg",
    publishedAt: "2026-04-08",
    tags: ["OTP", "scam", "bank fraud", "awareness", "India"],
  },
  {
    id: "ig-003",
    title: "How Your WhatsApp Gets Hacked",
    description:
      "Hackers lure you with fake links, redirect you to clone sites, request your OTP, and take over your account in seconds. This guide explains the attack chain and how to secure WhatsApp with two-step verification.",
    category: "Awareness",
    imageSrc: "/infographics/infographics_3.jpeg",
    publishedAt: "2026-04-15",
    tags: ["WhatsApp", "hacking", "OTP", "account security"],
  },
  {
    id: "ig-004",
    title: "Digital Forensics & Investigation Services",
    description:
      "An overview of professional digital forensics services — digital evidence collection, data recovery, forensic analysis, cybercrime investigation, and cloud & mobile forensics — for individuals and businesses.",
    category: "Statistics",
    imageSrc: "/infographics/infographics_4.jpeg",
    publishedAt: "2026-04-22",
    tags: ["digital forensics", "investigation", "cyber crime", "evidence"],
  },
  {
    id: "ig-005",
    title: "Digital Arrest — Prevention is Protection",
    description:
      "No government agency arrests anyone over a phone or video call. This poster breaks down the Digital Arrest scam and lists six steps to protect yourself — from refusing unknown calls to reporting on cybercrime.gov.in.",
    category: "Social Engineering",
    imageSrc: "/infographics/infographics_5.jpeg",
    publishedAt: "2024-05-01",
    tags: ["digital arrest", "scam", "awareness", "India"],
  },
  {
    id: "ig-006",
    title: "Digital Banking — Safe Banking, Secure India",
    description:
      "Government of India awareness guide on safe digital banking. Covers essential do's and don'ts — strong passwords, 2FA, avoiding public Wi-Fi, not sharing OTPs — and how to report cyber fraud on the 1930 helpline.",
    category: "Financial Security",
    imageSrc: "/infographics/infographics_6.jpeg",
    publishedAt: "2026-04-29",
    tags: ["digital banking", "UPI", "fraud", "financial security", "India"],
  },
  {
    id: "ig-007",
    title: "Cyberbullying & Data Breaches — Stay Aware, Stay Safe",
    description:
      "A two-part awareness poster covering cyberbullying (how to recognise it, report it, and support others) and data breaches (common causes, impact, and six steps to protect your personal data).",
    category: "Awareness",
    imageSrc: "/infographics/infographics_7.jpeg",
    publishedAt: "2026-05-06",
    tags: ["cyberbullying", "data breach", "awareness", "online safety"],
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  async function shareItem(item: Infographic, e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}${basePath}/gallery`;
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.description, url });
      } catch {
        // user cancelled — do nothing
      }
      return;
    }
    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard not available
    }
  }

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
                  className={`flex aspect-[3/4] items-center justify-center ${style.bg} border-b ${style.border} ${item.imageSrc ? "cursor-zoom-in" : ""}`}
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

                  {/* Actions */}
                  {item.imageSrc && (
                    <div className="mt-5 flex gap-2">
                      <a
                        href={`${basePath}${item.imageSrc}`}
                        download
                        className="flex-1 rounded-xl border border-border bg-surface-strong px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download ↓
                      </a>
                      <button
                        type="button"
                        onClick={(e) => shareItem(item, e)}
                        className="flex-1 rounded-xl border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                      >
                        {copiedId === item.id ? "Link Copied ✓" : "Share ↗"}
                      </button>
                    </div>
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
