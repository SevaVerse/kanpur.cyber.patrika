const DEFAULT_SITE_URL = "https://cybervani.com/";

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return new URL(DEFAULT_SITE_URL);
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (!url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}/`;
  }

  return url;
}

function getConfiguredSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? process.env.CUSTOM_DOMAIN;

  if (!configuredSiteUrl) {
    return null;
  }

  return normalizeSiteUrl(configuredSiteUrl);
}

export function getSiteUrl() {
  const configuredSiteUrl = getConfiguredSiteUrl();

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    return new URL(DEFAULT_SITE_URL);
  }

  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    return new URL(DEFAULT_SITE_URL);
  }

  return new URL(`https://${owner.toLowerCase()}.github.io/${repo}/`);
}

export function getBasePath() {
  if (getConfiguredSiteUrl()) {
    return "";
  }

  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    return "";
  }

  const repoName = repository.split("/")[1];

  return repoName ? `/${repoName}` : "";
}

export function getCustomDomainHost() {
  const configuredSiteUrl = getConfiguredSiteUrl();

  return configuredSiteUrl?.hostname ?? getSiteUrl().hostname;
}