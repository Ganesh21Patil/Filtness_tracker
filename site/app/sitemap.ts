import type { MetadataRoute } from "next";

// TODO: swap for the real domain once one is purchased.
const siteUrl = "https://filtness-tracker.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/guides",
    "/guides/personal-trainer-tax-deductions",
    "/guides/1099-vs-w2-personal-trainers",
    "/guides/quarterly-tax-deadlines-fitness-pros",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
