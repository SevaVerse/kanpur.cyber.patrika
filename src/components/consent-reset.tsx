"use client";

import { useState } from "react";

import { ANALYTICS_CONSENT_KEY } from "@/components/analytics";

/** Lets a reader withdraw (or revisit) their analytics choice. */
export function ConsentReset() {
  const [done, setDone] = useState(false);

  function reset() {
    try {
      window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
    } catch {
      // Storage unavailable: nothing was stored, so there is nothing to reset.
    }
    setDone(true);
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={reset}
      disabled={done}
      className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-hero transition hover:border-accent hover:text-accent disabled:opacity-60"
    >
      Reset my analytics choice
    </button>
  );
}
