const DISPLAY_TIME_ZONE = "Asia/Kolkata";

/**
 * Formats an ISO date for display.
 *
 * The time zone is pinned deliberately. These helpers run inside client
 * components, so the build machine (UTC) and the reader's browser (local)
 * would otherwise produce different strings and trip a hydration mismatch.
 * Readers are in India, so IST is also the correct thing to show.
 */
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(new Date(value));
}

/** Longer form for article and briefing headers. */
export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(new Date(value));
}

/** RFC 822 date, required by RSS `pubDate`. */
export function formatRfc822(value: string) {
  return new Date(value).toUTCString();
}
