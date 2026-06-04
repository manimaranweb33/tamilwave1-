import type { MetadataRoute } from "next";
import { archiveYears } from "@/lib/catalog";
import { getAllPublishedSlugs } from "@/lib/catalog-service";
import { mediaItems } from "@/lib/catalog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticPages = [
    "",
    "/contact",
    "/privacy",
    "/dmca",
    "/category/movies",
    "/category/web-series",
    "/category/dubbed",
    "/category/trending",
    "/category/latest"
  ];

  let slugs: string[] = [];
  try {
    slugs = await getAllPublishedSlugs();
  } catch {
    slugs = mediaItems.map((i) => i.slug);
  }

  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() })),
    ...archiveYears.map((year) => ({ url: `${baseUrl}/archive/${year}`, lastModified: new Date() })),
    ...slugs.map((slug) => ({ url: `${baseUrl}/title/${slug}`, lastModified: new Date() }))
  ];
}
