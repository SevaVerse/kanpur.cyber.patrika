import { Hind } from "next/font/google";

/**
 * One family for Latin and Devanagari, self-hosted at build time by
 * next/font so the static export makes no request to Google. Declared once
 * here because both root layouts (English and Hindi) use it.
 */
export const hind = Hind({
  subsets: ["latin", "devanagari"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});
