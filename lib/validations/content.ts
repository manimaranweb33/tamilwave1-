import { z } from "zod";

const contentType = z.enum(["MOVIE", "SONG", "WEB_SERIES", "DUBBED_MOVIE"]);
const contentStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

const optionalUrl = z
  .string()
  .url()
  .optional()
  .nullable()
  .or(z.literal(""));

const contentFields = {
  title: z.string().trim().min(1, "Title is required").max(200),
  tamilTitle: z.string().max(200).optional().nullable(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().trim().min(1, "Description is required"),
  year: z.coerce.number().int().min(1900, "Invalid year").max(2100, "Invalid year"),
  type: contentType,
  genre: z.string().trim().min(1, "Genre is required").max(100),
  genreIds: z.array(z.string()).optional(),
  language: z.string().max(50).optional(),
  country: z.string().max(80).optional().nullable(),
  quality: z.string().max(20).optional().nullable(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  accent: z.string().max(20).optional(),
  status: contentStatus.optional(),
  posterUrl: optionalUrl,
  backdropUrl: optionalUrl,
  trailerUrl: optionalUrl,
  rating: z.coerce.number().min(0).max(10).optional().nullable(),
  ratingCount: z.coerce.number().int().min(0).optional().nullable(),
  runtimeMinutes: z.coerce.number().int().min(1).optional().nullable(),
  seriesSeasons: z.coerce.number().int().min(1).optional().nullable(),
  seriesEpisodes: z.coerce.number().int().min(1).optional().nullable(),
  seriesStatus: z.string().max(40).optional().nullable(),
  originalLanguage: z.string().max(50).optional().nullable(),
  dubbedLanguage: z.string().max(50).optional().nullable(),
  sourceTitle: z.string().max(200).optional().nullable(),
  directorId: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  cast: z
    .array(
      z.object({
        personId: z.string(),
        character: z.string().optional().nullable(),
        sortOrder: z.number().int().optional()
      })
    )
    .optional(),
  platforms: z
    .array(
      z.object({
        platformId: z.string(),
        url: z.string().url("Platform link must be a valid URL")
      })
    )
    .optional()
};

export const contentCreateSchema = z.object(contentFields);

export const contentUpdateSchema = contentCreateSchema.partial();

export const bulkStatusSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1)
});

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "search",
  "contact",
  "privacy",
  "dmca",
  "title",
  "category",
  "archive"
]);

export function validateSlug(slug: string) {
  if (RESERVED_SLUGS.has(slug)) {
    return "This slug is reserved";
  }
  return null;
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
