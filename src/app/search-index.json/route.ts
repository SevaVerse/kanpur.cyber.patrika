import { getSearchEntries } from "@/lib/search";

export const dynamic = "force-static";

/**
 * The search index as a static file, fetched the first time a reader opens
 * search. It used to be passed as props through the root layout, which
 * serialised the full text of every guide and briefing into every page's HTML
 * (~84 KB per page, growing every week) for a feature most visits never use.
 */
export function GET() {
  return Response.json(getSearchEntries());
}
