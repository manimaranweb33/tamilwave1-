import { ContentStatus, type Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  contentCreateSchema,
  contentUpdateSchema,
  validateSlug
} from "@/lib/validations/content";
import { isSlugTaken } from "@/lib/admin/content-queries";

const contentInclude = {
  genres: { include: { genre: true } },
  cast: { include: { person: true } },
  platforms: { include: { platform: true } },
  director: true
} as const;

export async function upsertGenresForContent(contentId: string, genreIds?: string[], fallbackGenre?: string) {
  await db.contentGenre.deleteMany({ where: { contentId } });
  const ids = genreIds?.length ? genreIds : [];
  if (ids.length) {
    await db.contentGenre.createMany({
      data: ids.map((genreId) => ({ contentId, genreId }))
    });
  } else if (fallbackGenre) {
    const slug = fallbackGenre.toLowerCase().replace(/\s+/g, "-");
    const genre = await db.genre.upsert({
      where: { slug },
      update: {},
      create: { name: fallbackGenre, slug }
    });
    await db.contentGenre.create({ data: { contentId, genreId: genre.id } });
  }
}

export async function syncCast(contentId: string, cast?: { personId: string; character?: string | null; sortOrder?: number }[]) {
  await db.contentCast.deleteMany({ where: { contentId } });
  if (!cast?.length) return;
  await db.contentCast.createMany({
    data: cast.map((c, i) => ({
      contentId,
      personId: c.personId,
      character: c.character,
      sortOrder: c.sortOrder ?? i,
      role: "ACTOR"
    }))
  });
}

export async function syncPlatforms(
  contentId: string,
  platforms?: { platformId: string; url: string }[]
) {
  await db.contentPlatform.deleteMany({ where: { contentId } });
  if (!platforms?.length) return;
  await db.contentPlatform.createMany({
    data: platforms.map((p) => ({ contentId, platformId: p.platformId, url: p.url }))
  });
}

function emptyToNull(value?: string | null) {
  return value && value.length > 0 ? value : null;
}

export async function createContent(body: unknown) {
  const parsed = contentCreateSchema.parse(body);
  const slugError = validateSlug(parsed.slug);
  if (slugError) throw new Error(slugError);
  if (await isSlugTaken(parsed.slug)) throw new Error("Slug already in use");

  const publishedAt =
    parsed.status === "PUBLISHED" ? new Date() : undefined;

  const content = await db.content.create({
    data: {
      title: parsed.title,
      tamilTitle: parsed.tamilTitle,
      slug: parsed.slug,
      description: parsed.description,
      year: parsed.year,
      type: parsed.type,
      genre: parsed.genre,
      language: parsed.language ?? "Tamil",
      country: emptyToNull(parsed.country),
      quality: parsed.quality,
      featured: parsed.featured ?? false,
      trending: parsed.trending ?? false,
      accent: parsed.accent ?? "#00c853",
      status: parsed.status ?? ContentStatus.DRAFT,
      publishedAt,
      posterUrl: emptyToNull(parsed.posterUrl),
      backdropUrl: emptyToNull(parsed.backdropUrl),
      trailerUrl: emptyToNull(parsed.trailerUrl),
      rating: parsed.rating,
      ratingCount: parsed.ratingCount,
      runtimeMinutes: parsed.runtimeMinutes,
      seriesSeasons: parsed.seriesSeasons,
      seriesEpisodes: parsed.seriesEpisodes,
      seriesStatus: emptyToNull(parsed.seriesStatus),
      originalLanguage: emptyToNull(parsed.originalLanguage),
      dubbedLanguage: emptyToNull(parsed.dubbedLanguage),
      sourceTitle: emptyToNull(parsed.sourceTitle),
      directorId: parsed.directorId || null,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      keywords: parsed.keywords ?? [],
      canonicalUrl: emptyToNull(parsed.canonicalUrl),
      ogImageUrl: emptyToNull(parsed.ogImageUrl)
    },
    include: contentInclude
  });

  await upsertGenresForContent(content.id, parsed.genreIds, parsed.genre);
  await syncCast(content.id, parsed.cast);
  await syncPlatforms(content.id, parsed.platforms);

  return db.content.findUnique({ where: { id: content.id }, include: contentInclude });
}

export async function updateContent(id: string, body: unknown) {
  const parsed = contentUpdateSchema.parse(body);
  if (parsed.slug) {
    const slugError = validateSlug(parsed.slug);
    if (slugError) throw new Error(slugError);
    if (await isSlugTaken(parsed.slug, id)) throw new Error("Slug already in use");
  }

  const existing = await db.content.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) throw new Error("Not found");

  const {
    genreIds: _g,
    cast: _c,
    platforms: _p,
    genre: genreField,
    ...rest
  } = parsed;
  const data: Prisma.ContentUpdateInput = { ...rest };
  if (genreField) data.genre = genreField;
  if (parsed.posterUrl === "") data.posterUrl = null;
  if (parsed.backdropUrl === "") data.backdropUrl = null;
  if (parsed.trailerUrl === "") data.trailerUrl = null;
  if (parsed.canonicalUrl === "") data.canonicalUrl = null;
  if (parsed.ogImageUrl === "") data.ogImageUrl = null;
  if (parsed.country === "") data.country = null;
  if (parsed.seriesStatus === "") data.seriesStatus = null;
  if (parsed.originalLanguage === "") data.originalLanguage = null;
  if (parsed.dubbedLanguage === "") data.dubbedLanguage = null;
  if (parsed.sourceTitle === "") data.sourceTitle = null;
  if (parsed.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    data.publishedAt = new Date();
  }
  if (parsed.status === "DRAFT") {
    data.publishedAt = null;
  }

  await db.content.update({ where: { id }, data });

  if (parsed.genreIds !== undefined || parsed.genre) {
    await upsertGenresForContent(id, parsed.genreIds, parsed.genre ?? existing.genre);
  }
  if (parsed.cast !== undefined) await syncCast(id, parsed.cast);
  if (parsed.platforms !== undefined) await syncPlatforms(id, parsed.platforms);

  return db.content.findUnique({ where: { id }, include: contentInclude });
}

export async function softDeleteContent(id: string) {
  return db.content.update({
    where: { id },
    data: { deletedAt: new Date(), status: ContentStatus.ARCHIVED }
  });
}

export async function bulkSoftDelete(ids: string[]) {
  return db.content.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { deletedAt: new Date(), status: ContentStatus.ARCHIVED }
  });
}

export async function archiveContent(id: string) {
  return softDeleteContent(id);
}

export async function bulkArchive(ids: string[]) {
  return bulkSoftDelete(ids);
}

export async function permanentDeleteContent(id: string) {
  const existing = await db.content.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");

  await db.$transaction([
    db.contentGenre.deleteMany({ where: { contentId: id } }),
    db.contentCast.deleteMany({ where: { contentId: id } }),
    db.contentPlatform.deleteMany({ where: { contentId: id } }),
    db.homepageSlot.deleteMany({ where: { contentId: id } }),
    db.watchlistItem.deleteMany({ where: { contentId: id } }),
    db.recentlyViewed.deleteMany({ where: { contentId: id } }),
    db.content.delete({ where: { id } })
  ]);
}

export async function bulkPermanentDelete(ids: string[]) {
  let count = 0;
  for (const id of ids) {
    try {
      await permanentDeleteContent(id);
      count += 1;
    } catch {
      // skip missing rows
    }
  }
  return { count };
}

export async function bulkUpdateStatus(ids: string[], status: ContentStatus) {
  return db.content.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: {
      status,
      publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null
    }
  });
}

export { contentInclude };
