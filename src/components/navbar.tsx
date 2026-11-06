"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, PhoneIcon, SearchIcon } from "@/components/icons";
import { LanguageToggle, TRANSLATE_MOUNT_ID } from "@/components/language-toggle";
import { PictureView } from "@/components/picture-view";
import { type Lang, ui } from "@/lib/i18n";
import type { ImageEntry } from "@/lib/image-manifest";
import type { SearchEntry } from "@/lib/search";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The bar carries only the four destinations worth a permanent slot.
 * Sponsors and Contact live in the footer, which already lists both, and
 * Home lives on the logo where readers expect it.
 */
function navLinks(lang: Lang) {
  const t = ui[lang].nav;
  const primary = [
    { href: "/briefing", label: t.briefings },
    { href: "/gallery", label: t.infographics },
    { href: "/comics", label: t.comics },
    { href: "/about", label: t.about },
  ];

  /** The mobile drawer keeps everything reachable. */
  const mobile = [
    { href: "/", label: t.home },
    ...primary,
    { href: "/sponsors", label: t.sponsors },
    { href: "/contact", label: t.contact },
  ];

  return { primary, mobile };
}

function normalise(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/**
 * Fetches /search-index.json once per page load, the first time search is
 * opened, and shares the result between both search triggers.
 */
let searchIndexPromise: Promise<SearchEntry[]> | null = null;

function loadSearchIndex() {
  searchIndexPromise ??= fetch(`${basePath}/search-index.json`)
    .then((response) => (response.ok ? (response.json() as Promise<SearchEntry[]>) : []))
    .catch(() => {
      searchIndexPromise = null; // allow a retry on the next open
      return [];
    });

  return searchIndexPromise;
}

type NavbarProps = {
  lang: Lang;
  /** Path -> hand-written translation, for the language toggle. */
  alternates: Record<string, string>;
  /** Responsive variants of the logo (96/192px instead of the 1254px original). */
  logo: ImageEntry | null;
};

export function Navbar({ lang, alternates, logo }: NavbarProps) {
  const t = ui[lang];
  const { primary: primaryLinks, mobile: mobileLinks } = navLinks(lang);
  const pathname = normalise(usePathname() ?? "/");

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close the drawer whenever the route changes (including browser back).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // "/" opens search from anywhere, unless the reader is typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      setSearchOpen(true);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /*
   * Native <dialog> with showModal(): the browser traps focus inside it,
   * closes it on Escape, makes the page behind inert, and returns focus to
   * the button that opened it. The hand-rolled overlay did none of that.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (searchOpen && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else if (!searchOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || entries) return;

    let cancelled = false;
    loadSearchIndex().then((loaded) => {
      if (!cancelled) setEntries(loaded);
    });

    return () => {
      cancelled = true;
    };
  }, [searchOpen, entries]);

  const normalizedQuery = query.trim().toLowerCase();
  const loadingIndex = entries === null;
  const index = entries ?? [];
  const searchResults = normalizedQuery
    ? index.filter((entry) => entry.haystack.includes(normalizedQuery)).slice(0, 6)
    : index.slice(0, 6);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      {/* Single hidden mount for Google Translate, used only on request. */}
      <div id={TRANSLATE_MOUNT_ID} className="hidden" aria-hidden="true" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-control sm:gap-3">
          <span className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-control border border-border bg-white shadow-sm">
            <PictureView
              src="/Site_logo.jpeg"
              entry={logo}
              alt=""
              sizes="40px"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </span>
          <span className="whitespace-nowrap text-lg font-bold text-hero sm:text-xl">Cyber Vani</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t.nav.primary} className="hidden items-center gap-1 text-sm font-semibold md:flex">
          {primaryLinks.map((link) => {
            const current = isCurrent(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-control px-3 py-2 transition hover:text-accent ${
                  current
                    ? "text-hero after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent"
                    : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t.search.open}
            aria-keyshortcuts="/"
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface-strong pl-3 pr-2 text-sm text-muted transition hover:border-accent hover:text-hero lg:w-52"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="hidden flex-1 truncate text-left lg:inline">{t.search.open}…</span>
            <kbd className="hidden rounded border border-border bg-surface px-1.5 font-sans text-xs text-muted lg:inline">
              /
            </kbd>
          </button>
          <LanguageToggle lang={lang} alternates={alternates} />
        </div>

        {/* Mobile: search, language toggle, menu */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t.search.open}
            className="flex h-11 w-10 items-center justify-center rounded-control border border-border bg-surface-strong text-hero transition hover:border-accent hover:text-accent"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <LanguageToggle lang={lang} alternates={alternates} />
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-10 flex-col items-center justify-center gap-1.5 rounded-control border border-border bg-surface-strong transition hover:border-accent"
          >
            <span className={`block h-0.5 w-5 bg-hero transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hero transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hero transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-menu" hidden={!menuOpen} className="border-t border-border/60 bg-surface-strong px-4 pb-5 md:hidden">
        <a
          href="tel:1930"
          className="mt-3 flex items-center justify-center gap-2 rounded-card bg-accent px-4 py-3 text-base font-bold text-white transition hover:bg-accent-dark"
        >
          <PhoneIcon className="h-5 w-5" />
          {t.footer.call}
        </a>
        <nav aria-label={t.nav.primary} className="flex flex-col gap-1 pt-3 text-base font-semibold">
          {mobileLinks.map((link) => {
            const current = isCurrent(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`rounded-control px-3 py-3 transition hover:bg-surface hover:text-accent ${
                  current ? "bg-surface text-hero" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={t.search.label}
        onClose={closeSearch}
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (event.target === event.currentTarget) closeSearch();
        }}
        className="mx-auto mt-[8vh] w-[min(48rem,calc(100%-2rem))] max-w-none overflow-hidden rounded-panel border border-border bg-surface-strong p-0 text-foreground shadow-panel backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <SearchIcon className="h-5 w-5 text-accent" />
            <label htmlFor="site-search" className="sr-only">
              {t.search.title}
            </label>
            <input
              id="site-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search.placeholder}
              className="w-full bg-transparent py-2 text-base text-hero placeholder:text-muted focus:outline-none focus-visible:shadow-none"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label={t.search.close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-accent"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-3 sm:p-4">
          <div
            className="mb-2 flex items-center justify-between gap-3 px-2 text-xs font-semibold text-muted"
            aria-live="polite"
          >
            <span>{normalizedQuery ? t.search.resultsFor(query) : t.search.suggested}</span>
            {loadingIndex ? null : <span>{t.search.shown(searchResults.length)}</span>}
          </div>

          {loadingIndex ? (
            <p className="px-2 py-8 text-center text-sm text-muted" role="status">
              {t.search.loading}
            </p>
          ) : searchResults.length > 0 ? (
            <ul className="space-y-1">
              {searchResults.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={entry.href}
                    lang={entry.lang}
                    onClick={closeSearch}
                    className="block rounded-card px-3 py-3 transition hover:bg-surface"
                  >
                    <span className="flex flex-wrap items-center gap-2 text-xs font-semibold text-accent">
                      {entry.category}
                      {entry.lang === "hi" ? (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-muted">हिंदी</span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-base font-bold leading-snug text-hero">{entry.title}</span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-6 text-slate-700">
                      {entry.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card border border-dashed border-border px-5 py-10 text-center">
              <p className="text-base font-bold text-hero">{t.search.emptyTitle}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{t.search.emptyHint}</p>
            </div>
          )}
        </div>
      </dialog>
    </header>
  );
}
