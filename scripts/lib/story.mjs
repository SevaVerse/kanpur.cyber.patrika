/**
 * Intake hygiene for stories returned by the news APIs.
 */

const MAX_HEADLINE_CHARS = 220;

/**
 * News API fields are untrusted. Headlines are stripped of markup and control
 * characters and capped; URLs must be absolute http(s). Anything else drops
 * the story — the site renders these values, and the render path has its own
 * fence, but bad data should never reach a commit in the first place.
 */
export function sanitiseStory(story) {
  const headline = String(story.headline ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001f\u007f\u2028\u2029]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!headline || headline.length > MAX_HEADLINE_CHARS) return null;

  let url;
  try {
    url = new URL(String(story.url ?? "").trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const source = String(story.source ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  return { ...story, headline, url: url.toString(), source: source || url.hostname };
}
