import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  return (
    <header className="border-b border-border/80 bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.45em] text-accent">Kanpur</span>
          <span className="text-2xl font-black uppercase tracking-[0.18em] text-hero">Cyber Patrika</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold uppercase tracking-[0.25em] text-muted">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
