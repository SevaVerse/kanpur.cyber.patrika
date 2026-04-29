const formAction = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/your-form-id";
const isConfigured = !formAction.endsWith("your-form-id");

export function ContactForm() {
  return (
    <form
      action={formAction}
      method="POST"
      className="space-y-5 rounded-4xl border border-border bg-surface-strong p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)]"
    >
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Secure Contact</p>
        <h2 className="text-3xl font-black text-hero">Send a tip or editorial request</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-700">
          This static form posts directly to Formspree. Set <span className="font-semibold">NEXT_PUBLIC_FORMSPREE_ENDPOINT</span> in your environment before deployment.
        </p>
      </div>

      {!isConfigured ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Configure a real Formspree endpoint to receive submissions in production.
        </div>
      ) : null}

      <input type="hidden" name="_subject" value="Kanpur Cyber Patrika contact submission" />
      <input type="hidden" name="_captcha" value="false" />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-hero">
          Name
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
            placeholder="Your name"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-hero">
          Email
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
            placeholder="name@company.com"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-hero">
        Topic
        <input
          type="text"
          name="topic"
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
          placeholder="Breach report, partnership, editorial feedback"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-hero">
        Message
        <textarea
          name="message"
          required
          rows={6}
          className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-accent"
          placeholder="Share the details you want the editorial desk to review."
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:bg-accent-dark"
      >
        Send Message
      </button>
    </form>
  );
}
