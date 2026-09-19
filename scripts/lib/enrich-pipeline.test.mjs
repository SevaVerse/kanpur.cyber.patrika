/**
 * End-to-end tests for enrichStories with the network stubbed.
 *
 * These lock in the behaviour that matters operationally: a story whose take
 * cannot be verified keeps its link and loses only the take, and one bad story
 * never takes the briefing down with it.
 */

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { enrichStories } from "./enrich.mjs";

const GUIDES = [
  {
    slug: "otp-scam",
    lang: "hi",
    path: "/awareness/hi/otp-scam",
    title: "स्मार्ट फोन OTP स्कैम",
    description: "OTP scam guide",
    tags: ["OTP", "bank fraud"],
  },
];

const ARTICLE = "Police said 4 people were arrested in Kanpur for an OTP fraud worth Rs 20,000.";

const STORY = {
  headline: "Four arrested over OTP fraud",
  source: "Test Wire",
  url: "https://example.com/story",
};

function stubGroq(payload) {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(payload) } }] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
}

const realFetch = globalThis.fetch;
const realKey = process.env.GROQ_API_KEY;

afterEach(() => {
  globalThis.fetch = realFetch;
  if (realKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = realKey;
});

const deps = { fetchArticleText: async () => ARTICLE };

describe("enrichStories", () => {
  it("attaches a grounded take and the matched guide", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubGroq({
      take: "The arrests show OTP fraud is being run as an organised operation rather than by lone callers, which is why the same script keeps reappearing.",
      guide: "hi:otp-scam",
      reason: "OTP fraud",
    });

    const { stories, stats } = await enrichStories([STORY], GUIDES, deps);

    assert.equal(stats.takes, 1);
    assert.equal(stats.guides, 1);
    assert.match(stories[0].take, /organised operation/);
    assert.equal(stories[0].guide.path, "/awareness/hi/otp-scam");
  });

  it("drops a take containing an invented figure but keeps the story and guide", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubGroq({
      take: "The gang defrauded 900 victims across the state before police finally caught up with the operation this week.",
      guide: "hi:otp-scam",
      reason: "OTP fraud",
    });

    const { stories, stats } = await enrichStories([STORY], GUIDES, deps);

    assert.equal(stats.takes, 0);
    assert.equal(stories[0].take, undefined, "unverifiable take must not ship");
    assert.equal(stories[0].guide.path, "/awareness/hi/otp-scam", "guide match still stands");
    assert.match(stats.dropped[0].why, /number absent/);
  });

  it("ignores a guide id that is not in the library", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubGroq({ take: null, guide: "en:not-a-real-guide", reason: "invented" });

    const { stories, stats } = await enrichStories([STORY], GUIDES, deps);

    assert.equal(stats.guides, 0);
    assert.equal(stories[0].guide, undefined);
  });

  it("keeps the story when the source article cannot be read", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubGroq({ take: "anything", guide: null, reason: "" });

    const { stories, stats } = await enrichStories([STORY], GUIDES, {
      fetchArticleText: async () => null,
    });

    assert.equal(stories.length, 1);
    assert.equal(stories[0].take, undefined);
    assert.match(stats.dropped[0].why, /could not read/);
  });

  it("passes stories through untouched when no API key is configured", async () => {
    delete process.env.GROQ_API_KEY;

    const { stories, stats } = await enrichStories([STORY], GUIDES, deps);

    assert.deepEqual(stories, [STORY]);
    assert.equal(stats.takes, 0);
  });

  it("survives a Groq outage without losing the briefing", async () => {
    process.env.GROQ_API_KEY = "test-key";
    globalThis.fetch = async () => new Response("upstream exploded", { status: 503 });

    const { stories, stats } = await enrichStories([STORY], GUIDES, deps);

    assert.equal(stories.length, 1);
    assert.equal(stories[0].take, undefined);
    assert.equal(stats.dropped.length, 1);
  });
});
