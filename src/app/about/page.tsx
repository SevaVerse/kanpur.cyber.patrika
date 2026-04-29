import type { Metadata } from "next";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const founder = {
  name: "Nitin Srivastava",
  role: "Founder",
  focus:
    "Leads Kanpur Cyber Patrika with a focus on cyber awareness, practical reporting, and a dependable static publishing workflow for readers following digital threats and public-interest security news.",
  imageSrc: `${basePath}/founder-pic.png`,
};

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Kanpur Cyber Patrika, its editorial mission, the cyber helpline, and the founding team behind the publication.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">About The Publication</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
          Kanpur Cyber Patrika publishes clear, build-time-curated reporting on cyber threats, breaches, and digital policy.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          The newsroom is designed for dependable weekly publishing. We combine editorial judgment with a static delivery pipeline so readers can access cyber security coverage quickly, even when upstream feeds are unstable.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-4xl border border-border bg-surface-strong p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Mission</p>
          <h2 className="mt-3 text-3xl font-black text-hero">Why this newsroom exists</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
            <p>
              Kanpur Cyber Patrika focuses on the stories security teams, founders, students, and public-interest readers need to track: active threat campaigns, data exposure incidents, policy shifts, and operational security lessons.
            </p>
            <p>
              The site is built to publish consistently through static generation and scheduled automation, which keeps the reading experience fast and resilient while preserving a professional editorial format.
            </p>
          </div>
        </article>

        <aside className="rounded-4xl border border-accent/20 bg-[linear-gradient(180deg,rgba(180,35,24,0.08),rgba(245,158,11,0.1))] p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Cyber Helpline</p>
          <div className="mt-4 rounded-3xl border border-accent/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">National cyber helpline</p>
            <p className="mt-3 text-5xl font-black text-hero">1221</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Use the cyber helpline for urgent reporting guidance and official support channels where applicable. Readers should still contact local authorities or platform-specific incident desks when immediate response is required.
            </p>
          </div>
        </aside>
      </section>

      <section className="rounded-4xl border border-border bg-surface p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Founders Information</p>
          <h2 className="mt-3 text-3xl font-black text-hero">Founder</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Kanpur Cyber Patrika is led by a founder-driven editorial vision that combines cyber reporting, public awareness, and reliable digital publishing.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface-strong shadow-[0_16px_50px_-38px_rgba(15,23,42,0.45)]">
            <div className="relative aspect-[4/5]">
              <Image
                src={founder.imageSrc}
                alt={founder.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 260px"
              />
            </div>
          </div>

          <article className="rounded-3xl border border-border bg-surface-strong p-6 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.45)]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{founder.role}</p>
            <h3 className="mt-3 text-3xl font-black text-hero">{founder.name}</h3>
            <p className="mt-4 text-base leading-8 text-slate-700">{founder.focus}</p>
          </article>
        </div>
      </section>
    </div>
  );
}