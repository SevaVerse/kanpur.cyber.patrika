import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ConsentReset } from "@/components/consent-reset";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What Cyber Vani collects (very little), when analytics and machine translation load, and how to change your choices.",
  path: "/privacy",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mt-12 text-2xl font-bold text-hero sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy" }]} />

      <header className="border-b border-border pb-8">
        <p className="text-xs font-bold uppercase tracking-kicker text-accent">Your data</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-hero sm:text-5xl">Privacy</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Cyber Vani is a static website. There are no accounts and no logins, and by default we set no cookies.
        </p>
      </header>

      <Section title="Analytics — only if you agree">
        <p>
          We may ask whether you are willing to let us use Google Analytics to count visits and see which guides
          help readers most. Nothing from Google loads, and no analytics cookie is set, unless you choose
          &ldquo;Allow&rdquo;. If you choose &ldquo;No thanks&rdquo;, we remember that choice in your browser and
          do not ask again.
        </p>
        <p>Your choice is stored only in your own browser. You can change it at any time:</p>
        <ConsentReset />
      </Section>

      <Section title="Machine translation — only if you ask">
        <p>
          On pages without a hand-written translation, the EN / हिंदी switch can translate the page with Google
          Translate. Google&apos;s script loads only when you choose that option, and it stores your language
          choice in a <code className="rounded bg-surface px-1">googtrans</code> cookie. Switching back to the
          page&apos;s original language removes the cookie.
        </p>
      </Section>

      <Section title="Contact form">
        <p>
          Messages sent through the{" "}
          <Link href="/contact" className="font-semibold text-accent hover:underline">
            contact form
          </Link>{" "}
          are delivered by Formspree, which processes the name, email address and message you enter so that we can
          read and reply to it. Please never send passwords, OTPs or bank details — no one at Cyber Vani will ever
          ask for them.
        </p>
      </Section>

      <Section title="Hosting">
        <p>
          The site is hosted on GitHub Pages. Like any web host, GitHub may log technical data such as IP addresses
          to operate and secure the service, under its own privacy statement. Our fonts are served from our own
          domain, not from Google Fonts.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          For any privacy question, write to us through the{" "}
          <Link href="/contact" className="font-semibold text-accent hover:underline">
            contact page
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}
