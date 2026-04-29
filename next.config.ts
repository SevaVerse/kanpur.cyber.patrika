import type { NextConfig } from "next";

function getBasePath() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!process.env.GITHUB_ACTIONS || !repository) {
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
};

export default nextConfig;
