import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.45em] text-accent">404</p>
      <h1 className="text-4xl font-black text-hero sm:text-5xl">The requested briefing is not available.</h1>
      <p className="max-w-xl text-base leading-8 text-slate-700">
        The article may have been removed from the latest static export cycle. Return to the homepage to browse current coverage.
      </p>
      <Link href="/" className="rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:bg-accent-dark">
        Return Home
      </Link>
    </div>
  );
}
