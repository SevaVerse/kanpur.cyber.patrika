/**
 * Header for interior pages. Light and compact on purpose: every page used to
 * open with the same navy box as the home page, so the pages blurred together
 * and the home hero lost its weight. The dark treatment is now reserved for
 * the home hero and the helpline band.
 */
export function PageHeader({
  kicker,
  title,
  children,
  actions,
  lang,
}: {
  kicker: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  lang?: string;
}) {
  return (
    <header className="border-b border-border pb-8" lang={lang}>
      <p className="flex items-center gap-2 text-sm font-semibold text-accent">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
        {kicker}
      </p>
      <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.1] text-hero text-balance sm:text-5xl">{title}</h1>
      {children ? <div className="mt-4 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">{children}</div> : null}
      {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
