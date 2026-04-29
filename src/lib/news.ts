import { fallbackArticles } from "@/lib/fallback-articles";
import type { Article, ArticleCategory } from "@/lib/types";
import { cache } from "react";

type NewsDataArticle = {
  article_id?: string;
  title?: string;
  description?: string;
  content?: string;
  image_url?: string;
  pubDate?: string;
  source_name?: string;
  source_url?: string;
  creator?: string[];
  category?: string[];
  keywords?: string[];
};

type NewsDataResponse = {
  status?: string;
  results?: NewsDataArticle[];
  message?: string;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80";
const API_URL = "https://newsdata.io/api/1/latest";
const QUERY = "cybersecurity";
const COUNTRY = "in";
const LANGUAGE = "en";
const MAX_ARTICLES = 18;
const CYBER_KEYWORDS = [
  "cyber",
  "cybersecurity",
  "ransomware",
  "malware",
  "phishing",
  "breach",
  "zero-day",
  "zero day",
  "vulnerability",
  "infosec",
  "hacker",
  "threat",
  "security",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function splitContent(rawContent: string, description: string) {
  const normalized = rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const sourceText = normalized || description;

  return sourceText
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function categorize(article: NewsDataArticle): ArticleCategory {
  const haystack = [
    article.title,
    article.description,
    article.content,
    ...(article.category ?? []),
    ...(article.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes("breach") || haystack.includes("leak")) {
    return "Data Breach";
  }

  if (haystack.includes("malware") || haystack.includes("ransomware")) {
    return "Malware";
  }

  if (haystack.includes("cloud") || haystack.includes("identity") || haystack.includes("saas")) {
    return "Cloud Security";
  }

  if (haystack.includes("law") || haystack.includes("policy") || haystack.includes("compliance")) {
    return "Policy";
  }

  if (haystack.includes("apt") || haystack.includes("campaign") || haystack.includes("threat")) {
    return "Threat Intelligence";
  }

  return "Industry";
}

function buildSourceUrl(article: NewsDataArticle) {
  return article.source_url?.trim() || "https://newsdata.io/";
}

function isCyberRelevant(article: NewsDataArticle) {
  const haystack = [
    article.title,
    article.description,
    article.content,
    ...(article.keywords ?? []),
    ...(article.category ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return CYBER_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function mapArticle(article: NewsDataArticle, index: number): Article | null {
  const title = article.title?.trim();

  if (!title) {
    return null;
  }

  const description = article.description?.trim() || "Coverage summary unavailable from the upstream feed.";
  const content = splitContent(article.content?.trim() || "", description);
  const sourceUrl = buildSourceUrl(article);
  const publishedAt = article.pubDate || new Date().toISOString();
  const category = index === 0 ? "Top Story" : categorize(article);
  const keywords = article.keywords?.filter(Boolean).slice(0, 6) || [];

  return {
    id: article.article_id || `${slugify(title)}-${index}`,
    slug: slugify(title),
    title,
    description,
    content: content.length > 0 ? content : [description],
    imageUrl: article.image_url?.trim() || DEFAULT_IMAGE,
    publishedAt,
    sourceName: article.source_name?.trim() || "NewsData.io",
    sourceUrl,
    author: article.creator?.filter(Boolean).join(", ") || "Staff Reporter",
    category,
    keywords,
    featured: index === 0,
    trendingScore: Math.max(50, 100 - index * 4),
  };
}

async function fetchFromNewsData(): Promise<Article[]> {
  const apiKey = process.env.NEWSDATA_API_KEY || process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.warn("Missing NEWSDATA_API_KEY. Falling back to static editorial content.");
    return fallbackArticles;
  }

  const requestUrl = new URL(API_URL);
  requestUrl.searchParams.set("apikey", apiKey);
  requestUrl.searchParams.set("q", QUERY);
  requestUrl.searchParams.set("language", LANGUAGE);
  requestUrl.searchParams.set("country", COUNTRY);
  requestUrl.searchParams.set("category", "technology");

  const response = await fetch(requestUrl.toString(), {
    next: { revalidate: false },
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 429) {
    console.warn("News API rate limit reached. Using fallback editorial content.");
    return fallbackArticles;
  }

  if (!response.ok) {
    throw new Error(`News API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as NewsDataResponse;
  const mappedArticles = (payload.results || [])
    .filter((article) => isCyberRelevant(article))
    .map((article, index) => mapArticle(article, index))
    .filter((article): article is Article => article !== null)
    .filter((article, index, articles) => articles.findIndex((item) => item.slug === article.slug) === index)
    .slice(0, MAX_ARTICLES);

  if (mappedArticles.length === 0) {
    console.warn(payload.message || "News API returned no results. Using fallback editorial content.");
    return fallbackArticles;
  }

  return mappedArticles;
}

export const getAllArticles = cache(async () => {
  try {
    return await fetchFromNewsData();
  } catch (error) {
    console.error("Failed to fetch news feed.", error);
    return fallbackArticles;
  }
});

export async function getFeaturedArticle() {
  const articles = await getAllArticles();
  return articles[0] ?? null;
}

export async function getArticleBySlug(slug: string) {
  const articles = await getAllArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getTrendingArticles(limit = 5) {
  const articles = await getAllArticles();
  return [...articles].sort((left, right) => right.trendingScore - left.trendingScore).slice(0, limit);
}

export async function getCategoryGroups() {
  const articles = await getAllArticles();
  const grouped = new Map<ArticleCategory, Article[]>();

  for (const article of articles.filter((item) => !item.featured)) {
    const existing = grouped.get(article.category) || [];
    grouped.set(article.category, [...existing, article]);
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      items: items.slice(0, 4),
    }))
    .slice(0, 3);
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
