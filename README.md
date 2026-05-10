# Cyber Vani

A static cyber security news site built with Next.js App Router, TypeScript, and Tailwind CSS. The site fetches cybersecurity headlines during the build, pre-renders article routes, and deploys the exported `out` directory to GitHub Pages on a weekly GitHub Actions schedule.

Production domain: `https://cybervani.com/`

## Stack

- Next.js App Router with static export
- TypeScript
- Tailwind CSS
- GitHub Pages deployment
- GitHub Actions scheduled build
- NewsData.io-compatible API integration
- Formspree-compatible contact form

## Directory Structure

```text
.
|-- .github/
|   |-- copilot-instructions.md
|   `-- workflows/
|       `-- deploy.yml
|-- src/
|   |-- app/
|   |   |-- articles/
|   |   |   `-- [slug]/page.tsx
|   |   |-- contact/page.tsx
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   |-- not-found.tsx
|   |   `-- page.tsx
|   |-- components/
|   |   |-- contact-form.tsx
|   |   |-- navbar.tsx
|   |   `-- news-card.tsx
|   `-- lib/
|       |-- fallback-articles.ts
|       |-- news.ts
|       `-- types.ts
|-- .env.example
|-- eslint.config.mjs
|-- next.config.ts
|-- package.json
|-- postcss.config.mjs
|-- tsconfig.json
`-- README.md
```

## Essential Packages

- `next`, `react`, `react-dom`
- `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `eslint`, `eslint-config-next`, `@eslint/eslintrc`

## Environment Variables

Create a local `.env.local` or repository secrets with:

```bash
NEWSDATA_API_KEY=your_newsdata_api_key
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
NEXT_PUBLIC_SITE_URL=https://cybervani.com
```

## News Data Layer

The news integration lives in `src/lib/news.ts` and:

- Fetches cybersecurity coverage from NewsData.io during the build.
- Maps provider data into a normalized `Article` interface.
- Falls back to a static editorial dataset when the API key is missing, the provider rate-limits the request, or no results are returned.
- Provides helpers for featured, trending, grouped, and per-slug article queries.

## Static Generation

- The homepage is generated from build-time API data.
- `generateStaticParams` in `src/app/articles/[slug]/page.tsx` pre-renders all article pages.
- Metadata is generated per article for SEO and social previews.

## Deployment Workflow

The GitHub Actions workflow in `.github/workflows/deploy.yml`:

- Runs every Saturday at `00:00 UTC`
- Supports manual runs with `workflow_dispatch`
- Installs dependencies with `npm ci`
- Builds the static export with `npm run build`
- Deploys the `out` directory to the `gh-pages` branch

## Local Development

```bash
npm install
npm run dev
```

## GitHub Pages Notes

- `next.config.ts` derives `basePath` and `assetPrefix` automatically from `GITHUB_REPOSITORY` for project-site deployments.
- Set `NEXT_PUBLIC_SITE_URL=https://cybervani.com` for custom-domain builds so exported asset paths resolve from the domain root.
- `output: "export"` writes a static site into `out/`.
- The site now defaults metadata and canonical URLs to `https://cybervani.com/`.
- Add the DNS records required by your host and GitHub Pages, then keep the repository custom-domain setting aligned with `public/CNAME`.

## Custom Domain Checklist

- Add `cybervani.com` in the repository Pages settings.
- Point your apex domain DNS to GitHub Pages using the current GitHub A records.
- Optionally add `www` as a `CNAME` pointing to your GitHub Pages host and configure a redirect to the apex domain.
- Wait for GitHub to issue the TLS certificate, then verify that `https://cybervani.com` loads the exported site.
