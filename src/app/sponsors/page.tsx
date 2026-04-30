import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Meet the sponsors and partners supporting Kanpur Cyber Patrika's mission to deliver reliable cyber security awareness to Uttar Pradesh and beyond.",
};

type Sponsor = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  bio: string;
  website?: string;
  contact?: string;
  /** Initials shown when no image is provided */
  initials: string;
  /** Tailwind bg class for the placeholder avatar */
  avatarBg: string;
};

const sponsors: Sponsor[] = [
  {
    id: "sponsor-1",
    name: "Your Organisation Name",
    category: "Platinum Sponsor",
    tagline: "Empowering cyber-safe communities across India.",
    bio: "This is a placeholder for a platinum-level sponsor. Replace this text with the sponsor's full bio, history, and impact statement. Sponsor images can be added to the public/ directory and referenced here.",
    website: "https://example.com",
    initials: "YO",
    avatarBg: "bg-[#b42318]",
  },
  {
    id: "sponsor-2",
    name: "Partner Organisation",
    category: "Gold Sponsor",
    tagline: "Securing digital infrastructure for a safer tomorrow.",
    bio: "This is a placeholder for a gold-level sponsor. Add the organisation's logo to public/sponsors/ and update the imageSrc field to display it here.",
    website: "https://example.com",
    initials: "PO",
    avatarBg: "bg-[#b45309]",
  },
  {
    id: "sponsor-3",
    name: "Community Partner",
    category: "Silver Sponsor",
    tagline: "Building awareness, one reader at a time.",
    bio: "This is a placeholder for a silver-level sponsor or community partner. Contact the editorial desk to discuss sponsorship tiers and publication benefits.",
    contact: "editor@example.com",
    initials: "CP",
    avatarBg: "bg-[#1e40af]",
  },
];

const tierOrder = ["Platinum Sponsor", "Gold Sponsor", "Silver Sponsor", "Community Partner"];

const tierStyle: Record<string, { badge: string; card: string }> = {
  "Platinum Sponsor": {
    badge: "bg-[rgba(180,35,24,0.1)] text-[#b42318]",
    card: "border-[#b42318]/25 shadow-[0_20px_60px_-35px_rgba(180,35,24,0.25)]",
  },
  "Gold Sponsor": {
    badge: "bg-[rgba(180,83,9,0.1)] text-[#b45309]",
    card: "border-[#b45309]/25 shadow-[0_20px_60px_-35px_rgba(180,83,9,0.2)]",
  },
  "Silver Sponsor": {
    badge: "bg-[rgba(30,64,175,0.1)] text-[#1e40af]",
    card: "border-[#1e40af]/20 shadow-[0_20px_60px_-35px_rgba(30,64,175,0.15)]",
  },
  "Community Partner": {
    badge: "bg-[rgba(15,23,42,0.07)] text-slate-600",
    card: "border-border shadow-[0_20px_60px_-35px_rgba(15,23,42,0.2)]",
  },
};

function defaultStyle(category: string) {
  return (
    tierStyle[category] ?? {
      badge: "bg-[rgba(15,23,42,0.07)] text-slate-600",
      card: "border-border shadow-[0_20px_60px_-35px_rgba(15,23,42,0.2)]",
    }
  );
}

const grouped = tierOrder.reduce<Record<string, Sponsor[]>>((acc, tier) => {
  const inTier = sponsors.filter((s) => s.category === tier);
  if (inTier.length > 0) acc[tier] = inTier;
  return acc;
}, {});

export default function SponsorsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Hero */}
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Our Supporters</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
          Sponsors &amp; Partners backing cyber awareness in Uttar Pradesh.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Kanpur Cyber Patrika is an editorially independent publication. These organisations share our commitment to
          making cyber security knowledge accessible to every reader.
        </p>
      </section>

      {/* Sponsor tiers */}
      {Object.entries(grouped).map(([tier, tierSponsors]) => (
        <section key={tier} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent">{tier}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tierSponsors.map((sponsor) => {
              const style = defaultStyle(sponsor.category);
              return (
                <article
                  key={sponsor.id}
                  className={`flex flex-col rounded-4xl border bg-surface p-6 ${style.card}`}
                >
                  {/* Avatar / logo */}
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-black text-white ${sponsor.avatarBg}`}
                    aria-label={`${sponsor.name} logo placeholder`}
                  >
                    {sponsor.initials}
                  </div>

                  {/* Badge */}
                  <span
                    className={`mt-4 inline-block self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${style.badge}`}
                  >
                    {sponsor.category}
                  </span>

                  <h3 className="mt-3 text-xl font-black text-hero">{sponsor.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-accent">{sponsor.tagline}</p>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">{sponsor.bio}</p>

                  {/* Links */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                      >
                        Website ↗
                      </a>
                    )}
                    {sponsor.contact && (
                      <a
                        href={`mailto:${sponsor.contact}`}
                        className="rounded-xl border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                      >
                        Contact
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {/* Become a sponsor CTA */}
      <section className="rounded-4xl border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-accent">Partner With Us</p>
        <h2 className="mt-3 text-3xl font-black text-hero">Interested in sponsoring Kanpur Cyber Patrika?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          We offer editorial partnerships and sponsorship opportunities for organisations that want to reach an engaged
          audience of cyber-aware readers across Uttar Pradesh and India. Reach out via the Contact page to discuss
          available tiers.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-2xl bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Get In Touch
        </a>
      </section>
    </div>
  );
}
