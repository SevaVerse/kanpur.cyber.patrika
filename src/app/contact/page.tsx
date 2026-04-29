import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the Kanpur Cyber Patrika editorial desk using a static Formspree-compatible form.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-4xl border border-border bg-hero px-6 py-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-hero-accent">Contact Desk</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          Securely send editorial tips, corrections, and partnership enquiries.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          The project uses a static-compatible form flow so it works on GitHub Pages without a custom backend.
        </p>
      </section>

      <ContactForm />
    </div>
  );
}
