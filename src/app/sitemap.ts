import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { MIN_YEAR } from "@/constants/purchasing-power";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastFullYear = now.getFullYear() - 1;

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "monthly", priority: 1 },
    { path: "/resume", changeFrequency: "monthly", priority: 0.9 },
    { path: "/portfolio/game-animation", changeFrequency: "monthly", priority: 0.8 },
    { path: "/portfolio/drawings", changeFrequency: "monthly", priority: 0.7 },
    { path: "/tools", changeFrequency: "monthly", priority: 0.6 },
    { path: "/tools/purchasing-power", changeFrequency: "weekly", priority: 0.6 },
    { path: "/tools/countries-visited", changeFrequency: "monthly", priority: 0.5 },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (let year = MIN_YEAR; year <= lastFullYear; year++) {
    entries.push({
      url: `${SITE_URL}/tools/purchasing-power/${year}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  return entries;
}
