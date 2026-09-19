const formAction = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/your-form-id";
const isConfigured = !formAction.endsWith("your-form-id");
const isProduction = process.env.NODE_ENV === "production";
const editorEmail = process.env.NEXT_PUBLIC_EDITOR_EMAIL;

export function ContactForm() {
  return (
    <div className="space-y-6">
      <form
        action={formAction}
        method="POST"
        className="space-y-5 rounded-panel border border-border bg-surface-strong p-8 shadow-card"
      >
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-kicker text-accent">Secure Contact</p>
          <h2 className="text-3xl font-bold text-hero">Send a tip or editorial request</h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-700">
            Share a story tip, report an error, or ask about sponsorship. We read every message and reply to
            the ones that need a reply. Please do not send passwords, OTPs, or bank details — no one at Cyber
            Vani will ever ask you for them.
          </p>
        </div>

        {/* Build-time guard for the maintainer; never shown to readers in production. */}
        {!isConfigured && !isProduction ? (
          <div className="rounded-card border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Developer note: set <span className="font-semibold">NEXT_PUBLIC_FORMSPREE_ENDPOINT</span> before
            deploying, or submissions will go nowhere.
          </div>
        ) : null}

        <input type="hidden" name="_subject" value="Cyber Vani contact submission" />

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-hero">
            Name
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-card border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
              placeholder="Your name"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-hero">
            Email
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-card border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
              placeholder="name@company.com"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-semibold text-hero">
          Topic
          <input
            type="text"
            name="topic"
            className="w-full rounded-card border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
            placeholder="Story tip, correction, sponsorship"
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-hero">
          Message
          <textarea
            name="message"
            required
            rows={6}
            className="w-full rounded-card border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
            placeholder="Share the details you want the editorial desk to review."
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-label text-white transition hover:bg-accent-dark"
        >
          Send Message
        </button>
      </form>

      {editorEmail ? (
        <aside className="rounded-panel border border-border bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-kicker text-accent">Prefer email?</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Write to us directly at{" "}
            <a href={`mailto:${editorEmail}`} className="font-semibold text-accent hover:underline">
              {editorEmail}
            </a>
            .
          </p>
        </aside>
      ) : null}

      <aside className="rounded-panel border border-accent/20 bg-[linear-gradient(135deg,rgba(180,35,24,0.06),rgba(245,158,11,0.08))] p-6">
        <p className="text-xs font-bold uppercase tracking-kicker text-accent">Reporting a live fraud?</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          This form is for the editorial desk and is not an emergency channel. If money has just left your
          account, call <a href="tel:1930" className="font-bold text-accent hover:underline">1930</a> or file
          at{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-accent hover:underline"
          >
            cybercrime.gov.in
          </a>{" "}
          immediately — the first few hours matter most.
        </p>
      </aside>
    </div>
  );
}
