/**
 * Generates a grounded editorial take for each story and matches it to a guide
 * in the awareness library.
 *
 * Two jobs, deliberately different in risk:
 *
 *   1. The take is GENERATION. It is constrained to the fetched article text
 *      and every claim is validated against it before shipping.
 *   2. The guide match is CLASSIFICATION — pick one of N known slugs, or none.
 *      Near-zero hallucination surface, and it is the part no aggregator can
 *      copy: it routes readers into our own evergreen pages every week.
 *
 * Anything that fails validation is dropped. A story without a take still
 * renders as a curated link, which is honest. Silence beats invention.
 */

import { findGuide, guideCatalogue } from "./guides.mjs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models";

// Overridable because Groq rotates its hosted open-weight models. If this id is
// retired, the script prints the models the account can actually use.
const DEFAULT_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const MIN_TAKE_CHARS = 60;
// Reasoning tokens count against max_tokens, so the ceiling has to clear the
// reasoning AND the JSON. 400 was too low: the model ran out mid-document.
const MAX_TAKE_TOKENS = 1024;
const MAX_SUMMARY_TOKENS = 512;
const MAX_ATTEMPTS = 4;
const MAX_RETRY_WAIT_MS = 30_000;
// Free tier meters tokens per minute; spacing requests keeps us under it so
// the retry path stays an exception rather than the normal route.
const PACING_MS = Number.parseInt(process.env.GROQ_PACING_MS ?? "15000", 10);
const MAX_TAKE_CHARS = 420;
const REQUEST_TIMEOUT_MS = 30_000;

const REFUSAL_MARKERS = [
  "i cannot",
  "i can't",
  "i'm sorry",
  "i am sorry",
  "as an ai",
  "as a language model",
  "unable to provide",
  "i don't have enough",
];

function systemPrompt(catalogue) {
  return `You write the "Why it matters" note for Cyber Vani, a cyber security publication for readers in India.

You will be given one news story and an excerpt of the source article.

Write a take of 2-3 sentences explaining why this story matters to an ordinary Indian reader — the practical consequence, the risk it points to, or what it changes. Plain, calm language. No hype, no marketing, no rhetorical questions.

HARD RULES:
- Use ONLY information present in the article excerpt. Do NOT introduce any fact, figure, statistic, monetary amount, company name, person, place, product or date that does not appear in the excerpt.
- If the excerpt is too thin to support a specific take, return null for "take". Returning null is correct and expected. Never pad with generalities to fill the field.
- Do not restate the headline. Add the significance the headline leaves out.
- Do not address the reader as "you should". State what the development means.

You must also pick the single most relevant guide from our awareness library, or null if none genuinely fits. Do not force a match — an unrelated guide is worse than none.

AVAILABLE GUIDES:
${catalogue}

Respond with JSON only, in exactly this shape:
{"take": string | null, "guide": string | null, "reason": string}

"guide" must be an exact id from the list above (for example "hi:otp-scam") or null.
"reason" is one short sentence for our logs explaining the guide choice, or why you returned null.`;
}

function userPrompt(story, articleText) {
  return `HEADLINE: ${story.headline}
SOURCE: ${story.source}

ARTICLE EXCERPT:
${articleText}`;
}

/** Numbers as the validator sees them: digits only, separators removed. */
export function numericTokens(text) {
  return (text.match(/\d[\d,.]*/g) ?? [])
    .map((token) => token.replace(/[,.]/g, "").replace(/^0+(?=\d)/, ""))
    .filter((token) => token.length > 0);
}

/**
 * The core safety check: every number in the take must be traceable to the
 * source. This is what stops an invented "₹50 crore" or a wrong CVE number.
 */
export function numbersAreGrounded(take, sourceText) {
  const sourceNumbers = new Set(numericTokens(sourceText));

  return numericTokens(take).every((token) => sourceNumbers.has(token));
}

export function validateTake(take, sourceText) {
  // null is the documented, correct answer when the excerpt is too thin to
  // support a specific take. It is a decision, not a malfunction, and the
  // caller reports it separately so a quiet week does not read like a fault.
  if (take === null || take === undefined) {
    return { ok: false, declined: true, why: "model declined — excerpt too thin for a specific take" };
  }

  if (typeof take !== "string") return { ok: false, why: "take was not a string" };

  const trimmed = take.trim();

  if (trimmed.length < MIN_TAKE_CHARS) return { ok: false, why: "take too short" };
  if (trimmed.length > MAX_TAKE_CHARS) return { ok: false, why: "take too long" };

  const lowered = trimmed.toLowerCase();
  if (REFUSAL_MARKERS.some((marker) => lowered.includes(marker))) {
    return { ok: false, why: "model refused or hedged" };
  }

  if (!numbersAreGrounded(trimmed, sourceText)) {
    return { ok: false, why: "take contains a number absent from the source" };
  }

  return { ok: true, take: trimmed };
}

/**
 * Parses the model's reply, tolerating a JSON object wrapped in prose or
 * reasoning text. Reasoning-style models sometimes narrate around the answer
 * even in JSON mode, and losing a valid take to a stray preamble is a waste.
 */
export function parseJsonLoosely(content) {
  try {
    return JSON.parse(content);
  } catch {
    // Fall through to extraction.
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end <= start) return null;

  try {
    return JSON.parse(content.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function listAvailableModels(apiKey) {
  try {
    const response = await fetch(GROQ_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) return [];

    const payload = await response.json();
    return (payload.data ?? []).map((model) => model.id).sort();
  } catch {
    return [];
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * How long to wait after a 429. Groq states the exact delay in the error body
 * ("Please try again in 4.5225s"), which beats guessing; the `retry-after`
 * header is used when present, and exponential backoff is the last resort.
 */
export function retryDelayMs(headerValue, body, attempt) {
  const header = Number.parseFloat(headerValue ?? "");
  if (Number.isFinite(header) && header > 0) {
    return Math.min(header * 1000 + 250, MAX_RETRY_WAIT_MS);
  }

  const stated = /try again in ([\d.]+)\s*s/i.exec(body ?? "");
  if (stated) {
    return Math.min(Number.parseFloat(stated[1]) * 1000 + 250, MAX_RETRY_WAIT_MS);
  }

  return Math.min(2 ** attempt * 1000, MAX_RETRY_WAIT_MS);
}

/**
 * One chat completion, with retry on 429.
 *
 * The free tier meters tokens per minute and counts `max_tokens` against the
 * budget as requested, so the ceiling is kept only as high as a reasoning
 * model needs to reach its JSON — not higher.
 */
// Cleared for the rest of the run if the API rejects the parameter, so an
// unsupported option costs one request rather than every take.
let reasoningEffortSupported = true;

async function postChat(apiKey, model, messages, maxTokens) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    // gpt-oss reasons before answering, and that reasoning is billed against
    // max_tokens. Keeping it low leaves room to finish the JSON.
    const useReasoningEffort = reasoningEffortSupported && /gpt-oss/i.test(model);

    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
          ...(useReasoningEffort ? { reasoning_effort: "low" } : {}),
          messages,
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        const content = payload.choices?.[0]?.message?.content;

        if (!content) return { error: "empty completion" };

        const parsed = parseJsonLoosely(content);
        return parsed ? { data: parsed } : { error: "completion was not valid JSON" };
      }

      const body = await response.text();

      if (response.status === 429 && attempt < MAX_ATTEMPTS) {
        const wait = retryDelayMs(response.headers.get("retry-after"), body, attempt);
        console.warn(`  rate limited, waiting ${Math.round(wait / 1000)}s (attempt ${attempt})`);
        await sleep(wait);
        continue;
      }

      // If the model does not take reasoning_effort, drop it and carry on
      // rather than losing every take to one unsupported parameter.
      if (useReasoningEffort && /reasoning_effort/i.test(body)) {
        console.warn("  model rejected reasoning_effort — retrying without it");
        reasoningEffortSupported = false;
        continue;
      }

      return { error: `HTTP ${response.status}: ${body.slice(0, 300)}` };
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        return { error: error.name === "AbortError" ? "request timed out" : error.message };
      }
      await sleep(2 ** attempt * 1000);
    } finally {
      clearTimeout(timer);
    }
  }

  return { error: "exhausted retries" };
}

function callGroq(apiKey, model, story, articleText, catalogue) {
  return postChat(
    apiKey,
    model,
    [
      { role: "system", content: systemPrompt(catalogue) },
      { role: "user", content: userPrompt(story, articleText) },
    ],
    MAX_TAKE_TOKENS,
  );
}

/**
 * Enriches stories in place-ish (returns new objects). Never throws: on any
 * failure the story simply keeps no take and no guide.
 *
 * Returns { stories, stats } so the caller can report what was dropped.
 */
export async function enrichStories(stories, guides, { fetchArticleText }) {
  const apiKey = process.env.GROQ_API_KEY;
  const stats = { attempted: 0, takes: 0, guides: 0, dropped: [], declined: [] };

  if (!apiKey) {
    console.warn("GROQ_API_KEY not set — publishing as a curated link list with no takes.");
    return { stories, stats };
  }

  const catalogue = guideCatalogue(guides);
  let callsMade = 0;
  const enriched = [];
  let modelChecked = false;

  for (const story of stories) {
    stats.attempted += 1;

    const articleText = await fetchArticleText(story.url);

    if (!articleText) {
      stats.dropped.push({ headline: story.headline, why: "could not read the source article" });
      enriched.push(story);
      continue;
    }

    // Space the calls out. The free tier meters tokens per minute, and firing
    // ten requests back to back burned the budget four stories in.
    if (callsMade > 0 && PACING_MS > 0) {
      await sleep(PACING_MS);
    }

    callsMade += 1;

    const result = await callGroq(apiKey, DEFAULT_MODEL, story, articleText, catalogue);

    if (result.error) {
      // A bad model id fails every story identically — say so once, usefully.
      if (!modelChecked && /model|decommission|not found|does not exist/i.test(result.error)) {
        modelChecked = true;
        const available = await listAvailableModels(apiKey);
        console.warn(
          `\nGroq rejected model "${DEFAULT_MODEL}".` +
            (available.length
              ? `\nModels available to this key:\n  ${available.join("\n  ")}\n` +
                `Set GROQ_MODEL to one of these.\n`
              : "\nCould not list available models — check GROQ_API_KEY.\n"),
        );
      }

      stats.dropped.push({ headline: story.headline, why: result.error });
      enriched.push(story);
      continue;
    }

    const validation = validateTake(result.data?.take, articleText);
    const guide = findGuide(guides, result.data?.guide);

    if (validation.ok) {
      stats.takes += 1;
    } else if (validation.declined) {
      stats.declined.push({ headline: story.headline, why: validation.why });
    } else {
      stats.dropped.push({ headline: story.headline, why: validation.why });
    }

    if (guide) stats.guides += 1;

    enriched.push({
      ...story,
      ...(validation.ok ? { take: validation.take } : {}),
      ...(guide ? { guide: { path: guide.path, title: guide.title, lang: guide.lang } } : {}),
    });
  }

  return { stories: enriched, stats };
}

/**
 * Writes the edition summary from the headlines and the takes that already
 * passed validation. Grounding here is our own verified text, so the numeric
 * check runs against exactly what the reader will see further down the page.
 *
 * Returns "" when it cannot be written — the page renders fine without one.
 */
export async function summariseBriefing(stories) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return "";

  const grounding = stories
    .map((story) => `- ${story.headline}${story.take ? `\n  ${story.take}` : ""}`)
    .join("\n");

  const result = await postChat(
    apiKey,
    DEFAULT_MODEL,
    [
      {
        role: "system",
        content: `You write the one-sentence standfirst for a weekly cyber security briefing from Cyber Vani, an Indian publication.

Given this week's stories, write ONE sentence naming the two or three most significant threads, in the form "This week: A, B, and C."

Use only what appears in the list. Introduce no fact, figure, name or date that is not there. Plain language, no hype.

Respond with JSON only: {"summary": string}`,
      },
      { role: "user", content: `THIS WEEK'S STORIES:\n${grounding}` },
    ],
    MAX_SUMMARY_TOKENS,
  );

  if (result.error) {
    console.warn(`  summary skipped: ${result.error}`);
    return "";
  }

  const summary = result.data?.summary;
  if (typeof summary !== "string") return "";

  const trimmed = summary.trim();

  if (trimmed.length < 40 || trimmed.length > 320) return "";
  if (REFUSAL_MARKERS.some((marker) => trimmed.toLowerCase().includes(marker))) return "";
  if (!numbersAreGrounded(trimmed, grounding)) return "";

  return trimmed;
}

