import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Send Cyber Vani a story tip, a correction or a sponsorship enquiry. Reporting a live fraud? Call 1930 or file at cybercrime.gov.in.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-panel border border-border bg-hero px-6 py-8 text-white shadow-panel sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-hero text-hero-accent">Contact Desk</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Securely send editorial tips, corrections, and partnership enquiries.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          We read every message. Whether you have a tip, a correction, or a sponsorship enquiry, we will get back to you promptly.
        </p>
      </section>

      <ContactForm />
    </div>
  );
}
