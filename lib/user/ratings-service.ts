import { db } from "@/lib/db";

export async function getUserRatings(userId: string) {
  return db.userRating.findMany({
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
    orderBy: { updatedAt: "desc" }
  });
}

export async function upsertUserRating(userId: string, contentId: string, score: number) {
  return db.$transaction(async (tx) => {
    const rating = await tx.userRating.upsert({
      where: { userId_contentId: { userId, contentId } },
      update: { score },
      create: { userId, contentId, score }
    });

    const aggregate = await tx.userRating.aggregate({
      where: { contentId },
      _avg: { score: true },
      _count: { score: true }
    });

    await tx.content.update({
      where: { id: contentId },
      data: {
        rating: aggregate._avg.score,
        ratingCount: aggregate._count.score
      }
    });

    return {
      ...rating,
      averageRating: aggregate._avg.score,
      ratingCount: aggregate._count.score
    };
  });
}

export async function getUserRatingForContent(userId: string, contentId: string) {
  return db.userRating.findUnique({
    where: { userId_contentId: { userId, contentId } }
  });
}
