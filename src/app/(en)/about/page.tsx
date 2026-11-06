import type { Metadata } from "next";
import Link from "next/link";

import { Picture } from "@/components/picture";
import { pageMetadata } from "@/lib/site-metadata";
import { PageHeader } from "@/components/page-header";

const founderMember = {
  name: "Nitin Srivastava",
  role: "Founder",
  bio:
    "Leads Cyber Vani with a focus on cyber awareness, practical reporting, and making security news accessible to everyday readers across India. He holds a PGDM (IT) from Symbiosis Pune and a software quality assurance certification from Pune.",
  imageSrc: "/founder-pic.jpeg",
};

const associateMembers = [
  {
    name: "Vishal Srivastava",
    role: "Co-founder",
    bio:
      "Advocate Vishal Srivastava has been practicing and handling cases independently with a result-oriented approach, both professionally and ethically, and has acquired many years of professional experience in providing legal consultancy and advisory services. He is a member of the Lucknow Bar Association and the Central Bar Association.",
    imageSrc: "/Team_mate_1.jpeg",
  },
  {
    name: "Rajesh Choudhary",
    role: "Associate",
    bio:
      "With over 15 years of distinguished practice at the Kanpur Bar Association, Advocate Rajesh Choudhary brings deep expertise in civil, criminal, and cyber law matters. A committed and respected member of the Kanpur Bar Association, he is known for his methodical legal approach, thorough command of the Indian Penal Code and IT Act, and unwavering professional integrity. His extensive courtroom experience and nuanced understanding of the evolving legal landscape surrounding digital crimes make him an invaluable resource for Cyber Vani's readers — whether navigating online fraud redressal, understanding their digital rights, or seeking guidance on cyber-related legal proceedings. Advocate Choudhary actively works to bridge the gap between legal literacy and digital safety across Uttar Pradesh.",
    imageSrc: "/Team_mate_2.jpeg",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Who runs Cyber Vani, how the weekly briefing is made, and the cyber helplines for readers in Uttar Pradesh and across India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader kicker="About us" title="Cyber Vani helps ordinary people recognise cyber fraud before it reaches them.">
        Free awareness guides in Hindi and English, and a weekly briefing of the cyber fraud stories that matter —
        written for readers across Uttar Pradesh and India, not for security professionals.
      </PageHeader>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-panel border border-border bg-surface-strong p-8 shadow-card">
          <p className="text-xs font-bold uppercase tracking-kicker text-accent">Mission</p>
          <h2 className="mt-3 text-3xl font-bold text-hero">Why this newsroom exists</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
            <p>
              Cyber fraud in India works by surprise: a call from &ldquo;the police&rdquo;, a fake e-challan, a request
              for an OTP. People who have seen the script before recognise it in time. Our awareness library explains
              each scam in plain Hindi and English, as posters and comics that are easy to share with family.
            </p>
            <p>
              Every Saturday, our weekly briefing collects the week&apos;s cyber fraud stories from Indian news
              outlets and links each one to the guide that explains how to avoid it. The short &ldquo;why it
              matters&rdquo; notes are AI-assisted and automatically checked against the original reporting before
              publication.{" "}
              <Link href="/editorial-policy" className="font-semibold text-accent hover:underline">
                Read our editorial policy
              </Link>
              .
            </p>
          </div>
        </article>

        <aside className="space-y-4 rounded-panel border border-accent/20 bg-[linear-gradient(180deg,rgba(180,35,24,0.08),rgba(245,158,11,0.1))] p-8 shadow-card">
          <p className="text-xs font-bold uppercase tracking-kicker text-accent">Cyber Helplines</p>

          <div className="rounded-card border border-accent/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-label text-muted">National Cyber Crime Helpline</p>
            <p className="mt-3 text-5xl font-bold text-hero">1930</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Call 1930 to report cyber fraud, online scams, and financial cyber crimes directly to the national response desk.
            </p>
          </div>

          <div className="rounded-card border border-accent/15 bg-white/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-label text-muted">Safedigital Uttar Pradesh</p>
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

      <section className="rounded-panel border border-border bg-surface p-8 shadow-card">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-kicker text-accent">Team Information</p>
          <h2 className="mt-3 text-3xl font-bold text-hero">Leadership & Team</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Cyber Vani is supported by a founder-led editorial vision and experienced team members who contribute reporting, public awareness, and specialist guidance.
          </p>
        </div>

        {/* Founder — full-width row */}
        <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-card border border-border bg-surface-strong shadow-card md:mx-0">
            <div className="relative h-80 w-full">
              <Picture
                src={founderMember.imageSrc}
                alt={founderMember.name}
                sizes="(max-width: 768px) 100vw, 260px"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
          <article className="rounded-card border border-border bg-surface-strong p-6 shadow-card">
            <p className="text-xs font-bold uppercase tracking-kicker text-accent">{founderMember.role}</p>
            <h3 className="mt-3 text-3xl font-bold text-hero">{founderMember.name}</h3>
            <p className="mt-4 text-base leading-8 text-slate-700">{founderMember.bio}</p>
          </article>
        </div>

        {/* Associates — two portrait cards side by side */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {associateMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-panel border border-border bg-surface-strong shadow-card"
            >
              <div className="relative h-80 w-full">
                <Picture
                  src={member.imageSrc}
                  alt={member.name}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-kicker text-accent">{member.role}</p>
                <h3 className="mt-2 text-2xl font-bold text-hero">{member.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}