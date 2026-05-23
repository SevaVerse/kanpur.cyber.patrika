"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LanguageToggle } from "@/components/language-toggle";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/comics", label: "Comics Kona" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact Us" },
];

type SearchArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  sourceName: string;
  keywords: string[];
  publishedAt: string;
};

type NavbarProps = {
  articles: SearchArticle[];
};

export function Navbar({ articles }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? articles
        .filter((article) => {
          const haystack = [
            article.title,
            article.description,
            article.category,
            article.sourceName,
            article.keywords.join(" "),
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        })
        .slice(0, 6)
    : articles.slice(0, 6);

  function closeMenus() {
    setOpen(false);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header className="relative z-40 border-b border-border/80 bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenus}>
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <Image
              src={`${basePath}/Site_logo.jpeg`}
              alt="Cyber Vani logo"
              fill
              sizes="44px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-accent sm:text-xs">
              Digital Newsroom
            </span>
            <span className="block truncate text-lg font-black uppercase tracking-[0.14em] text-hero sm:text-2xl sm:tracking-[0.18em]">
              Cyber Vani
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.25em] text-muted md:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="rounded-full border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-hero transition hover:border-accent hover:text-accent"
          >
            Search
          </button>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
          <LanguageToggle />
        </nav>

        {/* Mobile: language toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-strong text-sm font-black text-hero transition hover:border-accent hover:text-accent"
          >
            ⌕
          </button>
          <LanguageToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-strong transition hover:border-accent"
          >
            <span className={`block h-0.5 w-5 bg-hero transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hero transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hero transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="relative z-10 border-t border-border/60 bg-surface/95 px-4 pb-5 md:hidden">
          <nav className="flex flex-col gap-1 pt-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 transition hover:bg-surface-strong hover:text-accent"
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 px-4 py-6 backdrop-blur-sm sm:px-6"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_30px_100px_-60px_rgba(15,23,42,0.75)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search articles"
          >
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black uppercase tracking-[0.28em] text-accent">Search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search headlines, topics, sources..."
                  autoFocus
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-hero outline-none transition focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-xl border border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-muted transition hover:border-accent hover:text-accent"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3 px-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                <span>{normalizedQuery ? `Results for "${query}"` : "Suggested articles"}</span>
                <span>{searchResults.length} shown</span>
              </div>

              <div className="space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="block rounded-3xl border border-border bg-surface-strong px-4 py-4 transition hover:border-accent hover:bg-white"
                      onClick={closeMenus}
                    >
                      <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-muted">
                        <span>{article.category}</span>
                        <span>{article.sourceName}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-black leading-snug text-hero">{article.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">{article.description}</p>
                      {article.keywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {article.keywords.slice(0, 3).map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full border border-border bg-surface px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-border bg-surface-strong px-5 py-10 text-center">
                    <p className="text-base font-bold text-hero">No articles matched that search.</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Try terms like ransomware, breach, malware, policy, or India.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
