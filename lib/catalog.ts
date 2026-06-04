import type { MediaItem } from "@/lib/types";
import { mediaItems } from "@/lib/catalog-data";
import {
  getPublishedContents,
  findPublishedBySlug,
  findPublishedContentRecord,
  getAllPublishedSlugs,
  mapPublicType
} from "@/lib/catalog-service";

export const navItems = [
  ["Home", "/#top"],
  ["Tamil Movies", "/#tamil-movies"],
  ["Web Series", "/#web-series"],
  ["Dubbed Movies", "/#dubbed-movies"],
  ["Trending", "/#trending"],
  ["Latest Updates", "/#latest"]
] as const;

export const archiveYears = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, index) => new Date().getFullYear() - index
);

export const categoryMap: Record<string, { title: string; filter: (item: MediaItem) => boolean }> = {
  movies: { title: "Tamil Movies", filter: (item) => item.type === "Movie" },
  "web-series": { title: "Web Series", filter: (item) => item.type === "Web Series" },
  dubbed: { title: "Dubbed Movies", filter: (item) => item.type === "Dubbed" },
  trending: {
    title: "Trending This Week",
    filter: (item) => item.id % 17 === 0 || item.year >= new Date().getFullYear() - 1
  },
  latest: { title: "Latest Updates", filter: (item) => item.year >= new Date().getFullYear() - 1 }
};

export async function findItem(slug: string) {
  const item = await findPublishedBySlug(slug);
  if (item) return item;
  return mediaItems.find((i) => i.slug === slug);
}

export async function getMediaItems() {
  try {
    const items = await getPublishedContents();
    if (items.length) return items;
  } catch {
    // static fallback
  }
  return mediaItems;
}

export { mediaItems, getPublishedContents, findPublishedContentRecord, getAllPublishedSlugs, mapPublicType };
