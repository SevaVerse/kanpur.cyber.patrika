import type { Metadata } from "next";
import Link from "next/link";

import { LatestCoverage } from "@/components/latest-coverage";
import { getAllArticles, getCategoryGroups, getFeaturedArticle, getTrendingArticles } from "@/lib/news";

export const metadata: Metadata = {
  alternates: { canonical: "" },
};

export default async function HomePage() {
  const [featuredArticle, articles, categoryGroups, trendingArticles] = await Promise.all([
    getFeaturedArticle(),
    getAllArticles(),
    getCategoryGroups(),
    getTrendingArticles(),
  ]);

  const latestArticles = articles.filter((article) => !article.featured).slice(0, 6);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="animate-rise-in overflow-hidden rounded-4xl border border-white/10 bg-hero text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.85)]">
        <div className="grid gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1.45fr_0.75fr] lg:px-12 lg:py-12">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Weekly Static Dispatch</p>
              <h1 className="max-w-4xl text-4xl font-black uppercase leading-none sm:text-5xl lg:text-6xl">
                Cyber security intelligence curated for a dependable weekly publish cycle.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Built for static delivery, automated with GitHub Actions, and optimized for GitHub Pages. Every Saturday build refreshes the briefing with the latest cyber security coverage.
              </p>
            </div>
            {featuredArticle ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-hero-accent">Top Story</p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{featuredArticle.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                  <span>{featuredArticle.sourceName}</span>
                  <span>{featuredArticle.category}</span>
                  <Link href={`/articles/${featuredArticle.slug}`} className="rounded-full bg-white px-5 py-3 text-hero transition hover:bg-hero-accent">
                    Read Full Story
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
                No articles were available during the last scheduled fetch.
              </div>
            )}
          </div>

          <aside className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Trending</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-hero-accent">Live at Build</span>
            </div>
            <div className="space-y-4">
              {trendingArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block rounded-2xl border border-white/10 px-4 py-4 transition hover:border-hero-accent hover:bg-white/8"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-black text-hero-accent/85">0{index + 1}</span>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{article.category}</p>
                      <h3 className="text-base font-bold leading-6 text-white">{article.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <LatestCoverage articles={latestArticles} />

        <aside className="rounded-4xl border border-border bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Dispatch Notes</p>
            <h2 className="text-2xl font-black text-hero">What this build does</h2>
            <p className="text-sm leading-7 text-slate-700">
              The site fetches cyber security coverage at build time, pre-renders all article routes, and exports a static out directory for GitHub Pages deployment.
            </p>
          </div>
          <dl className="mt-8 space-y-4 text-sm text-slate-700">
            <div className="rounded-2xl border border-border bg-surface-strong p-4">
              <dt className="font-bold uppercase tracking-[0.22em] text-muted">Build Mode</dt>
              <dd className="mt-2 text-base font-semibold text-hero">Static Site Generation</dd>
            </div>
            <div className="rounded-2xl border border-border bg-surface-strong p-4">
              <dt className="font-bold uppercase tracking-[0.22em] text-muted">Automation</dt>
              <dd className="mt-2 text-base font-semibold text-hero">Saturday 00:00 UTC GitHub Action</dd>
            </div>
            <div className="rounded-2xl border border-border bg-surface-strong p-4">
              <dt className="font-bold uppercase tracking-[0.22em] text-muted">Fallback</dt>
              <dd className="mt-2 text-base font-semibold text-hero">Graceful editorial content on API errors</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Category Watch</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-hero">Coverage by newsroom desk</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {categoryGroups.map((group) => (
            <section key={group.category} className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xl font-black text-hero">{group.category}</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Desk</span>
              </div>
              <div className="mt-5 space-y-5">
                {group.items.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="block space-y-2 rounded-2xl transition hover:text-accent">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">{article.sourceName}</p>
                    <h4 className="line-clamp-2 text-base font-bold leading-6 text-hero">{article.title}</h4>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-700">{article.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
