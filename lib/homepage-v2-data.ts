import { cache } from "react";
import { ContentStatus, HomepageSectionKey } from "@prisma/client";
import { db } from "@/lib/db";
import { toMediaItem, type ContentWithRelations } from "@/lib/admin/content-mapper";
import { getCuratedSectionItems, getRecentlyAdded, getSectionItems } from "@/lib/homepage-public";
import { getPublishedContents } from "@/lib/catalog-service";
import { getMediaItems } from "@/lib/catalog";
import { DEFAULT_STREAMING_PLATFORMS } from "@/lib/admin/ensure-platforms";
import type { MediaItem } from "@/lib/types";

export type HeroSlide = MediaItem & {
  trailerUrl?: string | null;
  backdropUrl?: string | null;
};

const currentYear = new Date().getFullYear();

function isPublished(content: ContentWithRelations) {
  return content.status === ContentStatus.PUBLISHED && content.deletedAt == null;
}

function enrich(content: ContentWithRelations, index: number): MediaItem {
  return toMediaItem(content, index);
}

function uniqueBySlug(items: MediaItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

export const getHeroTrailerSlides = cache(async (): Promise<HeroSlide[]> => {
  const [featured, trending, topTamil] = await Promise.all([
    getSectionItems(HomepageSectionKey.FEATURED, 12),
    getSectionItems(HomepageSectionKey.TRENDING, 12),
    getSectionItems(HomepageSectionKey.TOP_TAMIL_MOVIES, 8)
  ]);

  const pool = uniqueBySlug([...featured, ...trending, ...topTamil]);
  const withTrailers = pool.filter((item) => item.trailerUrl) as HeroSlide[];

  if (withTrailers.length >= 1) return withTrailers.slice(0, 6);

  try {
    const rows = await db.content.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
        trailerUrl: { not: null }
      },
      include: {
        genres: { include: { genre: true } },
        cast: { include: { person: true } },
        platforms: { include: { platform: true } },
        director: true
      },
      orderBy: { updatedAt: "desc" },
      take: 6
    });
    const dbSlides = rows
      .filter((row) => row.trailerUrl)
      .map((row, i) => enrich(row, i) as HeroSlide);
    return uniqueBySlug([...withTrailers, ...dbSlides]).slice(0, 6) as HeroSlide[];
  } catch {
    // fallback below
  }

  return pool.slice(0, 6).map((item) => ({ ...item })) as HeroSlide[];
});

export const getTopTenThisWeek = cache(async () =>
  getCuratedSectionItems(HomepageSectionKey.TRENDING, (all) =>
    all.filter((item) => item.id % 17 === 0 || item.year >= currentYear - 1)
  )
);

export const getFanFavorites = cache(async () =>
  getCuratedSectionItems(HomepageSectionKey.FEATURED, (all) =>
    all.filter((item) => item.id % 5 === 0 || item.rating != null)
  )
);

export const getBoxOfficeIndia = cache(async () =>
  getCuratedSectionItems(HomepageSectionKey.TOP_TAMIL_MOVIES, (all) =>
    all.filter((item) => item.type === "Movie")
  )
);

export async function getGroupedStreamingContent(): Promise<Record<string, MediaItem[]>> {
  const slugs = DEFAULT_STREAMING_PLATFORMS.map((p) => p.slug);
  const grouped: Record<string, MediaItem[]> = Object.fromEntries(slugs.map((s) => [s, []]));

  try {
    const rows = await db.content.findMany({
      where: { status: ContentStatus.PUBLISHED, deletedAt: null },
      include: {
        genres: { include: { genre: true } },
        platforms: { include: { platform: true } },
        cast: { include: { person: true } },
        director: true
      },
      orderBy: { createdAt: "desc" },
      take: 180
    });

    rows.forEach((row, index) => {
      if (!isPublished(row)) return;
      const item = enrich(row, index);
      for (const link of row.platforms) {
        const slug = link.platform.slug;
        if (!grouped[slug]) grouped[slug] = [];
        if (grouped[slug].length < 12) grouped[slug].push(item);
      }
    });

    const hasAny = Object.values(grouped).some((items) => items.length > 0);
    if (hasAny) return grouped;
  } catch {
    // fallback below
  }

  const all = await getMediaItems();
  slugs.forEach((slug, index) => {
    grouped[slug] = all.filter((_, i) => i % slugs.length === index).slice(0, 12);
  });
  return grouped;
}

export const getInTheaters = cache(async () => {
  try {
    const rows = await db.content.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
        type: { in: ["MOVIE", "DUBBED_MOVIE"] },
        year: { gte: currentYear - 1 }
      },
      include: {
        genres: { include: { genre: true } },
        cast: { include: { person: true } },
        platforms: { include: { platform: true } },
        director: true
      },
      orderBy: { year: "desc" },
      take: 12
    });
    if (rows.length) {
      return rows.map((row, i) => ({
        ...enrich(row, i),
        releaseStatus: row.seriesStatus ?? (row.year >= currentYear ? "In theaters" : "Now playing")
      }));
    }
  } catch {
    // fallback
  }

  const all = await getMediaItems();
  return all
    .filter((item) => item.type === "Movie" && item.year >= currentYear - 1)
    .slice(0, 12)
    .map((item) => ({ ...item, releaseStatus: "In theaters" }));
});

export const getComingSoon = cache(async () => {
  try {
    const rows = await db.content.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
        OR: [
          { year: { gte: currentYear } },
          { seriesStatus: { contains: "coming", mode: "insensitive" } }
        ]
      },
      include: {
        genres: { include: { genre: true } },
        cast: { include: { person: true } },
        platforms: { include: { platform: true } },
        director: true
      },
      orderBy: { year: "asc" },
      take: 12
    });
    if (rows.length) return rows.map((row, i) => enrich(row, i));
  } catch {
    // fallback
  }

  const all = await getMediaItems();
  return all.filter((item) => item.year >= currentYear).slice(0, 12);
});

export const getUpcomingTrailers = cache(async () => {
  try {
    const rows = await db.content.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
        trailerUrl: { not: null }
      },
      include: {
        genres: { include: { genre: true } },
        cast: { include: { person: true } },
        platforms: { include: { platform: true } },
        director: true
      },
      orderBy: { createdAt: "desc" },
      take: 12
    });
    if (rows.length) return rows.map((row, i) => enrich(row, i));
  } catch {
    // fallback
  }

  const items = await getRecentlyAdded();
  return items.filter((item) => item.trailerUrl).slice(0, 12);
});

export { getRecentlyAdded };
