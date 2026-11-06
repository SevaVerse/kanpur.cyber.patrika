import { hind } from "@/app/fonts";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import type { Lang } from "@/lib/i18n";
import { getImageEntry } from "@/lib/image-manifest";
import { JsonLd } from "@/lib/json-ld";
import { getLanguageAlternates } from "@/lib/library";
import { organizationSchema, webSiteSchema } from "@/lib/site-metadata";

import "@/app/globals.css";

/**
 * The document frame shared by both root layouts.
 *
 * English and Hindi pages live in separate route groups, each with its own
 * root layout, purely so that `<html lang>` is correct in the static HTML.
 * Everything else about the frame is identical and lives here.
 */
export function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={hind.variable}>
      <body>
        <JsonLd schemas={[organizationSchema(), webSiteSchema(lang)]} />
        <div className="relative flex min-h-screen flex-col">
          <Navbar lang={lang} alternates={getLanguageAlternates()} logo={getImageEntry("/Site_logo.jpeg")} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer lang={lang} />
        </div>
        <Analytics lang={lang} />
      </body>
    </html>
  );
}
