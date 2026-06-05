export type ContentType = "Movie" | "Web Series" | "Dubbed";

export type MediaItem = {
  id: number;
  slug: string;
  title: string;
  tamilTitle: string;
  year: number;
  type: ContentType;
  genre: string;
  quality: string;
  accent: string;
  posterUrl?: string;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  description: string;
  rating?: number | null;
  ratingCount?: number | null;
  runtimeMinutes?: number | null;
  releaseStatus?: string | null;
  dbId?: string;
};
