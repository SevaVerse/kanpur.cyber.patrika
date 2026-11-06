import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/site-metadata";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Send Cyber Vani a story tip, a correction or a sponsorship enquiry. Reporting a live fraud? Call 1930 or file at cybercrime.gov.in.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader kicker="Contact" title="Send a tip, a correction or a partnership enquiry">
        We read every message and reply to the ones that need a reply.
      </PageHeader>

      <ContactForm />
    </div>
  );
}
