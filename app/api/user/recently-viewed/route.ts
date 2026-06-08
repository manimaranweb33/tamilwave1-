import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user/session";
import {
  getUserRecentlyViewed,
  trackUserRecentlyViewed
} from "@/lib/user/watchlist-service";
import { db } from "@/lib/db";

export async function GET() {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const items = await getUserRecentlyViewed(user!.id);
  return NextResponse.json({
    items: items.map((item) => ({
      slug: item.content.slug,
      title: item.content.title,
      posterUrl: item.content.posterUrl,
      type: item.content.type
    }))
  });
}

export async function POST(req: Request) {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const content = await db.content.findFirst({
    where: { slug, deletedAt: null },
    select: { id: true }
  });
  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  await trackUserRecentlyViewed(user!.id, content.id);
  return NextResponse.json({ ok: true });
}
