import type { ContentWithRelations } from "@/lib/admin/content-mapper";
import type { ContentFormData } from "@/lib/admin/content-form";

export function contentToFormInitial(item: ContentWithRelations): Partial<ContentFormData> {
  return {
    title: item.title,
    tamilTitle: item.tamilTitle ?? "",
    slug: item.slug,
    description: item.description,
    year: item.year,
    type: item.type,
    genre: item.genre,
    language: item.language,
    country: item.country ?? "",
    status: item.status,
    quality: item.quality ?? "HD",
    accent: item.accent,
    featured: item.featured,
    trending: item.trending,
    posterUrl: item.posterUrl ?? "",
    backdropUrl: item.backdropUrl ?? "",
    trailerUrl: item.trailerUrl ?? "",
    rating: item.rating?.toString() ?? "",
    ratingCount: item.ratingCount?.toString() ?? "",
    runtimeMinutes: item.runtimeMinutes?.toString() ?? "",
    seriesSeasons: item.seriesSeasons?.toString() ?? "",
    seriesEpisodes: item.seriesEpisodes?.toString() ?? "",
    seriesStatus: item.seriesStatus ?? "",
    originalLanguage: item.originalLanguage ?? "",
    dubbedLanguage: item.dubbedLanguage ?? "",
    sourceTitle: item.sourceTitle ?? "",
    metaTitle: item.metaTitle ?? "",
    metaDescription: item.metaDescription ?? "",
    keywords: item.keywords.join(", "),
    canonicalUrl: item.canonicalUrl ?? "",
    ogImageUrl: item.ogImageUrl ?? "",
    platforms:
      item.platforms?.map((p) => ({
        platformId: p.platformId,
        url: p.url,
        platformName: p.platform.name
      })) ?? []
  };
}
