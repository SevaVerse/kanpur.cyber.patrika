import Link from "next/link";

const sections = [
  {
    heading: "Read",
    links: [
      { href: "/", label: "Home" },
      { href: "/briefing", label: "Weekly Briefings" },
      { href: "/gallery", label: "Infographics" },
      { href: "/comics", label: "Comics Kona" },
    ],
  },
  {
    heading: "Publication",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/sponsors", label: "Sponsors" },
      { href: "/contact", label: "Contact Us" },
      { href: "/feed.xml", label: "RSS Feed" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 bg-hero text-slate-300">
      {/* Helpline band — the most useful thing we can put in front of a reader */}
      <div className="border-b border-white/10 bg-accent/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-kicker text-hero-accent">
              Victim of cyber fraud?
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              Report it immediately — the first few hours matter most for recovering money.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:1930"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-label text-hero transition hover:bg-hero-accent"
            >
              Call 1930
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
          <p className="max-w-md text-sm leading-7">
            A weekly cyber security briefing and awareness library for readers across Uttar Pradesh and
            India — breaches, scams, threats, and the practical steps that protect you.
          </p>
          <p className="text-xs leading-6 text-slate-400">
            Cyber Vani is an editorially independent publication. Sponsorship never influences what we
            cover or how we cover it.
          </p>
        </div>

        {sections.map((section) => (
          <nav key={section.heading} className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-kicker text-hero-accent">{section.heading}</p>
            <ul className="space-y-3 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-hero-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} Cyber Vani. All rights reserved.</p>
          <p>
            UP Police Cyber Cell:{" "}
            <a href="mailto:sp-cyber.lu@up.gov.in" className="font-semibold text-slate-300 hover:text-hero-accent">
              sp-cyber.lu@up.gov.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
