import Link from "next/link";

import { type Lang, ui } from "@/lib/i18n";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type FooterLink = { href: string; label: string; plain?: boolean };

function sectionsFor(lang: Lang, feedHref: string): { heading: string; links: FooterLink[] }[] {
  const t = ui[lang];

  return [
    {
      heading: t.footer.read,
      links: [
        { href: "/", label: t.nav.home },
        { href: "/briefing", label: t.footer.weeklyBriefings },
        { href: "/gallery", label: t.nav.infographics },
        { href: "/comics", label: t.footer.comicsKona },
        // The feed is a static XML file, not a page: a plain anchor, so Next
        // does not try to prefetch an RSC payload for it.
        { href: feedHref, label: t.footer.rss, plain: true },
      ],
    },
    {
      heading: t.footer.publication,
      links: [
        { href: "/about", label: t.footer.aboutUs },
        { href: "/editorial-policy", label: t.footer.editorialPolicy },
        { href: "/sponsors", label: t.nav.sponsors },
        { href: "/contact", label: t.footer.contactUs },
        { href: "/privacy", label: t.footer.privacy },
      ],
    },
  ];
}

export function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  const t = ui[lang].footer;
  const feedHref = `${basePath}${lang === "hi" ? "/hi/feed.xml" : "/feed.xml"}`;

  return (
    <footer className="mt-16 border-t border-white/10 bg-hero text-slate-300">
      {/* Helpline band — the most useful thing we can put in front of a reader */}
      <div className="border-b border-white/10 bg-accent/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-kicker text-hero-accent">{t.victimKicker}</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">{t.victimBody}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:1930"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-label text-hero transition hover:bg-hero-accent"
            >
              {t.call}
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-label text-white transition hover:border-hero-accent hover:text-hero-accent"
            >
              cybercrime.gov.in
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-lg font-bold uppercase tracking-label text-white">Cyber Vani</p>
          <p className="max-w-md text-sm leading-7">{t.blurb}</p>
          <p className="text-xs leading-6 text-slate-400">{t.independence}</p>
        </div>

        {sectionsFor(lang, feedHref).map((section) => (
          <nav key={section.heading} aria-label={section.heading} className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-kicker text-hero-accent">{section.heading}</p>
            <ul className="space-y-3 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.plain ? (
                    <a href={link.href} className="transition hover:text-hero-accent">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="transition hover:text-hero-accent">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} Cyber Vani. {t.rights}
          </p>
          <p>
            {t.upCell}:{" "}
            <a href="mailto:sp-cyber.lu@up.gov.in" className="font-semibold text-slate-300 hover:text-hero-accent">
              sp-cyber.lu@up.gov.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
