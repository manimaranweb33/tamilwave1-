export type ContentFormPlatform = {
  platformId: string;
  url: string;
  platformName?: string;
};

export type ContentFormData = {
  title: string;
  tamilTitle: string;
  slug: string;
  description: string;
  year: number;
  type: string;
  genre: string;
  language: string;
  country: string;
  status: string;
  quality: string;
  accent: string;
  featured: boolean;
  trending: boolean;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  rating: string;
  ratingCount: string;
  runtimeMinutes: string;
  seriesSeasons: string;
  seriesEpisodes: string;
  seriesStatus: string;
  originalLanguage: string;
  dubbedLanguage: string;
  sourceTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  platforms: ContentFormPlatform[];
};

export const emptyContentForm = (type = "MOVIE"): ContentFormData => ({
  title: "",
  tamilTitle: "",
  slug: "",
  description: "",
  year: new Date().getFullYear(),
  type,
  genre: "Drama",
  language: "Tamil",
  country: "India",
  status: "DRAFT",
  quality: "HD",
  accent: "#00c853",
  featured: false,
  trending: false,
  posterUrl: "",
  backdropUrl: "",
  trailerUrl: "",
  rating: "",
  ratingCount: "",
  runtimeMinutes: "",
  seriesSeasons: "",
  seriesEpisodes: "",
  seriesStatus: "Ongoing",
  originalLanguage: "",
  dubbedLanguage: "Tamil",
  sourceTitle: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  ogImageUrl: "",
  platforms: []
});

export type PlatformOption = { id: string; name: string; slug: string };
