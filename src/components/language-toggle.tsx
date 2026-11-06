"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { type Lang, ui } from "@/lib/i18n";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

/** Mounted once by the navbar; Google attaches its hidden select here. */
export const TRANSLATE_MOUNT_ID = "google_translate_element";
const SCRIPT_ID = "google-translate-script";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
];

/** Reads Google Translate's `googtrans=/from/to` cookie. */
function readTranslationTarget(): Lang | null {
  const match = /(?:^|;\s*)googtrans=\/(\w+)\/(\w+)/.exec(document.cookie);
  if (!match || match[1] === match[2]) return null;

  return match[2] === "hi" || match[2] === "en" ? match[2] : null;
}

function clearGoogTransCookie() {
  // Google Translate may set the cookie with and without a domain attribute,
  // and path-scoped, so every combination has to be expired.
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  const hostname = window.location.hostname;
  for (const path of ["/", window.location.pathname]) {
    for (const domain of ["", `; domain=${hostname}`, `; domain=.${hostname}`]) {
      document.cookie = `googtrans=; ${expire}; path=${path}${domain}`;
    }
  }
}

/**
 * Loads Google's widget only when a reader actually asks for machine
 * translation. It used to load on every page view for every reader, which put
 * third-party script, cookies and DOM rewriting on pages that never needed it.
 */
function loadGoogleTranslate(pageLanguage: Lang) {
  if (document.getElementById(SCRIPT_ID)) {
    return false;
  }

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    new window.google.translate.TranslateElement(
      { pageLanguage, includedLanguages: "hi,en", layout: 0, autoDisplay: false },
      TRANSLATE_MOUNT_ID,
    );
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
  return true;
}

function machineTranslate(pageLanguage: Lang, target: Lang) {
  document.cookie = `googtrans=/${pageLanguage}/${target}; path=/`;

  // First load: the widget reads the cookie on init and translates by itself.
  if (loadGoogleTranslate(pageLanguage)) return;

  // Already loaded: drive its hidden select.
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    combo.value = target;
    combo.dispatchEvent(new Event("change"));
  }
}

function normalisePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

type LanguageToggleProps = {
  lang: Lang;
  alternates: Record<string, string>;
};

/**
 * EN / हिंदी switch.
 *
 * When the page has a hand-written translation (an hreflang pair in the
 * library), the toggle is a plain link to it — better Hindi than any machine
 * translation, and a real page search engines can see. Only when no
 * translation exists does it fall back to Google's machine translation, and
 * says so.
 */
export function LanguageToggle({ lang, alternates }: LanguageToggleProps) {
  const pathname = normalisePath(usePathname() ?? "/");
  const alternatePath = alternates[pathname];
  const t = ui[lang].language;

  // null until mounted: the cookie does not exist during the static render.
  const [translatedTo, setTranslatedTo] = useState<Lang | null>(null);

  useEffect(() => {
    const target = readTranslationTarget();
    if (!target || target === lang) return;

    // Syncing from an external system (document.cookie) that does not exist
    // during SSR. Reading it as initial state instead would desync hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTranslatedTo(target);
    // A reader who chose machine translation keeps it as they browse.
    loadGoogleTranslate(lang);
  }, [lang]);

  const shown = translatedTo ?? lang;

  function choose(target: Lang) {
    if (target === shown) return;

    if (target === lang) {
      // Back to the original language: drop the translation entirely.
      clearGoogTransCookie();
      window.location.reload();
      return;
    }

    setTranslatedTo(target);
    machineTranslate(lang, target);
  }

  const baseClass = "px-3 py-1.5 transition focus-visible:outline-2 focus-visible:-outline-offset-2";
  const activeClass = "bg-accent text-white";
  const idleClass = "bg-surface text-muted hover:text-accent";

  return (
    <div
      role="group"
      aria-label={t.group}
      className="notranslate flex items-center overflow-hidden rounded-full border border-border text-xs font-bold uppercase tracking-label"
      translate="no"
    >
      {LANGS.map(({ code, label }) => {
        const active = shown === code;
        const className = `${baseClass} ${active ? activeClass : idleClass}`;

        if (!active && code !== lang && alternatePath && !translatedTo) {
          return (
            <Link key={code} href={alternatePath} lang={code} hrefLang={code} className={className}>
              {label}
            </Link>
          );
        }

        const machine = code !== lang && !alternatePath;

        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => choose(code)}
            aria-pressed={active}
            title={machine ? t.machine : undefined}
            className={className}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
