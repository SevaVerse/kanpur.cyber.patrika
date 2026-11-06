/**
 * Fetches the readable text of a news article.
 *
 * This is the grounding step, and it is the whole safety story: a model asked
 * "why does this matter" from a headline alone will invent figures, victim
 * counts and dates. A cyber security publication cannot ship invented numbers,
 * so a story we cannot read is a story that gets no take.
 */

const FETCH_TIMEOUT_MS = 12_000;
const MAX_BYTES = 2_000_000;
const MIN_USEFUL_CHARS = 400;
// Trimmed from 4,000: the excerpt dominates each request, and the free tier
// meters tokens per minute. 2,000 chars still carries the facts a take needs.
const EXCERPT_CHARS = 2_000;

const USER_AGENT =
  "CyberVaniBot/1.0 (+https://cybervani.com; weekly briefing; contact via https://cybervani.com/contact)";

function stripHtml(html) {
  return (
    html
      // Remove everything that is not prose before touching the tags.
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<header[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<form[\s\S]*?<\/form>/gi, " ")
      .replace(/<aside[\s\S]*?<\/aside>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Prefers the <article> body — it cuts most of the navigation and
 * related-links boilerplate — but only when it actually carries the story.
 *
 * Plenty of sites wrap a teaser in <article> and render the body elsewhere.
 * Accepting the first candidate that merely clears the threshold cost us most
 * of the text on such pages (one real example: 613 chars from <article> versus
 * 9,195 from the full page), so take whichever extraction yields more.
 */
function extractBody(html) {
  const full = stripHtml(html);

  const articles = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)]
    .map((match) => stripHtml(match[1]))
    .sort((a, b) => b.length - a.length);

  const richest = articles[0] ?? "";

  // Prefer the cleaner <article> text only when it holds most of the page's
  // prose; otherwise it is a teaser and the full page has the real story.
  return richest.length >= full.length * 0.5 ? richest : full;
}

/**
 * Returns the article text, or null when it cannot be read. Never throws —
 * an unreadable source should cost one take, not the whole briefing.
 *
 * Retries once: outbound failures here are frequently transient, and a dropped
 * connection should not silently cost a story its take.
 */
export async function fetchArticleText(url, { retries = 1 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const text = await attemptFetch(url);
    if (text) return text;
  }

  return null;
}

const MAX_REDIRECTS = 5;

/**
 * Hosts we never fetch: loopback, link-local (cloud metadata), private ranges.
 * Only literal hostnames are checked — the drafter runs on an ephemeral CI
 * runner, so this is defence in depth rather than a full SSRF boundary.
 */
const BLOCKED_HOST =
  /^(localhost|.*\.local|.*\.internal|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|\[?::1\]?|\[?f[cd][0-9a-f:]*\]?|\[?fe80:[0-9a-f:]*\]?)$/i;

export function isFetchableUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (url.username || url.password) return false;

  return !BLOCKED_HOST.test(url.hostname);
}

/** Reads at most `limit` bytes, aborting the download past it. */
async function readCapped(response, limit) {
  const declared = Number.parseInt(response.headers.get("content-length") ?? "", 10);
  if (Number.isFinite(declared) && declared > limit) return null;

  if (!response.body) return null;

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      return null;
    }

    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

async function attemptFetch(startUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    let url = startUrl;
    let response;

    // Redirects are followed by hand so every hop is re-checked: a public
    // article URL must not be able to bounce the fetch to an internal host.
    for (let hop = 0; ; hop += 1) {
      if (!isFetchableUrl(url)) return null;

      response = await fetch(url, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          // Identifies the bot honestly. Some publishers block non-browser
          // agents; that is their call, and we take the refusal rather than
          // spoofing a browser to get around it. The story simply ships
          // without a take.
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
        },
      });

      const location = response.headers.get("location");
      if (response.status < 300 || response.status >= 400 || !location) break;
      if (hop >= MAX_REDIRECTS) return null;

      url = new URL(location, url).toString();
    }

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return null;
    }

    const buffer = await readCapped(response, MAX_BYTES);
    if (!buffer) {
      return null;
    }

    const text = extractBody(new TextDecoder("utf-8").decode(buffer));

    return text.length >= MIN_USEFUL_CHARS ? text.slice(0, EXCERPT_CHARS) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
