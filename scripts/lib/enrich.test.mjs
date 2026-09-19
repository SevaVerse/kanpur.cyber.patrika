/**
 * Tests for the take validator.
 *
 * This is the mechanism that keeps invented figures out of a security
 * publication, so it is the part of the pipeline most worth testing. Run with
 * `npm test`.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  numbersAreGrounded,
  numericTokens,
  parseJsonLoosely,
  retryDelayMs,
  validateTake,
} from "./enrich.mjs";

const SOURCE =
  "Police in Kanpur arrested 4 people on Tuesday over a digital arrest scam that cost " +
  "victims Rs 50,00,000 across 12 districts. The gang operated since 2024 and used " +
  "fake CBI warrants to intimidate targets.";

const VALID_TAKE =
  "The arrests show digital arrest scams are now run by organised gangs rather than lone " +
  "operators, which is why the same script appears across districts. Anyone receiving a " +
  "video call alleging an arrest warrant should treat it as fraud.";

describe("numericTokens", () => {
  it("normalises separators so 50,00,000 and 5000000 compare equal", () => {
    assert.deepEqual(numericTokens("Rs 50,00,000"), ["5000000"]);
    assert.deepEqual(numericTokens("5000000"), ["5000000"]);
  });

  it("strips leading zeros", () => {
    assert.deepEqual(numericTokens("007"), ["7"]);
  });

  it("returns nothing for text without digits", () => {
    assert.deepEqual(numericTokens("no numbers at all"), []);
  });
});

describe("numbersAreGrounded", () => {
  it("accepts a take whose numbers all appear in the source", () => {
    assert.equal(numbersAreGrounded("4 people were arrested across 12 districts.", SOURCE), true);
  });

  it("accepts a take with no numbers at all", () => {
    assert.equal(numbersAreGrounded("Organised gangs are running this scam.", SOURCE), true);
  });

  it("rejects an invented figure — the case this exists to stop", () => {
    assert.equal(numbersAreGrounded("The gang stole Rs 90,00,000 from victims.", SOURCE), false);
  });

  it("rejects an invented year", () => {
    assert.equal(numbersAreGrounded("The gang has operated since 2019.", SOURCE), false);
  });

  it("matches a figure written with different separators", () => {
    assert.equal(numbersAreGrounded("Losses reached Rs 5000000.", SOURCE), true);
  });
});

describe("validateTake", () => {
  it("accepts a well-formed grounded take", () => {
    const result = validateTake(VALID_TAKE, SOURCE);
    assert.equal(result.ok, true);
    assert.equal(result.take, VALID_TAKE);
  });

  it("trims surrounding whitespace", () => {
    const result = validateTake(`  ${VALID_TAKE}  `, SOURCE);
    assert.equal(result.ok, true);
    assert.equal(result.take, VALID_TAKE);
  });

  it("treats null as a deliberate decline, not a failure", () => {
    const result = validateTake(null, SOURCE);
    assert.equal(result.ok, false);
    assert.equal(result.declined, true, "a decline must be distinguishable from a malfunction");
    assert.match(result.why, /declined/);
  });

  it("treats a non-string, non-null take as a genuine failure", () => {
    const result = validateTake(42, SOURCE);
    assert.equal(result.ok, false);
    assert.equal(result.declined, undefined);
  });

  it("rejects a take that is too short to say anything", () => {
    assert.equal(validateTake("Bad news.", SOURCE).ok, false);
  });

  it("rejects a take that runs past the length cap", () => {
    assert.equal(validateTake("a".repeat(500), SOURCE).ok, false);
  });

  it("rejects a refusal that leaked through as prose", () => {
    const refusal =
      "I'm sorry, but I cannot determine the significance of this story from the excerpt provided here.";
    assert.equal(validateTake(refusal, SOURCE).ok, false);
  });

  it("rejects a fluent take carrying one invented number", () => {
    const hallucinated =
      "The arrests matter because the gang defrauded 800 victims before being caught, showing how " +
      "far these operations scale before police intervene in such cases.";
    const result = validateTake(hallucinated, SOURCE);
    assert.equal(result.ok, false);
    assert.match(result.why, /number absent from the source/);
  });
});

describe("parseJsonLoosely", () => {
  it("parses a clean JSON object", () => {
    assert.deepEqual(parseJsonLoosely('{"take":"x","guide":null}'), { take: "x", guide: null });
  });

  it("recovers JSON wrapped in reasoning or prose", () => {
    const wrapped = 'Let me think about this.\n\n{"take":"x","guide":"hi:otp-scam"}\n\nThat is my answer.';
    assert.deepEqual(parseJsonLoosely(wrapped), { take: "x", guide: "hi:otp-scam" });
  });

  it("recovers JSON from a fenced code block", () => {
    assert.deepEqual(parseJsonLoosely('```json\n{"take":null,"guide":null}\n```'), {
      take: null,
      guide: null,
    });
  });

  it("returns null when there is no JSON at all", () => {
    assert.equal(parseJsonLoosely("I could not complete that request."), null);
  });
});

describe("retryDelayMs", () => {
  it("prefers the retry-after header when present", () => {
    assert.equal(retryDelayMs("5", "", 1), 5250);
  });

  it("parses the delay Groq states in the 429 body", () => {
    const body = '{"error":{"message":"Rate limit reached ... Please try again in 4.5225s."}}';
    assert.equal(retryDelayMs(null, body, 1), 4772.5);
  });

  it("falls back to exponential backoff when neither is available", () => {
    assert.equal(retryDelayMs(null, "no hint here", 1), 2000);
    assert.equal(retryDelayMs(null, "no hint here", 3), 8000);
  });

  it("caps the wait so a bad header cannot stall the run", () => {
    assert.equal(retryDelayMs("600", "", 1), 30000);
    assert.equal(retryDelayMs(null, "try again in 900s", 1), 30000);
  });

  it("ignores a non-numeric header", () => {
    assert.equal(retryDelayMs("soon", "no hint", 2), 4000);
  });
});
