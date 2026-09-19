# Cyber Vani

A static cyber security publication for readers in Uttar Pradesh and across India, built with the Next.js App
Router, TypeScript and Tailwind CSS, and deployed to GitHub Pages.

Production domain: `https://cybervani.com/`

The site has two halves:

- **Weekly briefings** (`/briefing`) — a curated read of the week's cyber security stories, published by a
  fully automated pipeline. Headlines link straight to the original publisher; each story carries a short
  AI-written note on why it matters, grounded in that publisher's own reporting and validated against it,
  plus a link to the guide that explains how to avoid the threat. Briefings are committed content, so the
  archive is permanent.
- **Awareness library** (`/awareness`) — evergreen guides in Hindi and English on the frauds doing the rounds:
  digital arrest, fake e-challans, OTP theft, WhatsApp hijacking, mole accounts and more. Every guide is the
  full text of one of our posters or comics, so it can be read, searched, translated and read aloud.

## Stack

- Next.js App Router with static export (`output: "export"`)
- TypeScript, Tailwind CSS v4
- GitHub Actions → GitHub Pages
- Formspree-compatible contact form
- Google Analytics 4 (optional, disabled unless `NEXT_PUBLIC_GA_ID` is set)
- Groq for the weekly briefing takes (optional — briefings degrade to curated links without it)

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local`. Every variable is optional for local work.

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEWSDATA_API_KEY` | `scripts/draft-briefing.mjs` | Briefing drafting only — never read during a site build. |
| `NEWSAPI_ORG_KEY` | `scripts/draft-briefing.mjs` | Second source for the drafter. |
| `GROQ_API_KEY` | `scripts/draft-briefing.mjs` | Writes the takes and guide matches. Without it briefings publish as plain curated links. |
| `GROQ_MODEL` | `scripts/draft-briefing.mjs` | Optional override of the default (`openai/gpt-oss-120b`). On a retired model id the drafter lists what your key can actually use. |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | `/contact` | Without it, submissions go nowhere. |
| `NEXT_PUBLIC_EDITOR_EMAIL` | `/contact` | Shows a direct "email us" block. Omitted entirely when unset. |
| `NEXT_PUBLIC_GA_ID` | all pages | GA4 measurement ID. No analytics is loaded when unset. |
| `NEXT_PUBLIC_SITE_URL` | build | Canonical origin. Defaults to `https://cybervani.com`. |

## The weekly pipeline

Fully automated. Nobody has to write anything for a briefing to publish.

`.github/workflows/draft-briefing.yml` runs every Saturday 07:00 IST and:

1. **Collects** the week's cyber security headlines from NewsData.io and NewsAPI.org.
2. **Reads each source article** (`scripts/lib/article-text.mjs`). This is the grounding step.
3. **Writes a take** via Groq, constrained to that article's text, and **matches the story to a guide**
   in the awareness library (`scripts/lib/enrich.mjs`).
4. **Validates** every take, then **builds the site** as a gate.
5. **Commits** to `main` and explicitly dispatches `deploy.yml`.

That last dispatch is deliberate: a push made with the default `GITHUB_TOKEN` does **not** trigger other
workflows, so without it the briefing would be committed every week and never published.

If every take fails — a retired model id, a dead key, no outbound network — the run fails before writing
anything, rather than quietly publishing a briefing of bare links. Losing a few takes is normal; losing all
of them means something is broken.

### Staying inside the Groq free tier

The free tier meters **tokens per minute** (8,000 on `on_demand`), and `max_tokens` counts against that
budget as *requested*, not as used. Three things keep the pipeline under it:

- Requests are spaced by `GROQ_PACING_MS` (default 15s), so ten stories drip through rather than burning the
  minute's budget in four.
- A 429 is retried up to four times, waiting for the delay Groq states in the error body.
- The article excerpt is capped at 2,000 characters — enough to ground a take, and the single biggest lever
  on tokens per request.

`gpt-oss` is a reasoning model and its reasoning is billed against `max_tokens`, so the ceiling is 1,024
rather than a few hundred; at 400 it ran out mid-JSON and the API rejected the response. `reasoning_effort`
is set to `low`, and dropped automatically for the rest of the run if a model rejects the parameter.

Run it by hand at any time:

```bash
npm run draft:briefing                      # next Saturday
npm run draft:briefing -- --date 2026-10-03 # a specific week
npm run draft:briefing -- --force           # overwrite an existing briefing
```

### Why the takes are trustworthy

A model asked "why does this matter" from a headline alone will invent rupee figures, victim counts and
dates. For a publication whose product is *being the reliable one about fraud*, one invented statistic does
more damage than a hundred missing takes. So:

- **Grounding** — the take is written from the fetched article text, never from the headline.
- **Constraint** — the prompt forbids introducing any fact, figure, name or date absent from the excerpt.
- **Validation** — `validateTake` rejects refusals, out-of-range lengths, and **any number that does not
  appear in the source text**. That last check is the one that matters; it is covered by tests.
- **Fail to silence** — a take that fails validation is dropped. The story still renders as a curated link.
  A bad week produces a thinner briefing, never a wrong one.

`npm test` covers the validator and the pipeline's failure modes (hallucinated figures, unknown guide ids,
unreadable sources, a Groq outage).

Some publishers block non-browser agents. We identify the bot honestly and accept the refusal rather than
spoofing a browser, so those stories publish without a take.

### The guide match

Alongside the take, each story is matched to one guide from the awareness library — or none. This is
classification rather than generation, so the hallucination surface is near zero, and it is the part of the
briefing no aggregator can reproduce: it routes readers into our own evergreen pages every week and builds
internal links to exactly the pages worth ranking.

`scripts/lib/guides.mjs` imports the library content directly (Node's type stripping erases its `import
type`), so there is no second copy of the guide list to drift.

### Disclosure

Briefings written this way carry `"generated": "ai-assisted"`, which renders a disclosure on the page
explaining that the notes are AI-written from the linked reporting, checked against it, and omitted where
they could not be verified.

### Why briefings are committed rather than fetched

The deploy publishes with `force_orphan: true`, which replaces the whole `gh-pages` branch every run. Anything
that cannot be regenerated from the repository disappears on the next deploy. The site used to fetch 18
articles at build time and render a page for each; every Saturday those 18 URLs were deleted and replaced, so
nothing ever accumulated in the index. Keeping briefings in `src/content/briefings/` means every build
reproduces the entire archive.

The render path no longer calls a news API at all. `scripts/draft-briefing.mjs` is the only code that does.

## Adding to the awareness library

1. Drop the artwork in `public/infographics/` or `public/comics/`.
2. Add an entry to `src/lib/library-en.ts` or `src/lib/library-hi.ts`.
3. **Transcribe the text that is inside the image** into `blocks`, and into `howTo` when the poster is a
   sequence of steps. This is the point of the exercise: an untranscribed poster is invisible to search engines
   and to screen readers.
4. Set `altLangSlug` on both entries when a topic exists in both languages — that generates the `hreflang` pair.

Everything else follows automatically: the topic page, `/gallery` or `/comics`, the sitemap, the RSS feed and
site search all read from `src/lib/library.ts`.

Image dimensions are generated into `src/lib/image-manifest.ts` by `npm run prebuild`, so new artwork gets
correct `width`/`height` without manual work.

## Project structure

```text
src/
├── app/
│   ├── awareness/[slug]/       English guides
│   ├── awareness/hi/[slug]/    Hindi guides
│   ├── briefing/               Archive index + /briefing/[date]
│   ├── feed.xml/               RSS
│   ├── gallery/  comics/       Library browse pages
│   ├── about/  contact/  sponsors/
│   ├── layout.tsx  page.tsx  not-found.tsx  sitemap.ts  robots.ts
├── components/
│   ├── library-article.tsx     Renders one guide
│   ├── library-grid.tsx        Card grid + lightbox
│   ├── navbar.tsx  footer.tsx  analytics.tsx  contact-form.tsx
├── content/briefings/          Committed weekly briefings
└── lib/
    ├── library.ts              Library entry point + helpers
    ├── library-en.ts  library-hi.ts  library-types.ts
    ├── library-seo.tsx         Metadata + JSON-LD
    ├── briefings.ts  search.ts  format.ts  site.ts
scripts/
├── draft-briefing.mjs      Weekly pipeline entry point
├── generate-image-manifest.mjs
└── lib/
    ├── article-text.mjs    Fetch + extract source article (grounding)
    ├── enrich.mjs          Groq take + guide match + validation
    ├── guides.mjs          Reads the awareness library
    └── *.test.mjs          Validator and pipeline tests
```

## Deployment

`.github/workflows/deploy.yml` runs on push to `main`: `npm ci`, lint, build, then publishes `out/` to
`gh-pages`. Set `NEXT_PUBLIC_SITE_URL=https://cybervani.com` so canonical URLs and assets resolve from the
domain root; `next.config.ts` otherwise derives a `basePath` from `GITHUB_REPOSITORY` for project-site
deployments.

## Custom domain checklist

- Add `cybervani.com` in the repository Pages settings.
- Point the apex domain at the current GitHub Pages A records.
- Optionally add `www` as a `CNAME` and redirect it to the apex domain.
- Wait for the TLS certificate, then confirm `https://cybervani.com` serves the exported site.
- Keep the repository custom-domain setting aligned with `public/CNAME`.
