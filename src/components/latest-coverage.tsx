"use client";

import { useMemo, useState } from "react";

import { NewsCard } from "@/components/news-card";
import type { Article, ArticleCategory } from "@/lib/types";

type LatestCoverageProps = {
  articles: Article[];
};

const ALL_CATEGORIES = "All";

export function LatestCoverage({ articles }: LatestCoverageProps) {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(articles.map((article) => article.category)));
    return [ALL_CATEGORIES, ...uniqueCategories] as Array<ArticleCategory | typeof ALL_CATEGORIES>;
  }, [articles]);

  const visibleArticles = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) {
      return articles;
    }

    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Latest Coverage</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-hero">Recent cyber security articles</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] transition ${
                  isActive
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface-strong text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {visibleArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article, index) => (
            <NewsCard key={article.id} article={article} priority={index < 2} />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-dashed border-border bg-surface-strong px-6 py-10 text-center">
          <p className="text-lg font-black text-hero">No stories in this desk right now.</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Switch filters to explore other cyber security desks from the current build.
          </p>
        </div>
      )}
    </div>
  );
}