import type { Article } from "@/lib/types";

export const fallbackArticles: Article[] = [
  {
    id: "fallback-zero-day-roundup",
    slug: "zero-day-roundup-enterprise-teams-prepare-weekly-risks",
    title: "Zero-Day Roundup Helps Enterprise Teams Prioritize the Week's Critical Risks",
    description:
      "A static fallback briefing keeps the homepage populated when the upstream news feed is unavailable during scheduled builds.",
    content: [
      "Cybersecurity desks need dependable publishing pipelines, even when upstream APIs time out or rate-limit. This fallback article ensures the site still renders a coherent front page while the next scheduled build retries the live feed.",
      "Replace fallback content over time with archived snapshots if you need a richer continuity strategy. For the initial GitHub Pages phase, a graceful empty or fallback state is preferable to a failed build and broken deployment.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-04-28T00:00:00.000Z",
    sourceName: "Editorial Desk",
    sourceUrl: "https://example.com/editorial-desk",
    author: "Kanpur Cyber Patrika",
    category: "Top Story",
    keywords: ["cybersecurity", "fallback", "automation"],
    featured: true,
    trendingScore: 98,
  },
  {
    id: "fallback-cloud-exposure-watch",
    slug: "cloud-exposure-watch-shared-responsibility-gaps",
    title: "Cloud Exposure Watch Tracks Shared Responsibility Gaps Across Hybrid Fleets",
    description:
      "Security teams are leaning on posture reviews and identity controls as attack chains increasingly pivot through misconfigured cloud workloads.",
    content: [
      "Hybrid estates continue to blur operational boundaries. Editorial summaries focused on cloud exposure, identity hardening, and patch orchestration give readers a compact view of what matters when source feeds are delayed.",
      "This placeholder article should be replaced automatically once the API resumes returning a healthy result set during the next scheduled build.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-04-27T00:00:00.000Z",
    sourceName: "Research Desk",
    sourceUrl: "https://example.com/research-desk",
    author: "Kanpur Cyber Patrika",
    category: "Cloud Security",
    keywords: ["cloud", "identity", "misconfiguration"],
    featured: false,
    trendingScore: 82,
  },
];
