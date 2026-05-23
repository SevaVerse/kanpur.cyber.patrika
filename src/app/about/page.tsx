import type { Metadata } from "next";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/Site_logo.jpeg`;

const teamMembers = [
  {
    name: "Nitin Srivastava",
    role: "Founder",
    bio:
      "Leads Cyber Vani with a focus on cyber awareness, practical reporting, and making security news accessible to everyday readers across India. He holds a PGDM (IT) from Symbiosis Pune and a software quality assurance certification from Pune.",
    imageSrc: `${basePath}/founder-pic.jpeg`,
  },
  {
    name: "Vishal Srivastava",
    role: "Team Member",
    bio:
      "Advocate Vishal Srivastava has been practicing and handling cases independently with a result-oriented approach, both professionally and ethically, and has acquired many years of professional experience in providing legal consultancy and advisory services. He is a member of the Lucknow Bar Association and the Central Bar Association.",
    imageSrc: `${basePath}/Team_mate_1.jpeg`,
  },
];

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Cyber Vani, its editorial mission, the cyber helpline, and the founding team behind the publication.",
  alternates: { canonical: "about/" },
  openGraph: {
    title: "About Us | Cyber Vani",
    description:
      "Learn about Cyber Vani, its editorial mission, the cyber helpline, and the founding team behind the publication.",
    siteName: "Cyber Vani",
    locale: "en_US",
    type: "website",
    url: "about/",
    images: [{ url: logoPath, alt: "Cyber Vani logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Cyber Vani",
    description:
      "Learn about Cyber Vani, its editorial mission, the cyber helpline, and the founding team behind the publication.",
    images: [logoPath],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">About The Publication</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
          Cyber Vani publishes clear, honest reporting on cyber threats, breaches, and digital policy.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          We believe everyone deserves reliable, easy-to-understand cyber security news. Our editorial team curates the stories that matter most and publishes them every week, consistently and on time.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-4xl border border-border bg-surface-strong p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Mission</p>
          <h2 className="mt-3 text-3xl font-black text-hero">Why this newsroom exists</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
            <p>
              Cyber Vani focuses on the stories security teams, founders, students, and public-interest readers need to track: active threat campaigns, data exposure incidents, policy shifts, and operational security lessons.
            </p>
            <p>
              We are committed to publishing consistently, week after week, so readers always have a trusted place to turn when a new cyber incident or threat emerges.
            </p>
          </div>
        </article>

        <aside className="space-y-4 rounded-4xl border border-accent/20 bg-[linear-gradient(180deg,rgba(180,35,24,0.08),rgba(245,158,11,0.1))] p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Cyber Helplines</p>

          <div className="rounded-3xl border border-accent/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">National Cyber Crime Helpline</p>
            <p className="mt-3 text-5xl font-black text-hero">1930</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Call 1930 to report cyber fraud, online scams, and financial cyber crimes directly to the national response desk.
            </p>
          </div>

          <div className="rounded-3xl border border-accent/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">Safedigital Uttar Pradesh</p>
            <p className="mt-2 text-base font-bold text-hero">UP Police Cyber Cell</p>
            <a
              href="mailto:sp-cyber.lu@up.gov.in"
              className="mt-2 inline-block break-all text-sm font-semibold text-accent hover:underline"
            >
              sp-cyber.lu@up.gov.in
            </a>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              For UP-specific cyber incidents, reach out directly to the Lucknow unit of the UP Police Cyber Cell.
            </p>
          </div>
        </aside>
      </section>

      <section className="rounded-4xl border border-border bg-surface p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Team Information</p>
          <h2 className="mt-3 text-3xl font-black text-hero">Leadership & Team</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Cyber Vani is supported by a founder-led editorial vision and experienced team members who contribute reporting, public awareness, and specialist guidance.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="grid gap-6 md:grid-cols-[260px_1fr]">
              <div className="mx-auto w-full max-w-65 overflow-hidden rounded-3xl border border-border bg-surface-strong shadow-[0_16px_50px_-38px_rgba(15,23,42,0.45)] md:mx-0">
                <div className="relative h-81.25 w-full">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 260px"
                  />
                </div>
              </div>

              <article className="rounded-3xl border border-border bg-surface-strong p-6 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.45)]">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{member.role}</p>
                <h3 className="mt-3 text-3xl font-black text-hero">{member.name}</h3>
                <p className="mt-4 text-base leading-8 text-slate-700">{member.bio}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}