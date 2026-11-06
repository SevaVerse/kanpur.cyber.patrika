# Contributor notes for AI coding assistants

Cyber Vani is a static Next.js (App Router, `output: "export"`) site deployed to GitHub Pages.
Read `README.md` first — it explains the weekly briefing pipeline and why it is built the way it is.

## Ground rules

- **Static export only.** No API routes, server actions, middleware or runtime data fetching. Every
  page must be reproducible from the repository at build time.
- **Briefings are committed content** in `src/content/briefings/`. The render path never calls a news API;
  `scripts/draft-briefing.mjs` is the only code that does.
- **Third-party text is untrusted.** Headlines, URLs and article excerpts come from external APIs. Render them
  through React (never `dangerouslySetInnerHTML`), and emit structured data only via `JsonLd` in
  `src/lib/json-ld.tsx`, which escapes `<`.
- **AI takes must stay grounded.** Any change to `scripts/lib/enrich.mjs` needs tests in
  `scripts/lib/enrich.test.mjs`. A take must never introduce a number absent from the source, or any phone
  number, URL, email or UPI handle.
- **The awareness library** (`src/lib/library-en.ts`, `library-hi.ts`) is the single source of truth for
  guide pages, galleries, sitemap, RSS and search. `scripts/lib/content.test.mjs` checks its integrity.

## Before you finish

```bash
npm run lint && npm test && npm run build
```
