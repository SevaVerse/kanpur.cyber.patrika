import Image from "next/image";
import Link from "next/link";

import { formatPublishedDate } from "@/lib/news";
import type { Article } from "@/lib/types";

type NewsCardProps = {
  article: Article;
  priority?: boolean;
};

export function NewsCard({ article, priority = false }: NewsCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface-strong shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_-46px_rgba(15,23,42,0.52)]">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-muted">
          <span>{article.category}</span>
          <span>{formatPublishedDate(article.publishedAt)}</span>
        </div>
        <div className="space-y-3">
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-hero">
            <Link href={`/articles/${article.slug}`} className="transition hover:text-accent">
              {article.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-700">{article.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          <span>{article.sourceName}</span>
          <Link href={`/articles/${article.slug}`} className="text-accent transition hover:text-accent-dark">
            Read Story
          </Link>
        </div>
      </div>
    </article>
  );
}
