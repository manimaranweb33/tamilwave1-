import { HomepageSectionKey } from "@prisma/client";
import { db } from "@/lib/db";

const SECTION_TITLES: Record<HomepageSectionKey, string> = {
  HERO: "Hero",
  TRENDING: "Trending This Week",
  TOP_TAMIL_MOVIES: "Top 10 Tamil Movies",
  TOP_DUBBED: "Top 10 Tamil Dubbed Movies",
  FEATURED: "Featured Content"
};

export async function ensureHomepageSections() {
  for (const key of Object.values(HomepageSectionKey)) {
    await db.homepageSection.upsert({
      where: { key },
      update: {},
      create: { key, title: SECTION_TITLES[key], active: true }
    });
  }
}

export async function getHomepageSections() {
  await ensureHomepageSections();
  return db.homepageSection.findMany({
    include: {
      slots: {
        include: { content: true },
        orderBy: { position: "asc" }
      }
    },
    orderBy: { key: "asc" }
  });
}

export async function updateSectionSlots(
  sectionKey: HomepageSectionKey,
  slots: { contentId: string; position: number; active?: boolean; overrideTitle?: string | null; overrideImage?: string | null }[]
) {
  const section = await db.homepageSection.findUnique({ where: { key: sectionKey } });
  if (!section) throw new Error("Section not found");

  await db.homepageSlot.deleteMany({ where: { sectionId: section.id } });
  if (slots.length) {
    await db.homepageSlot.createMany({
      data: slots.map((s) => ({
        sectionId: section.id,
        contentId: s.contentId,
        position: s.position,
        active: s.active ?? true,
        overrideTitle: s.overrideTitle,
        overrideImage: s.overrideImage
      }))
    });
  }
  return getHomepageSections();
}

export async function getActiveHero() {
  const now = new Date();
  return db.heroBanner.findFirst({
    where: {
      active: true,
      OR: [
        { startsAt: null, endsAt: null },
        { startsAt: { lte: now }, endsAt: null },
        { startsAt: null, endsAt: { gte: now } },
        { startsAt: { lte: now }, endsAt: { gte: now } }
      ]
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getPublicHomepageData() {
  await ensureHomepageSections();
  const [sections, hero] = await Promise.all([
    db.homepageSection.findMany({
      where: { active: true },
      include: {
        slots: {
          where: { active: true },
          include: {
            content: {
              include: {
                genres: { include: { genre: true } }
              }
            }
          },
          orderBy: { position: "asc" }
        }
      }
    }),
    getActiveHero()
  ]);
  return { sections, hero };
}
