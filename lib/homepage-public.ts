import { HomepageSectionKey } from "@prisma/client";
import { getPublicHomepageData } from "@/lib/admin/homepage-service";
import { toMediaItem } from "@/lib/admin/content-mapper";
import type { MediaItem } from "@/lib/types";

export async function getSectionItems(key: HomepageSectionKey, limit = 10): Promise<MediaItem[]> {
  try {
    const { sections } = await getPublicHomepageData();
    const section = sections.find((s) => s.key === key);
    if (!section?.slots.length) return [];
    return section.slots
      .slice(0, limit)
      .map((slot, i) => toMediaItem(slot.content, i + 1));
  } catch {
    return [];
  }
}
