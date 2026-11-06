"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import type { Lang } from "@/lib/i18n";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
export const ANALYTICS_CONSENT_KEY = "cv-analytics-consent";

type Consent = "granted" | "denied";

const copy = {
  en: {
    body: "We would like to use Google Analytics to count visits and see which guides help people most. It sets cookies. Nothing loads unless you allow it.",
    allow: "Allow",
    deny: "No thanks",
    more: "Privacy",
    label: "Analytics consent",
  },
  hi: {
    body: "हम यह जानने के लिए Google Analytics का उपयोग करना चाहते हैं कि कितने लोग आते हैं और कौन-सी गाइड सबसे उपयोगी है। यह कुकीज़ सेट करता है। आपकी अनुमति के बिना कुछ भी लोड नहीं होगा।",
    allow: "अनुमति दें",
    deny: "नहीं, धन्यवाद",
    more: "गोपनीयता",
    label: "एनालिटिक्स सहमति",
  },
} as const;

function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function writeConsent(value: Consent) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Storage blocked (private mode): the choice holds for this page view only.
  }
}

/**
 * Google Analytics 4, strictly opt-in.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_ID is set. When it is, no Google
 * script loads and no cookie is set until the reader agrees — notice and
 * consent before processing, as India's DPDP Act 2023 expects, and the only
 * defensible default for a site that tells people to guard their data.
 */
export function Analytics({ lang }: { lang: Lang }) {
  // undefined until mounted: localStorage does not exist in the static render.
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    // Syncing from an external system (localStorage) that does not exist
    // during SSR. Reading it as initial state instead would desync hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
  }, []);

  if (!gaId || consent === undefined || consent === "denied") {
    return null;
  }

  if (consent === "granted") {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
      </>
    );
  }

  const t = copy[lang];

  function choose(value: Consent) {
    writeConsent(value);
    setConsent(value);
  }

  return (
    <section
      aria-label={t.label}
      lang={lang}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-card border border-border bg-surface-strong p-4 shadow-lift sm:inset-x-6 sm:p-5"
    >
      <p className="text-sm leading-6 text-slate-700">
        {t.body}{" "}
        <Link href="/privacy" className="font-semibold text-accent underline-offset-2 hover:underline">
          {t.more}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          {t.allow}
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-hero transition hover:border-accent hover:text-accent"
        >
          {t.deny}
        </button>
      </div>
    </section>
  );
}
