import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sanitiseStory } from "./story.mjs";

const base = { headline: "Kanpur police bust OTP fraud gang", source: "Example News", url: "https://example.com/a" };

describe("sanitiseStory", () => {
  it("keeps a well-formed story", () => {
    assert.deepEqual(sanitiseStory(base), base);
  });

  it("drops non-web URLs", () => {
    for (const url of ["javascript:alert(1)", "data:text/html,x", "ftp://example.com/a", "not a url", ""]) {
      assert.equal(sanitiseStory({ ...base, url }), null, url);
    }
  });

  it("strips markup and control characters from headlines", () => {
    const story = sanitiseStory({ ...base, headline: "Scam</script><script>alert(1)</script>\u0000 alert" });
    assert.equal(story.headline.includes("<"), false);
    assert.equal(story.headline, "Scam alert(1) alert");
  });

  it("drops empty and over-long headlines", () => {
    assert.equal(sanitiseStory({ ...base, headline: "   " }), null);
    assert.equal(sanitiseStory({ ...base, headline: "x".repeat(300) }), null);
  });

  it("falls back to the hostname when the source is missing", () => {
    assert.equal(sanitiseStory({ ...base, source: "" }).source, "example.com");
  });
});

describe("isFetchableUrl", async () => {
  const { isFetchableUrl } = await import("./article-text.mjs");

  it("allows public http(s) URLs", () => {
    assert.equal(isFetchableUrl("https://timesofindia.indiatimes.com/a"), true);
    assert.equal(isFetchableUrl("http://example.com/"), true);
  });

  it("refuses internal hosts and other schemes", () => {
    for (const url of [
      "http://localhost/",
      "http://127.0.0.1/",
      "http://169.254.169.254/latest/meta-data/",
      "http://10.0.0.5/",
      "http://192.168.1.1/",
      "http://172.20.0.1/",
      "http://[::1]/",
      "file:///etc/passwd",
      "https://user:pass@example.com/",
    ]) {
      assert.equal(isFetchableUrl(url), false, url);
    }
  });
});
