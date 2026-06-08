import { db } from "@/lib/db";

export async function getUserWatchlist(userId: string) {
  return db.watchlistItem.findMany({
    where: { userId },
    include: {
      content: {
        select: {
          id: true,
          slug: true,
          title: true,
          posterUrl: true,
          type: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export async function toggleUserWatchlist(userId: string, contentId: string) {
  const existing = await db.watchlistItem.findUnique({
    where: { userId_contentId: { userId, contentId } }
  });

  if (existing) {
    await db.watchlistItem.delete({ where: { id: existing.id } });
    return { added: false };
  }

  await db.watchlistItem.create({ data: { userId, contentId } });
  return { added: true };
}

export async function syncLocalWatchlist(
  userId: string,
  items: { slug: string }[]
) {
  if (!items.length) return;

  const slugs = items.map((i) => i.slug);
  const contents = await db.content.findMany({
    where: { slug: { in: slugs }, deletedAt: null },
    select: { id: true, slug: true }
  });

  for (const content of contents) {
    await db.watchlistItem.upsert({
      where: { userId_contentId: { userId, contentId: content.id } },
      update: {},
      create: { userId, contentId: content.id }
    });
  }
}

export async function getUserRecentlyViewed(userId: string) {
  return db.recentlyViewed.findMany({
    where: { userId },
    include: {
      content: {
        select: {
          id: true,
          slug: true,
          title: true,
          posterUrl: true,
          type: true
        }
      }
    },
    orderBy: { viewedAt: "desc" }
  });
}

export async function trackUserRecentlyViewed(userId: string, contentId: string) {
  await db.recentlyViewed.upsert({
    where: { userId_contentId: { userId, contentId } },
    update: { viewedAt: new Date() },
    create: { userId, contentId }
  });
}

export async function syncLocalRecentlyViewed(
  userId: string,
  items: { slug: string }[]
) {
  if (!items.length) return;

  const slugs = items.map((i) => i.slug);
  const contents = await db.content.findMany({
    where: { slug: { in: slugs }, deletedAt: null },
    select: { id: true, slug: true }
  });

  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    await db.recentlyViewed.upsert({
      where: { userId_contentId: { userId, contentId: content.id } },
      update: { viewedAt: new Date(Date.now() - i * 1000) },
      create: { userId, contentId: content.id, viewedAt: new Date(Date.now() - i * 1000) }
    });
  }
}
