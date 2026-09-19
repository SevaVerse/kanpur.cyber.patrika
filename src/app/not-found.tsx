import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const destinations = [
  {
    href: "/briefing",
    label: "Weekly Briefings",
    blurb: "Every edition we have published, newest first.",
  },
  {
    href: "/gallery",
    label: "Infographics",
    blurb: "Visual guides to the scams doing the rounds right now.",
  },
  {
    href: "/comics",
    label: "Comics Kona",
    blurb: "Hindi comics that walk through how each fraud actually works.",
  },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <p className="text-xs font-bold uppercase tracking-hero text-accent">404</p>
      <h1 className="mt-4 text-4xl font-bold text-hero sm:text-5xl">We could not find that page.</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
        The link may be old or mistyped. Everything we publish is still here — start from one of these.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {destinations.map((destination) => (
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
          Looking for help after a fraud? Call{" "}
          <a href="tel:1930" className="font-bold text-accent hover:underline">
            1930
          </a>{" "}
          or file a report at{" "}
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
        Return Home
      </Link>
    </div>
  );
}
