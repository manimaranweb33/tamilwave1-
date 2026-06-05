import { cache } from "react";
import { ContentStatus, HomepageSectionKey } from "@prisma/client";
import type { HeroBanner, HomepageSlot } from "@prisma/client";
import { getActiveHero, getPublicHomepageData } from "@/lib/admin/homepage-service";
import { toMediaItem } from "@/lib/admin/content-mapper";
import type { ContentWithRelations } from "@/lib/admin/content-mapper";
import { getPublishedContents } from "@/lib/catalog-service";
import { getMediaItems } from "@/lib/catalog";
import { DEFAULT_HERO, HOMEPAGE_SECTION_LIMITS, RECENTLY_ADDED_LIMIT } from "@/lib/homepage-config";
import type { MediaItem } from "@/lib/types";

export type PublicHero = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImageUrl: string | null;
};

type SlotWithContent = HomepageSlot & {
  content: ContentWithRelations;
};

const getHomepageDataCached = cache(() => getPublicHomepageData());
const getHeroCached = cache(() => getActiveHero());

function isPublishedContent(content: ContentWithRelations) {
  return content.status === ContentStatus.PUBLISHED && content.deletedAt == null;
}

function slotToMediaItem(slot: SlotWithContent, index: number): MediaItem | null {
  if (!isPublishedContent(slot.content)) return null;
  const item = toMediaItem(slot.content, index);
  if (slot.overrideTitle) item.title = slot.overrideTitle;
  if (slot.overrideImage) item.posterUrl = slot.overrideImage;
  return item;
}

export async function getPublicHero(): Promise<PublicHero> {
  try {
    const hero: HeroBanner | null = await getHeroCached();
    if (hero?.title) {
      return {
        title: hero.title,
        subtitle: hero.subtitle ?? DEFAULT_HERO.subtitle,
        ctaLabel: hero.ctaLabel ?? DEFAULT_HERO.ctaLabel,
        ctaHref: hero.ctaHref ?? DEFAULT_HERO.ctaHref,
        backgroundImageUrl: hero.backgroundImageUrl
      };
    }
  } catch {
    // DB optional during dev
  }
  return { ...DEFAULT_HERO };
}

export async function getSectionItems(key: HomepageSectionKey, limit = 10): Promise<MediaItem[]> {
  const max = HOMEPAGE_SECTION_LIMITS[key] ?? limit;
  const take = Math.min(limit, max);

  try {
    const { sections } = await getHomepageDataCached();
    const section = sections.find((s) => s.key === key);
    if (!section?.slots.length) return [];

    const items: MediaItem[] = [];
    for (const slot of section.slots) {
      if (items.length >= take) break;
      const mapped = slotToMediaItem(slot as SlotWithContent, items.length + 1);
      if (mapped) items.push(mapped);
    }
    return items;
  } catch {
    return [];
  }
}

export async function getCuratedSectionItems(
  key: HomepageSectionKey,
  fallback: (items: MediaItem[]) => MediaItem[]
): Promise<MediaItem[]> {
  const limit = HOMEPAGE_SECTION_LIMITS[key] ?? 10;
  const curated = await getSectionItems(key, limit);
  if (curated.length > 0) return curated.slice(0, limit);
  const mediaItems = await getMediaItems();
  return fallback(mediaItems).slice(0, limit);
}

export const getRecentlyAdded = cache(async (limit = RECENTLY_ADDED_LIMIT): Promise<MediaItem[]> => {
  try {
    const items = await getPublishedContents({ limit });
    if (items.length > 0) return items.slice(0, limit);
  } catch {
    // fallback below
  }
  const mediaItems = await getMediaItems();
  return [...mediaItems].sort((a, b) => b.year - a.year).slice(0, limit);
});
