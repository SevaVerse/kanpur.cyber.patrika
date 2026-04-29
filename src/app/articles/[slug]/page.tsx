import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPublishedDate, getAllArticles, getArticleBySlug } from "@/lib/news";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getAllArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.imageUrl],
      type: "article",
      publishedTime: article.publishedAt,
      url: `/articles/${article.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <article className="overflow-hidden rounded-4xl border border-border bg-surface-strong shadow-[0_30px_100px_-60px_rgba(15,23,42,0.55)]">
        <div className="relative aspect-16/8">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
          <div className="space-y-4 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">{article.category}</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-hero sm:text-5xl">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              <span>{article.sourceName}</span>
              <span>{article.author}</span>
              <span>{formatPublishedDate(article.publishedAt)}</span>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-700">{article.description}</p>
          </div>

          <div className="prose-copy max-w-none text-slate-800">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
            <Link href="/" className="text-sm font-bold uppercase tracking-[0.24em] text-muted transition hover:text-accent">
              Back to Homepage
            </Link>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-accent-dark"
            >
              Visit Original Source
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
