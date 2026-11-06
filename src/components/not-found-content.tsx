import Link from "next/link";

import type { Lang } from "@/lib/i18n";

const copy = {
  en: {
    kicker: "404",
    title: "We could not find that page.",
    body: "The link may be old or mistyped. Everything we publish is still here — start from one of these.",
    help: "Looking for help after a fraud? Call",
    file: "or file a report at",
    home: "Return Home",
    destinations: [
      { href: "/briefing", label: "Weekly Briefings", blurb: "Every edition we have published, newest first." },
      { href: "/gallery", label: "Infographics", blurb: "Visual guides to the scams doing the rounds right now." },
      { href: "/comics", label: "Comics Kona", blurb: "Hindi comics that walk through how each fraud actually works." },
    ],
  },
  hi: {
    kicker: "404",
    title: "यह पेज नहीं मिला।",
    body: "लिंक पुराना या गलत हो सकता है। हमारी सारी जानकारी अब भी यहीं है — इनमें से कहीं से शुरू करें।",
    help: "ठगी के बाद मदद चाहिए? कॉल करें",
    file: "या शिकायत दर्ज करें",
    home: "होम पेज पर जाएँ",
    destinations: [
      { href: "/briefing", label: "साप्ताहिक ब्रीफ़िंग", blurb: "हर संस्करण, सबसे नया पहले।" },
      { href: "/gallery", label: "इन्फोग्राफिक्स", blurb: "आजकल चल रही ठगी पर चित्रों में जानकारी।" },
      { href: "/comics", label: "कॉमिक्स कोना", blurb: "हिंदी कॉमिक्स में समझें कि हर ठगी कैसे होती है।" },
    ],
  },
} as const;

/** Body of every 404: route-level (per language) and the global fallback. */
export function NotFoundContent({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <p className="text-xs font-bold uppercase tracking-hero text-accent">{t.kicker}</p>
      <h1 className="mt-4 text-4xl font-bold text-hero sm:text-5xl">{t.title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">{t.body}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {t.destinations.map((destination) => (
          <Link
            key={destination.href}
            href={destination.href}
            className="rounded-card border border-border bg-surface-strong p-6 transition hover:border-accent hover:bg-white"
          >
            <p className="text-lg font-bold text-hero">{destination.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{destination.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-6">
        <p className="text-sm leading-7 text-slate-700">
          {t.help}{" "}
          <a href="tel:1930" className="font-bold text-accent hover:underline">
            1930
          </a>{" "}
          {t.file}{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-accent hover:underline"
          >
            cybercrime.gov.in
          </a>
          .
        </p>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-label text-white transition hover:bg-accent-dark"
      >
        {t.home}
      </Link>
    </div>
  );
}
