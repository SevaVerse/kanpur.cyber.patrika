import { Hind } from "next/font/google";

/**
 * Hind covers Latin and Devanagari, self-hosted at build time by next/font so
 * the static export makes no request to Google.
 *
 * Every page used to preload six files (3 weights x 2 subsets). Now only the
 * Latin faces are preloaded. The Devanagari faces are still declared, with
 * `unicode-range`, so they download as soon as a page renders Hindi text —
 * just without competing with the LCP image for early bandwidth.
 *
 * Trade-off: on Hindi pages, text can paint in the system Devanagari font for
 * a moment before Hind swaps in. Preloading per language is not possible
 * here — next/font's preload list is aggregated across the whole app, so a
 * preloaded Devanagari instance anywhere preloads it everywhere.
 */
export const hind = Hind({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});
