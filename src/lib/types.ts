export type ArticleCategory =
  | "Top Story"
  | "Threat Intelligence"
  | "Data Breach"
  | "Policy"
  | "Malware"
  | "Cloud Security"
  | "Industry";

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string[];
  readingTimeMinutes: number;
  imageUrl: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  author: string;
  category: ArticleCategory;
  keywords: string[];
  featured: boolean;
  trendingScore: number;
}
