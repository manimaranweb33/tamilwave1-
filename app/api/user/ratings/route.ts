import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user/session";
import { getUserRatingForContent, getUserRatings, upsertUserRating } from "@/lib/user/ratings-service";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const content = await db.content.findFirst({
      where: { slug, deletedAt: null },
      select: { id: true, rating: true, ratingCount: true }
    });
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    const rating = await getUserRatingForContent(user!.id, content.id);
    return NextResponse.json({
      score: rating?.score ?? null,
      averageRating: content.rating,
      ratingCount: content.ratingCount ?? 0
    });
  }

  const ratings = await getUserRatings(user!.id);
  return NextResponse.json({
    items: ratings.map((r) => ({
      score: r.score,
      slug: r.content.slug,
      title: r.content.title,
      posterUrl: r.content.posterUrl,
      type: r.content.type
    }))
  });
}

export async function POST(req: Request) {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  const score = Number(body?.score);

  if (!slug || !Number.isInteger(score) || score < 1 || score > 10) {
    return NextResponse.json({ error: "Valid slug and score (1-10) required" }, { status: 400 });
  }

  const content = await db.content.findFirst({
    where: { slug, deletedAt: null },
    select: { id: true }
  });
  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  const rating = await upsertUserRating(user!.id, content.id, score);
  return NextResponse.json({
    score: rating.score,
    averageRating: rating.averageRating,
    ratingCount: rating.ratingCount
  });
}
