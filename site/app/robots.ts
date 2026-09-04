import type { MetadataRoute } from "next";

// TODO: swap for the real domain once one is purchased.
const siteUrl = "https://filtness-tracker.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
