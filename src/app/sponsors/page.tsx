import type { Metadata } from "next";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Meet the sponsors and partners supporting Cyber Vani's mission to deliver reliable cyber security awareness to Uttar Pradesh and beyond.",
  alternates: { canonical: "sponsors/" },
  openGraph: {
    title: "Sponsors | Cyber Vani",
    description:
      "Meet the sponsors and partners supporting Cyber Vani's mission to deliver reliable cyber security awareness to Uttar Pradesh and beyond.",
    siteName: "Cyber Vani",
    locale: "en_US",
    type: "website",
    url: "sponsors/",
    images: [{ url: logoPath, alt: "Cyber Vani logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors | Cyber Vani",
    description:
      "Meet the sponsors and partners supporting Cyber Vani's mission to deliver reliable cyber security awareness to Uttar Pradesh and beyond.",
    images: [logoPath],
  },
};

type Sponsor = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  bio: string;
  website?: string;
  contact?: string;
  /** Optional photo/logo from public/ */
  imageSrc?: string;
  /** Initials shown when no image is provided */
  initials: string;
  /** Tailwind bg class for the placeholder avatar */
  avatarBg: string;
};

const sponsors: Sponsor[] = [
  {
    id: "sponsor-4",
    name: "Mr. Ved Ashish",
    category: "Gold Sponsor",
    tagline: "Director, Katyayani Telecom Services Pvt. Ltd. — connecting communities through technology, spirituality, and creative enterprise.",
    bio: "Starting his entrepreneurial journey at just 20, Mr. Ved Ashish — Director of Katyayani Telecom Services Pvt. Ltd. — has built a globally recognised presence spanning Spirituality, Social Work, and Hindi Film Entertainment production. His diverse ventures reflect a rare blend of technological acumen and cultural commitment, driven by a belief that meaningful enterprise must serve both commerce and community. Mr. Ved Ashish is proud to support Cyber Vani's mission of making cyber safety knowledge accessible to every citizen across India.",
    imageSrc: `${basePath}/Sponser-1.jpeg`,
    initials: "KT",
    avatarBg: "bg-[#b45309]",
  },
];

const featuredSponsors = sponsors.filter((s) => !!s.imageSrc);
const supportSponsors = sponsors.filter((s) => !s.imageSrc);

export default function SponsorsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Hero */}
      <section className="overflow-hidden rounded-panel border border-border bg-hero px-6 py-8 text-white shadow-panel sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-hero text-hero-accent">Our Supporters</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          Sponsors &amp; Partners backing cyber awareness in Uttar Pradesh.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Cyber Vani is an editorially independent publication. These organisations share our commitment to
          making cyber security knowledge accessible to every reader.
        </p>
      </section>

      {/* Featured sponsors — portrait image + bio layout */}
      {featuredSponsors.length > 0 && (
        <section className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-hero text-accent">Our Sponsors</p>
          {featuredSponsors.map((sponsor) => (
            <div key={sponsor.id} className="grid gap-6 md:grid-cols-[260px_1fr]">
              {/* Portrait image */}
              <div className="mx-auto w-full max-w-65 overflow-hidden rounded-card border border-border bg-surface-strong shadow-card md:mx-0">
                <div className="relative h-81.25 w-full">
                  <Image
                    src={sponsor.imageSrc!}
                    alt={sponsor.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 260px"
                  />
                </div>
              </div>

              {/* Bio card */}
              <article className="rounded-card border border-border bg-surface-strong p-8 shadow-card">
                <h3 className="text-3xl font-bold text-hero">{sponsor.name}</h3>
                <p className="mt-2 text-base font-semibold text-accent">{sponsor.tagline}</p>
                <p className="mt-4 text-base leading-8 text-slate-700">{sponsor.bio}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-control border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                    >
                      Website ↗
                    </a>
                  )}
                  {sponsor.contact && (
                    <a
                      href={`mailto:${sponsor.contact}`}
                      className="rounded-control border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </article>
            </div>
          ))}
        </section>
      )}

      {/* Support sponsors — compact cards without image */}
      {supportSponsors.length > 0 && (
        <section className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-hero text-accent">Partners &amp; Supporters</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportSponsors.map((sponsor) => (
              <article
                key={sponsor.id}
                className="flex flex-col rounded-panel border border-border bg-surface p-6 shadow-card"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-card text-2xl font-bold text-white ${sponsor.avatarBg}`}
                  aria-label={`${sponsor.name} logo placeholder`}
                >
                  {sponsor.initials}
                </div>
                <h3 className="mt-5 text-xl font-bold text-hero">{sponsor.name}</h3>
                <p className="mt-1 text-sm font-semibold text-accent">{sponsor.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">{sponsor.bio}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-control border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                    >
                      Website ↗
                    </a>
                  )}
                  {sponsor.contact && (
                    <a
                      href={`mailto:${sponsor.contact}`}
                      className="rounded-control border border-border bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-widest text-hero transition hover:border-accent hover:text-accent"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Become a sponsor CTA */}
      <section className="rounded-panel border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-hero text-accent">Partner With Us</p>
        <h2 className="mt-3 text-3xl font-bold text-hero">Interested in sponsoring Cyber Vani?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          We offer editorial partnerships and sponsorship opportunities for organisations that want to reach an engaged
          audience of cyber-aware readers across Uttar Pradesh and India. Reach out via the Contact page to discuss
          available tiers.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-card bg-hero px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow transition hover:opacity-90"
        >
          Get In Touch
        </a>
      </section>
    </div>
  );
}
