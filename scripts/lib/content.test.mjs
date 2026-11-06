/**
 * Content integrity checks, run by `npm test` and therefore in CI before
 * every deploy and before the weekly briefing is published.
 *
 * The site build is permissive by design (a malformed briefing is skipped with
 * a warning), which means a broken file can ship silently. These checks make
 * the same mistakes fail loudly instead: dangling related links, a one-sided
 * hreflang pair, a missing poster, or a briefing guide link to a page that
 * does not exist.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const { englishItems } = await import("../../src/lib/library-en.ts");
const { hindiItems } = await import("../../src/lib/library-hi.ts");

const items = [...englishItems, ...hindiItems];
const BRIEFINGS_DIR = join("src", "content", "briefings");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const key = (lang, slug) => `${lang}:${slug}`;
const byKey = new Map(items.map((item) => [key(item.lang, item.slug), item]));
const pathOf = (item) => (item.lang === "hi" ? `/awareness/hi/${item.slug}` : `/awareness/${item.slug}`);
const paths = new Map(items.map((item) => [pathOf(item), item]));

const isValidDate = (value) => ISO_DATE.test(value) && !Number.isNaN(Date.parse(value));

describe("awareness library", () => {
  it("has unique slugs within each language", () => {
    assert.equal(byKey.size, items.length);
  });

  for (const item of items) {
    const id = key(item.lang, item.slug);

    describe(id, () => {
      it("has the required text fields", () => {
        for (const field of ["title", "headline", "description", "category"]) {
          assert.ok(typeof item[field] === "string" && item[field].trim(), `${field} is empty`);
        }
        assert.ok(item.blocks.length > 0, "no transcribed blocks");
      });

      it("has a valid publishedAt", () => {
        assert.ok(isValidDate(item.publishedAt), item.publishedAt);
      });

      it("references artwork that exists in public/", () => {
        assert.ok(item.assets.length > 0, "no assets");
        for (const asset of item.assets) {
          assert.ok(existsSync(join("public", asset.src)), `missing ${asset.src}`);
          assert.ok(asset.alt?.trim(), `${asset.src} has no alt text`);
        }
      });

      it("links only to related items that exist in the same language", () => {
        for (const slug of item.related) {
          assert.ok(byKey.has(key(item.lang, slug)), `related "${slug}" not found in ${item.lang}`);
        }
      });

      if (item.altLangSlug) {
        it("has a reciprocal hreflang partner", () => {
          const otherLang = item.lang === "en" ? "hi" : "en";
          const partner = byKey.get(key(otherLang, item.altLangSlug));
          assert.ok(partner, `altLangSlug "${item.altLangSlug}" not found in ${otherLang}`);
          assert.equal(partner.altLangSlug, item.slug, "partner does not point back");
        });
      }
    });
  }
});

describe("briefings", () => {
  const files = existsSync(BRIEFINGS_DIR)
    ? readdirSync(BRIEFINGS_DIR).filter((file) => file.endsWith(".json"))
    : [];

  for (const file of files) {
    describe(file, () => {
      const briefing = JSON.parse(readFileSync(join(BRIEFINGS_DIR, file), "utf8"));

      it("has a date matching its filename", () => {
        assert.ok(isValidDate(briefing.date), briefing.date);
        assert.equal(`${briefing.date}.json`, file);
      });

      it("has a title, a published flag and stories", () => {
        assert.ok(typeof briefing.title === "string" && briefing.title.trim());
        assert.equal(typeof briefing.published, "boolean");
        assert.ok(Array.isArray(briefing.stories) && briefing.stories.length > 0);
      });

      it("links every story to an http(s) URL", () => {
        for (const story of briefing.stories) {
          assert.ok(story.headline?.trim(), "story without headline");
          assert.match(new URL(story.url).protocol, /^https?:$/, story.url);
        }
      });

      it("routes guide links to pages that exist", () => {
        for (const story of briefing.stories) {
          if (!story.guide) continue;
          const target = paths.get(story.guide.path);
          assert.ok(target, `guide path ${story.guide.path} does not exist`);
          assert.equal(story.guide.lang, target.lang, `${story.guide.path} has the wrong lang`);
        }
      });
    });
  }
});
