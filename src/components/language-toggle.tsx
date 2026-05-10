"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

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

function clearGoogTransCookie() {
  // Google Translate stores the active language in a `googtrans` cookie and
  // may set it with a domain attribute as well as path-scoped variants.
  // We must expire all combinations to reliably remove it.
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  const hostname = window.location.hostname;
  const paths = ["/", window.location.pathname];
  const domains = ["", `; domain=${hostname}`, `; domain=.${hostname}`];
  for (const path of paths) {
    for (const domain of domains) {
      document.cookie = `googtrans=; ${expire}; path=${path}${domain}`;
    }
  }
}

function setGoogleTranslateLanguage(lang: "en" | "hi") {
  if (lang === "en") {
    clearGoogTransCookie();
    // Set /en/en so Google Translate treats the page as "already in source
    // language" and skips any re-translation after the reload.
    const hostname = window.location.hostname;
    document.cookie = "googtrans=/en/en; path=/";
    document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`;
    document.cookie = `googtrans=/en/en; path=/; domain=.${hostname}`;
    window.location.reload();
    return;
  }
  // For Hindi: set the cookie so Google Translate picks it up, then trigger
  // the hidden combo select which fires the actual DOM translation.
  document.cookie = "googtrans=/en/hi; path=/";
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    combo.value = "hi";
    combo.dispatchEvent(new Event("change"));
  }
}

export function LanguageToggle() {
  const [active, setActive] = useState<"en" | "hi">("en");
  const initialized = useRef(false);

  // Reflect cookie state on mount (page was reloaded after a language switch)
  useEffect(() => {
    const cookie = document.cookie;
    const isHindi = cookie.includes("googtrans=/en/hi");
    if (isHindi) setActive("hi");
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,en",
          layout: 0, // SIMPLE layout
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };
  }, []);

  function toggle(lang: "en" | "hi") {
    setActive(lang);
    setGoogleTranslateLanguage(lang);
  }

  return (
    <>
      {/* Hidden widget mount — Google Translate attaches its select here */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Pill toggle */}
      <div
        role="group"
        aria-label="Language switcher"
        className="flex items-center overflow-hidden rounded-full border border-border text-xs font-bold uppercase tracking-[0.2em]"
      >
        <button
          type="button"
          onClick={() => toggle("en")}
          aria-pressed={active === "en"}
          className={`px-3 py-1.5 transition ${
            active === "en"
              ? "bg-accent text-white"
              : "bg-surface text-muted hover:text-accent"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => toggle("hi")}
          aria-pressed={active === "hi"}
          className={`px-3 py-1.5 transition ${
            active === "hi"
              ? "bg-accent text-white"
              : "bg-surface text-muted hover:text-accent"
          }`}
        >
          हिंदी
        </button>
      </div>

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </>
  );
}
