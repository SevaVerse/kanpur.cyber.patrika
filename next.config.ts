import type { NextConfig } from "next";

import { getBasePath, getSiteUrl } from "./src/lib/site";

const basePath = getBasePath();
const siteUrl = getSiteUrl();

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    // Two root layouts (English and Hindi, for a correct <html lang>) leave no
    // single layout to build the 404 from; app/global-not-found.tsx is it.
    globalNotFound: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl.toString(),
  },
};

export default nextConfig;
