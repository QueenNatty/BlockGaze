import type { MetadataRoute } from "next";
import { getMarkets } from "@/lib/coingecko";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
  try {
    const coins = await getMarkets();
    return [
      ...pages,
      ...coins.map((c) => ({
        url: `${SITE_URL}/coin/${c.id}`,
        changeFrequency: "hourly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return pages;
  }
}
