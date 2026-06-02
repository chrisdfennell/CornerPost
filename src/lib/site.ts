/** Absolute base URL for the site, used in sitemap/robots/canonical links. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
