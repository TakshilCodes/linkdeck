import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/features"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/explore"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/learn"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/help"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // If the profile count grows significantly, split this into sitemap indexes.
  const users = await prisma.user.findMany({
    where: {
      username: { not: null },
      onboardingDone: true,
    },
    select: {
      username: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 50000,
  });

  const profileRoutes: MetadataRoute.Sitemap = users.flatMap((user) => {
    if (!user.username) return [];

    return [
      {
        url: absoluteUrl(`/${encodeURIComponent(user.username)}`),
        lastModified: user.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      },
    ];
  });

  return [...staticRoutes, ...profileRoutes];
}
