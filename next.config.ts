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
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl.toString(),
  },
};

export default nextConfig;
