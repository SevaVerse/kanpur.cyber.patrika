"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import type { SearchEntry } from "@/lib/search";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The bar carries only the four destinations worth a permanent slot.
 * Sponsors and Contact live in the footer, which already lists both, and
 * Home lives on the logo where readers expect it.
 */
const primaryLinks = [
  { href: "/briefing", label: "Briefings" },
  { href: "/gallery", label: "Infographics" },
  { href: "/comics", label: "Comics" },
  { href: "/about", label: "About" },
];

/** The mobile drawer keeps everything reachable. */
const mobileLinks = [
  { href: "/", label: "Home" },
  ...primaryLinks,
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" },
];

/**
 * Drawn rather than typed. The previous affordance was U+2315, a technical
 * symbol outside both the Latin and Devanagari subsets the webfont ships,
 * so it fell back to a system font or rendered as tofu.
 */
function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-[1.15rem] w-[1.15rem]"
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13.5 13.5 3.5 3.5" />
    </svg>
  );
}

type NavbarProps = {
  entries: SearchEntry[];
};

export function Navbar({ entries }: NavbarProps) {
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
    ? entries.filter((entry) => entry.haystack.includes(normalizedQuery)).slice(0, 6)
    : entries.slice(0, 6);

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
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-card border border-border bg-white shadow-sm">
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
          <span className="truncate text-xl font-bold text-hero sm:text-2xl">Cyber Vani</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-strong text-base text-hero transition hover:border-accent hover:text-accent"
            >
              <SearchIcon />
            </button>
            <LanguageToggle />
          </div>
        </nav>

        {/* Mobile: language toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="flex h-11 w-11 items-center justify-center rounded-control border border-border bg-surface-strong text-base font-bold text-hero transition hover:border-accent hover:text-accent"
          >
            <SearchIcon />
          </button>
          <LanguageToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-control border border-border bg-surface-strong transition hover:border-accent"
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
          <nav className="flex flex-col gap-1 pt-3 text-base font-semibold text-muted">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-control px-3 py-3 transition hover:bg-surface-strong hover:text-accent"
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
            className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search articles"
          >
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-kicker text-accent">Search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search headlines, topics, sources..."
                  autoFocus
                  className="w-full rounded-card border border-border bg-white px-4 py-3 text-sm font-normal text-hero outline-none transition focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-control border border-border px-3 py-2 text-xs font-bold uppercase tracking-label text-muted transition hover:border-accent hover:text-accent"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3 px-1 text-xs font-semibold uppercase tracking-label text-muted">
                <span>{normalizedQuery ? `Results for "${query}"` : "Suggested articles"}</span>
                <span>{searchResults.length} shown</span>
              </div>

              <div className="space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((entry) => (
                    <Link
                      key={entry.id}
                      href={entry.href}
                      lang={entry.lang}
                      className="block rounded-card border border-border bg-surface-strong px-4 py-4 transition hover:border-accent hover:bg-white"
                      onClick={closeMenus}
                    >
                      <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-bold uppercase tracking-label text-muted">
                        <span>{entry.category}</span>
                        {entry.lang === "hi" ? <span>हिंदी</span> : null}
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-hero">{entry.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">{entry.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-card border border-dashed border-border bg-surface-strong px-5 py-10 text-center">
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
