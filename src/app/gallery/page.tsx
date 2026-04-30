import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infographics Gallery",
  description:
    "Visual infographics on cyber security topics — phishing, ransomware, safe browsing, and digital hygiene — published by Kanpur Cyber Patrika.",
};

type Infographic = {
  id: string;
  title: string;
  description: string;
  category: string;
  /** Path relative to basePath, e.g. /infographics/phishing-guide.png */
  imageSrc?: string;
  publishedAt: string;
  tags: string[];
};

const infographics: Infographic[] = [
  {
    id: "ig-001",
    title: "How Phishing Attacks Work",
    description:
      "A step-by-step visual breakdown of a phishing campaign — from the lure email to credential harvest and account takeover.",
    category: "Phishing",
    publishedAt: "2026-04-01",
    tags: ["phishing", "email", "credential theft"],
  },
  {
    id: "ig-002",
    title: "Ransomware Kill Chain",
    description:
      "Illustrates the seven stages of a ransomware attack: initial access, persistence, lateral movement, data exfiltration, encryption, and ransom demand.",
    category: "Ransomware",
    publishedAt: "2026-04-08",
    tags: ["ransomware", "kill chain", "malware"],
  },
  {
    id: "ig-003",
    title: "10 Rules of Digital Hygiene",
    description:
      "Quick-reference poster covering password managers, MFA, software updates, public Wi-Fi risks, and secure backup practices.",
    category: "Awareness",
    publishedAt: "2026-04-15",
    tags: ["awareness", "passwords", "MFA", "updates"],
  },
  {
    id: "ig-004",
    title: "Social Engineering Red Flags",
    description:
      "Visual guide to recognising social engineering tactics: urgency cues, impersonation, pretexting, and baiting in everyday digital interactions.",
    category: "Social Engineering",
    publishedAt: "2026-04-22",
    tags: ["social engineering", "awareness", "impersonation"],
  },
  {
    id: "ig-005",
    title: "India Cyber Crime Report 2025",
    description:
      "Key statistics from India's 2025 cyber crime landscape — sector-wise losses, top attack vectors, and state-level incident counts.",
    category: "Statistics",
    publishedAt: "2026-04-29",
    tags: ["statistics", "India", "cyber crime"],
  },
  {
    id: "ig-006",
    title: "Secure Your UPI Transactions",
    description:
      "Common UPI fraud patterns in India — fake collect requests, SIM swap, screen-share scams — and how to avoid them.",
    category: "Financial Security",
    publishedAt: "2026-04-29",
    tags: ["UPI", "fraud", "financial security"],
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Phishing: {
    bg: "bg-[rgba(220,38,38,0.07)]",
    text: "text-[#b91c1c]",
    border: "border-[#b91c1c]/20",
    icon: "🎣",
  },
  Ransomware: {
    bg: "bg-[rgba(180,35,24,0.07)]",
    text: "text-[#b42318]",
    border: "border-[#b42318]/20",
    icon: "🔒",
  },
  Awareness: {
    bg: "bg-[rgba(21,128,61,0.07)]",
    text: "text-[#15803d]",
    border: "border-[#15803d]/20",
    icon: "💡",
  },
  "Social Engineering": {
    bg: "bg-[rgba(124,58,237,0.07)]",
    text: "text-[#7c3aed]",
    border: "border-[#7c3aed]/20",
    icon: "🎭",
  },
  Statistics: {
    bg: "bg-[rgba(30,64,175,0.07)]",
    text: "text-[#1e40af]",
    border: "border-[#1e40af]/20",
    icon: "📊",
  },
  "Financial Security": {
    bg: "bg-[rgba(180,83,9,0.07)]",
    text: "text-[#b45309]",
    border: "border-[#b45309]/20",
    icon: "💳",
  },
};

function categoryStyle(cat: string) {
  return (
    categoryColors[cat] ?? {
      bg: "bg-[rgba(15,23,42,0.05)]",
      text: "text-slate-600",
      border: "border-slate-200",
      icon: "🖼",
    }
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Hero */}
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Visual Resources</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
          Infographics Gallery — cyber security made visual.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Download and share these free infographics to spread cyber awareness in your organisation, school, or
          community. New graphics are added with every weekly edition.
        </p>
      </section>

      {/* Grid */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {infographics.map((item) => {
            const style = categoryStyle(item.category);
            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_16px_50px_-35px_rgba(15,23,42,0.3)] transition hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)]"
              >
                {/* Image area */}
                <div
                  className={`flex aspect-[16/9] items-center justify-center ${style.bg} border-b ${style.border}`}
                >
                  {item.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <span className="text-5xl" role="img" aria-label={item.category}>
                        {style.icon}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
                        Infographic Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${style.bg} ${style.text}`}
                    >
                      {item.category}
                    </span>
                    <time className="text-xs text-muted" dateTime={item.publishedAt}>
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>

                  <h2 className="mt-3 text-lg font-black leading-snug text-hero group-hover:text-accent transition">
                    {item.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-slate-700">{item.description}</p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border bg-surface-strong px-2 py-0.5 text-[11px] font-semibold text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Download placeholder */}
                  {item.imageSrc && (
                    <a
                      href={item.imageSrc}
                      download
                      className="mt-5 inline-block rounded-xl border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                    >
                      Download ↓
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Submission CTA */}
      <section className="rounded-4xl border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Contribute</p>
        <h2 className="mt-3 text-3xl font-black text-hero">Have an infographic to share?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          We welcome submissions from security researchers, educators, and organisations. Send your infographic along
          with a short description and your attribution details to the editorial desk.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-2xl bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Submit Infographic
        </a>
      </section>
    </div>
  );
}
