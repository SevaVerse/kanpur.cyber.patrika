import type { NextConfig } from "next";

function getBasePath() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    return "";
  }

  const repoName = repository.split("/")[1];

  return repoName ? `/${repoName}` : "";
}

const basePath = getBasePath();

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
  },
};

export default nextConfig;
