import { z } from "zod";

const contentType = z.enum(["MOVIE", "SONG", "WEB_SERIES", "DUBBED_MOVIE"]);
const contentStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const contentCreateSchema = z.object({
  title: z.string().min(1).max(200),
  tamilTitle: z.string().max(200).optional().nullable(),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1),
  year: z.coerce.number().int().min(1900).max(2100),
  type: contentType,
  genre: z.string().min(1).max(100),
  genreIds: z.array(z.string()).optional(),
  language: z.string().max(50).optional(),
  quality: z.string().max(20).optional().nullable(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  accent: z.string().max(20).optional(),
  status: contentStatus.optional(),
  posterUrl: z.string().url().optional().nullable().or(z.literal("")),
  trailerUrl: z.string().url().optional().nullable().or(z.literal("")),
  rating: z.coerce.number().min(0).max(10).optional().nullable(),
  ratingCount: z.coerce.number().int().min(0).optional().nullable(),
  runtimeMinutes: z.coerce.number().int().min(1).optional().nullable(),
  directorId: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional().nullable().or(z.literal("")),
  ogImageUrl: z.string().url().optional().nullable().or(z.literal("")),
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
    .array(z.object({ platformId: z.string(), url: z.string().url() }))
    .optional()
});

export const contentUpdateSchema = contentCreateSchema.partial();

export const bulkStatusSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1)
});

export const RESERVED_SLUGS = new Set(["admin", "api", "search", "contact", "privacy", "dmca", "title", "category", "archive"]);

export function validateSlug(slug: string) {
  if (RESERVED_SLUGS.has(slug)) {
    return "This slug is reserved";
  }
  return null;
}
