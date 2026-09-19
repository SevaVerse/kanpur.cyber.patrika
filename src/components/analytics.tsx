import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_ID is set, so
 * local development and preview builds stay out of the production property.
 */
export function Analytics() {
  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
