import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { mediaItems as staticItems } from "@/lib/catalog-data";
import { toMediaItem, publicTypeToPrisma } from "@/lib/admin/content-mapper";
import type { MediaItem, ContentType } from "@/lib/types";
import type { ContentType as PrismaContentType } from "@prisma/client";

const isDbCatalog = () => (process.env.CATALOG_SOURCE ?? "db") === "db";

const contentInclude = {
  genres: { include: { genre: true } },
  cast: { include: { person: true } },
  platforms: { include: { platform: true } },
  director: true
} as const;

export async function getPublishedContents(filters?: {
  type?: PrismaContentType;
  year?: number;
  search?: string;
  limit?: number;
  skip?: number;
  featured?: boolean;
  trending?: boolean;
}) {
  if (!isDbCatalog()) {
    return filterStatic(filters);
  }

  try {
  const where: Record<string, unknown> = {
    status: ContentStatus.PUBLISHED,
    deletedAt: null
  };
  if (filters?.type) where.type = filters.type;
  if (filters?.year) where.year = filters.year;
  if (filters?.featured) where.featured = true;
  if (filters?.trending) where.trending = true;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { tamilTitle: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } },
      { genre: { contains: filters.search, mode: "insensitive" } }
    ];
  }

  const items = await db.content.findMany({
    where,
    include: contentInclude,
    orderBy: { createdAt: "desc" },
    take: filters?.limit,
    skip: filters?.skip
  });

  return items.map((item, i) => toMediaItem(item, i + 1));
  } catch {
    return filterStatic(filters);
  }
}

export async function findPublishedBySlug(slug: string) {
  if (!isDbCatalog()) {
    const item = staticItems.find((i) => i.slug === slug);
    return item ?? null;
  }

  try {
    const content = await db.content.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED, deletedAt: null },
      include: contentInclude
    });
    if (content) return toMediaItem(content, 1);
  } catch {
    // fallback
  }
  return staticItems.find((i) => i.slug === slug) ?? null;
}

export async function findPublishedContentRecord(slug: string) {
  if (!isDbCatalog()) return null;

  try {
    return await db.content.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED, deletedAt: null },
      include: contentInclude
    });
  } catch {
    return null;
  }
}

export async function getAllPublishedSlugs() {
  if (!isDbCatalog()) return staticItems.map((i) => i.slug);

  try {
    const rows = await db.content.findMany({
      where: { status: ContentStatus.PUBLISHED, deletedAt: null },
      select: { slug: true }
    });
    if (rows.length) return rows.map((r) => r.slug);
  } catch {
    // fallback
  }
  return staticItems.map((i) => i.slug);
}

export function filterStatic(filters?: {
  type?: PrismaContentType;
  year?: number;
  search?: string;
  limit?: number;
  skip?: number;
  featured?: boolean;
  trending?: boolean;
}): MediaItem[] {
  const typeLabel =
    filters?.type === "WEB_SERIES"
      ? "Web Series"
      : filters?.type === "DUBBED_MOVIE"
        ? "Dubbed"
        : filters?.type === "MOVIE"
          ? "Movie"
          : undefined;

  let items = [...staticItems];
  if (typeLabel) items = items.filter((i) => i.type === typeLabel);
  if (filters?.year) items = items.filter((i) => i.year === filters.year);
  if (filters?.featured) items = items.filter((i) => i.id % 5 === 0);
  if (filters?.trending)
    items = items.filter((i) => i.id % 17 === 0 || i.year >= new Date().getFullYear() - 1);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((i) =>
      `${i.title} ${i.tamilTitle} ${i.genre} ${i.type}`.toLowerCase().includes(q)
    );
  }
  if (filters?.skip) items = items.slice(filters.skip);
  if (filters?.limit) items = items.slice(0, filters.limit);
  return items;
}

export function mapPublicType(type: ContentType) {
  return publicTypeToPrisma(type);
}

export { staticItems as fallbackMediaItems };
