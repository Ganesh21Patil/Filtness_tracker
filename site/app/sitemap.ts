import type { MetadataRoute } from "next";

// TODO: swap for the real domain once one is purchased.
const siteUrl = "https://filtness-tracker.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/calculator",
    "/deductions",
    "/about",
    "/privacy",
    "/terms",
    "/widget",
    "/guides",
    "/guides/personal-trainer-tax-deductions",
    "/guides/1099-vs-w2-personal-trainers",
    "/guides/quarterly-tax-deadlines-fitness-pros",
    "/guides/1099-threshold-2026",
    "/guides/section-179-equipment",
    "/guides/minimum-qbi-deduction",
    "/calculators/quarterly-tax-calculator-personal-trainers",
    "/calculators/personal-trainer-deduction-finder",
    "/calculators/llc-vs-scorp-fitness-professionals",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
