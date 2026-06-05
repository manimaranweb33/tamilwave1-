import { ContentStatus } from "@prisma/client";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { prismaTypeToPublic, toMediaItem, type ContentWithRelations } from "@/lib/admin/content-mapper";

const contentInclude = {
  genres: { include: { genre: true } },
  cast: { include: { person: true } },
  platforms: { include: { platform: true } },
  director: true
} as const;
import { getPublishedContents, findPublishedContentRecord } from "@/lib/catalog-service";
import { mediaItems as staticItems } from "@/lib/catalog-data";
import { getPublicPlatforms } from "@/lib/platforms-public";
import type { ContentType, MediaItem } from "@/lib/types";

const isDbCatalog = () => (process.env.CATALOG_SOURCE ?? "db") === "db";

export type TitleCastMember = {
  name: string;
  tamilName?: string | null;
  character?: string | null;
};

export type TitlePlatformLink = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  url: string;
};

export type TitleDetail = {
  slug: string;
  title: string;
  tamilTitle: string | null;
  originalTitle: string | null;
  description: string;
  year: number;
  type: ContentType;
  genre: string;
  genres: string[];
  language: string;
  country: string | null;
  quality: string;
  accent: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  rating: number | null;
  ratingCount: number | null;
  runtimeMinutes: number | null;
  statusLabel: string;
  seriesSeasons: number | null;
  seriesEpisodes: number | null;
  seriesStatus: string | null;
  director: string | null;
  cast: TitleCastMember[];
  platforms: TitlePlatformLink[];
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  mediaItem: MediaItem;
};

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function titlePath(slug: string) {
  return `/title/${slug}`;
}

export function categoryHref(type: ContentType) {
  if (type === "Web Series") return "/category/web-series";
  if (type === "Dubbed") return "/category/dubbed";
  return "/category/movies";
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatRating(rating: number | null | undefined) {
  if (rating == null || Number.isNaN(rating)) return null;
  return rating.toFixed(1);
}

function statusLabelFor(content: ContentWithRelations): string {
  if (content.type === "WEB_SERIES" && content.seriesStatus) {
    return content.seriesStatus;
  }
  switch (content.status) {
    case ContentStatus.PUBLISHED:
      return "Published";
    case ContentStatus.DRAFT:
      return "Draft";
    case ContentStatus.ARCHIVED:
      return "Archived";
    default:
      return "Unknown";
  }
}

function mapContentToTitleDetail(content: ContentWithRelations, index = 0): TitleDetail {
  const genres = content.genres?.map((g) => g.genre.name) ?? [];
  const genre = genres.length ? genres.join(", ") : content.genre;
  const cast = (content.cast ?? [])
    .filter((c) => c.role === "ACTOR")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      name: c.person.name,
      tamilName: c.person.tamilName,
      character: c.character
    }));

  const platforms: TitlePlatformLink[] =
    content.platforms?.map((p) => ({
      id: p.platform.id,
      name: p.platform.name,
      slug: p.platform.slug,
      logoUrl: p.platform.logoUrl,
      url: p.url
    })) ?? [];

  const originalTitle =
    content.sourceTitle ??
    (content.type === "DUBBED_MOVIE" ? content.tamilTitle : null) ??
    content.tamilTitle;

  return {
    slug: content.slug,
    title: content.title,
    tamilTitle: content.tamilTitle,
    originalTitle,
    description: content.description,
    year: content.year,
    type: prismaTypeToPublic(content.type),
    genre,
    genres: genres.length ? genres : [content.genre],
    language: content.language,
    country: content.country,
    quality: content.quality ?? "HD",
    accent: content.accent,
    posterUrl: content.posterUrl,
    backdropUrl: content.backdropUrl,
    trailerUrl: content.trailerUrl,
    rating: content.rating,
    ratingCount: content.ratingCount,
    runtimeMinutes: content.runtimeMinutes,
    statusLabel: statusLabelFor(content),
    seriesSeasons: content.seriesSeasons,
    seriesEpisodes: content.seriesEpisodes,
    seriesStatus: content.seriesStatus,
    director: content.director?.name ?? null,
    cast,
    platforms,
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    keywords: content.keywords ?? [],
    canonicalUrl: content.canonicalUrl,
    ogImageUrl: content.ogImageUrl ?? content.backdropUrl ?? content.posterUrl,
    mediaItem: toMediaItem(content, index)
  };
}

function mapStaticToTitleDetail(item: MediaItem): TitleDetail {
  return {
    slug: item.slug,
    title: item.title,
    tamilTitle: item.tamilTitle !== item.title ? item.tamilTitle : null,
    originalTitle: item.tamilTitle !== item.title ? item.tamilTitle : null,
    description: item.description,
    year: item.year,
    type: item.type,
    genre: item.genre,
    genres: item.genre.split(",").map((g) => g.trim()).filter(Boolean),
    language: "Tamil",
    country: null,
    quality: item.quality,
    accent: item.accent,
    posterUrl: item.posterUrl ?? null,
    backdropUrl: null,
    trailerUrl: null,
    rating: null,
    ratingCount: null,
    runtimeMinutes: null,
    statusLabel: "Published",
    seriesSeasons: null,
    seriesEpisodes: null,
    seriesStatus: null,
    director: null,
    cast: [],
    platforms: [],
    metaTitle: null,
    metaDescription: null,
    keywords: [],
    canonicalUrl: null,
    ogImageUrl: item.posterUrl ?? null,
    mediaItem: item
  };
}

export async function getTitleBySlug(slug: string): Promise<TitleDetail | null> {
  if (isDbCatalog()) {
    try {
      const record = await findPublishedContentRecord(slug);
      if (record) return mapContentToTitleDetail(record);
    } catch {
      // fallback below
    }
  }

  const staticItem = staticItems.find((i) => i.slug === slug);
  if (staticItem) return mapStaticToTitleDetail(staticItem);

  try {
    const content = await db.content.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED, deletedAt: null },
      include: contentInclude
    });
    if (content) return mapContentToTitleDetail(content);
  } catch {
    // ignore
  }

  return null;
}

function scoreRelatedItem(item: MediaItem, current: TitleDetail, trendingSlugs: Set<string>) {
  let score = 0;
  const itemGenres = item.genre.split(",").map((g) => g.trim().toLowerCase());
  const currentGenres = current.genres.map((g) => g.toLowerCase());
  if (currentGenres.some((g) => itemGenres.includes(g) || item.genre.toLowerCase().includes(g))) {
    score += 3;
  } else if (item.genre === current.genre) {
    score += 3;
  }
  if (item.type === current.type) score += 2;
  if (trendingSlugs.has(item.slug)) score += 1;
  return score;
}

export async function getRelatedTitles(current: TitleDetail, limit = 12): Promise<MediaItem[]> {
  const [pool, trendingPool] = await Promise.all([
    getPublishedContents({ limit: 180 }),
    getPublishedContents({ trending: true, limit: 24 })
  ]);

  const trendingSlugs = new Set(trendingPool.map((t) => t.slug));

  const ranked = pool
    .filter((item) => item.slug !== current.slug)
    .map((item) => ({ item, score: scoreRelatedItem(item, current, trendingSlugs) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.item.year - a.item.year);

  const picked = ranked.map((r) => r.item);

  if (picked.length < limit) {
    const seen = new Set([current.slug, ...picked.map((i) => i.slug)]);
    for (const item of trendingPool) {
      if (seen.has(item.slug)) continue;
      picked.push(item);
      seen.add(item.slug);
      if (picked.length >= limit) break;
    }
  }

  if (picked.length < limit) {
    const seen = new Set([current.slug, ...picked.map((i) => i.slug)]);
    for (const item of pool) {
      if (seen.has(item.slug)) continue;
      picked.push(item);
      seen.add(item.slug);
      if (picked.length >= limit) break;
    }
  }

  return picked.slice(0, limit);
}

export async function getTitlePlatformLinks(title: TitleDetail): Promise<TitlePlatformLink[]> {
  if (title.platforms.length) return title.platforms;

  const catalog = await getPublicPlatforms();
  return catalog.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    logoUrl: p.logoUrl,
    url: `/search?q=${encodeURIComponent(title.title)}`
  }));
}

export function buildTitleMetadata(title: TitleDetail): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = title.canonicalUrl ?? `${siteUrl}${titlePath(title.slug)}`;
  const pageTitle = title.metaTitle ?? title.title;
  const description =
    title.metaDescription ??
    title.description.slice(0, 160).replace(/\s+/g, " ").trim();

  const ogImage = title.ogImageUrl ?? title.backdropUrl ?? title.posterUrl ?? undefined;

  return {
    title: pageTitle,
    description,
    keywords: title.keywords.length ? title.keywords : undefined,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: "TamilWave",
      type: title.type === "Web Series" ? "video.tv_show" : "video.movie",
      images: ogImage ? [{ url: ogImage, alt: title.title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export function buildTitleJsonLd(title: TitleDetail) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${titlePath(title.slug)}`;
  const image = title.ogImageUrl ?? title.backdropUrl ?? title.posterUrl ?? undefined;

  const base = {
    "@context": "https://schema.org",
    name: title.title,
    alternateName: [title.tamilTitle, title.originalTitle].filter(Boolean) as string[],
    description: title.description,
    image,
    url,
    inLanguage: title.language,
    genre: title.genres,
    datePublished: `${title.year}`,
    countryOfOrigin: title.country ?? undefined
  };

  const rating =
    title.rating != null
      ? {
          "@type": "AggregateRating",
          ratingValue: title.rating,
          ratingCount: title.ratingCount ?? 1,
          bestRating: 10,
          worstRating: 0
        }
      : undefined;

  if (title.type === "Web Series") {
    return {
      ...base,
      "@type": "TVSeries",
      numberOfSeasons: title.seriesSeasons ?? undefined,
      numberOfEpisodes: title.seriesEpisodes ?? undefined,
      aggregateRating: rating
    };
  }

  return {
    ...base,
    "@type": "Movie",
    duration: title.runtimeMinutes ? `PT${title.runtimeMinutes}M` : undefined,
    aggregateRating: rating
  };
}
