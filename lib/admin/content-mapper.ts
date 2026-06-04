import type { Content, ContentCast, ContentGenre, ContentPlatform, Genre, Person, Platform } from "@prisma/client";
import type { MediaItem, ContentType } from "@/lib/types";

type ContentWithRelations = Content & {
  genres?: (ContentGenre & { genre: Genre })[];
  cast?: (ContentCast & { person: Person })[];
  platforms?: (ContentPlatform & { platform: Platform })[];
  director?: Person | null;
};

const typeMap: Record<string, ContentType> = {
  MOVIE: "Movie",
  WEB_SERIES: "Web Series",
  DUBBED_MOVIE: "Dubbed",
  SONG: "Movie"
};

export function prismaTypeToPublic(type: string): ContentType {
  return typeMap[type] ?? "Movie";
}

export function publicTypeToPrisma(type: ContentType): "MOVIE" | "WEB_SERIES" | "DUBBED_MOVIE" {
  if (type === "Web Series") return "WEB_SERIES";
  if (type === "Dubbed") return "DUBBED_MOVIE";
  return "MOVIE";
}

export function toMediaItem(content: ContentWithRelations, index = 0): MediaItem {
  const genreNames = content.genres?.map((g) => g.genre.name).join(", ");
  return {
    id: index,
    slug: content.slug,
    title: content.title,
    tamilTitle: content.tamilTitle ?? content.title,
    year: content.year,
    type: prismaTypeToPublic(content.type),
    genre: genreNames || content.genre,
    quality: content.quality ?? "HD",
    accent: content.accent,
    posterUrl: content.posterUrl ?? undefined,
    description: content.description
  };
}

export function contentToAdminJson(content: ContentWithRelations) {
  return {
    ...content,
    genreList: content.genres?.map((g) => g.genre) ?? [],
    cast: content.cast?.map((c) => ({
      id: c.id,
      personId: c.personId,
      personName: c.person.name,
      character: c.character,
      sortOrder: c.sortOrder,
      role: c.role
    })),
    platforms: content.platforms?.map((p) => ({
      id: p.id,
      platformId: p.platformId,
      platformName: p.platform.name,
      url: p.url
    })),
    directorName: content.director?.name
  };
}
