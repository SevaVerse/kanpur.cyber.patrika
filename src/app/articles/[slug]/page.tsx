import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPublishedDate, getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/news";
import { getSiteUrl } from "@/lib/site";

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

  const siteUrl = getSiteUrl();
  const articleUrl = new URL(`articles/${article.slug}/`, siteUrl).toString();

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    alternates: { canonical: articleUrl },
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.imageUrl],
      type: "article",
      publishedTime: article.publishedAt,
      url: articleUrl,
      siteName: "Cyber Vani",
      locale: "en_US",
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
  const [article, relatedArticles] = await Promise.all([
    getArticleBySlug(slug),
    getRelatedArticles(slug),
  ]);

  if (!article) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const articleUrl = new URL(`articles/${article.slug}/`, siteUrl).toString();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
      { "@type": "ListItem", position: 2, name: article.title, item: articleUrl },
    ],
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Cyber Vani",
      logo: {
        "@type": "ImageObject",
        url: new URL("Site_logo.jpeg", siteUrl).toString(),
      },
    },
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    keywords: article.keywords.join(", "),
    articleSection: article.category,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
        }}
      />
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
              <span>{article.readingTimeMinutes} min read</span>
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

          {relatedArticles.length > 0 && (
            <section className="space-y-5 border-t border-border pt-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Continue Reading</p>
                  <h2 className="mt-2 text-2xl font-black text-hero">Related stories from this briefing</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/articles/${relatedArticle.slug}`}
                    className="rounded-3xl border border-border bg-surface px-5 py-5 transition hover:border-accent hover:bg-surface-strong"
                  >
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-muted">
                      {relatedArticle.category} · {relatedArticle.readingTimeMinutes} min read
                    </p>
                    <h3 className="mt-3 text-lg font-black leading-snug text-hero">{relatedArticle.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">{relatedArticle.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

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
