import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Management links carry a secret token — keep them out of the index.
      disallow: ["/api/", "/listing/*/manage"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
