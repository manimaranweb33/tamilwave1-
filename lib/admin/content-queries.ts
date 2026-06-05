import { ContentStatus, ContentType, type Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export type ContentListFilters = {
  q?: string;
  type?: ContentType;
  status?: ContentStatus;
  page?: number;
  pageSize?: number;
};

export function buildContentWhere(filters: ContentListFilters): Prisma.ContentWhereInput {
  const where: Prisma.ContentWhereInput = { deletedAt: null };
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { tamilTitle: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { genre: { contains: q, mode: "insensitive" } },
      { sourceTitle: { contains: q, mode: "insensitive" } }
    ];
  }
  return where;
}

export async function listAdminContent(filters: ContentListFilters) {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 50);
  const where = buildContentWhere(filters);

  const [items, total] = await Promise.all([
    db.content.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        status: true,
        year: true,
        posterUrl: true,
        updatedAt: true
      }
    }),
    db.content.count({ where })
  ]);

  return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) || 1 };
}

export async function getDashboardStats() {
  const base = { deletedAt: null };
  const [
    movies,
    dubbed,
    series,
    published,
    draft,
    archived,
    mediaCount
  ] = await Promise.all([
    db.content.count({ where: { ...base, type: ContentType.MOVIE } }),
    db.content.count({ where: { ...base, type: ContentType.DUBBED_MOVIE } }),
    db.content.count({ where: { ...base, type: ContentType.WEB_SERIES } }),
    db.content.count({ where: { ...base, status: ContentStatus.PUBLISHED } }),
    db.content.count({ where: { ...base, status: ContentStatus.DRAFT } }),
    db.content.count({ where: { ...base, status: ContentStatus.ARCHIVED } }),
    db.mediaAsset.count()
  ]);

  return { movies, dubbed, series, published, draft, archived, mediaCount };
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  const existing = await db.content.findFirst({
    where: {
      slug,
      deletedAt: null,
      ...(excludeId ? { NOT: { id: excludeId } } : {})
    },
    select: { id: true }
  });
  return Boolean(existing);
}
