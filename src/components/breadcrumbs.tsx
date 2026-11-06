import Link from "next/link";

export type Crumb = { name: string; href?: string };

/**
 * Visible breadcrumb trail. Each page already emits BreadcrumbList structured
 * data; search engines prefer markup that matches what the reader can see,
 * and the trail is a useful way back up for readers who land from search.
 */
export function Breadcrumbs({ items, label = "Breadcrumb" }: { items: Crumb[]; label?: string }) {
  return (
    <nav aria-label={label} className="mb-6 text-xs font-semibold text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={`${index}-${item.name}`} className="flex min-w-0 items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="transition hover:text-accent">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="line-clamp-1 text-hero">
                  {item.name}
                </span>
              )}
              {last ? null : (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
