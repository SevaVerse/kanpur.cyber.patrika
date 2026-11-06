import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Editorial Policy & Corrections",
  description:
    "How Cyber Vani makes its weekly briefing and awareness guides, how AI is used and checked, what we will never publish, and how to report a correction.",
  path: "/editorial-policy",
});

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mt-12 text-2xl font-bold text-hero sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">{children}</div>
    </section>
  );
}

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Editorial Policy" }]} />

      <header className="border-b border-border pb-8">
        <p className="text-xs font-bold uppercase tracking-kicker text-accent">How we work</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-hero sm:text-5xl">
          Editorial policy and corrections
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Cyber Vani exists to be the reliable source on cyber fraud for readers in Uttar Pradesh and across
          India. This page explains how our content is made, where AI is involved, and how we correct mistakes.
        </p>
      </header>

      <Section title="What we publish">
        <p>
          <strong>The awareness library</strong> — guides in Hindi and English on the frauds doing the rounds:
          digital arrest, fake e-challans, OTP theft, WhatsApp hijacking, mole accounts and more. Each guide is the
          full text of one of our posters or comics, transcribed so it can be read, searched, translated and read
          aloud.
        </p>
        <p>
          <strong>The weekly briefing</strong> — a curated list of the week&apos;s cyber fraud stories from Indian
          news outlets. Every headline links to the original publisher. We do not reproduce other newsrooms&apos;
          reporting.
        </p>
      </Section>

      <Section title="How AI is used in the briefing">
        <p>
          The briefing is assembled by an automated pipeline every Saturday. For each story, an AI model writes a
          short &ldquo;why it matters&rdquo; note and suggests which of our guides explains how to avoid that
          threat. The note is written from the text of the linked article, not from the headline alone.
        </p>
        <p>Before anything is published, automated checks reject a note when:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>it contains any number that does not appear in the source article;</li>
          <li>it contains a phone number, website, email address or UPI id of any kind;</li>
          <li>it is a refusal, too short to say anything, or too long;</li>
          <li>the suggested guide does not exist in our library.</li>
        </ul>
        <p>
          A note that fails is dropped, and the story is published as a plain link. A bad week produces a thinner
          briefing, never a guessed one. Editions written this way carry a disclosure at the end of the page.
        </p>
      </Section>

      <Section title="What we will never publish">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            A phone number, link or payment address for &ldquo;refund&rdquo;, &ldquo;recovery&rdquo; or
            &ldquo;helpline&rdquo; services. The only numbers we print are official ones, such as{" "}
            <a href="tel:1930" className="font-semibold text-accent hover:underline">
              1930
            </a>
            .
          </li>
          <li>Figures we cannot trace to a source.</li>
          <li>Paid placement presented as editorial content.</li>
        </ul>
      </Section>

      <Section title="Independence">
        <p>
          Sponsors support the publication. Sponsorship never influences what we cover or how we cover it, and
          sponsored material is always labelled as such.
        </p>
      </Section>

      <Section id="corrections" title="Corrections">
        <p>
          If something we published is wrong — a fact in a guide, a note in a briefing, a broken link — please tell
          us through the{" "}
          <Link href="/contact" className="font-semibold text-accent hover:underline">
            contact page
          </Link>
          . Include the page link and what is wrong.
        </p>
        <p>
          We fix errors as soon as we confirm them. Significant changes to a guide are reflected in its
          &ldquo;Updated&rdquo; date. A briefing note that turns out to be wrong is removed rather than rewritten
          after the fact.
        </p>
      </Section>
    </div>
  );
}
