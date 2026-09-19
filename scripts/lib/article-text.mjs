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

async function attemptFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
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

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return null;
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
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
