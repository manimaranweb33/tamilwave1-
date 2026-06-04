import { NextResponse } from "next/server";
import { ContentStatus, ContentType } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/session";
import { checkApiRateLimit } from "@/lib/admin/rate-limit";

export async function GET() {
  const { user, error } = await requireAdminSession();
  if (error) return error;
  const limitErr = checkApiRateLimit(`dashboard:${user!.id}`);
  if (limitErr) return NextResponse.json({ error: limitErr }, { status: 429 });

  const baseWhere = { deletedAt: null };
  const [moviePub, movieDraft, seriesPub, seriesDraft, dubbedPub, dubbedDraft, recent] =
    await Promise.all([
      db.content.count({ where: { ...baseWhere, type: ContentType.MOVIE, status: ContentStatus.PUBLISHED } }),
      db.content.count({ where: { ...baseWhere, type: ContentType.MOVIE, status: ContentStatus.DRAFT } }),
      db.content.count({
        where: { ...baseWhere, type: ContentType.WEB_SERIES, status: ContentStatus.PUBLISHED }
      }),
      db.content.count({ where: { ...baseWhere, type: ContentType.WEB_SERIES, status: ContentStatus.DRAFT } }),
      db.content.count({
        where: { ...baseWhere, type: ContentType.DUBBED_MOVIE, status: ContentStatus.PUBLISHED }
      }),
      db.content.count({ where: { ...baseWhere, type: ContentType.DUBBED_MOVIE, status: ContentStatus.DRAFT } }),
      db.content.findMany({
        where: baseWhere,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, type: true, status: true, createdAt: true, slug: true }
      })
    ]);

  return NextResponse.json({
    counts: {
      movies: { published: moviePub, draft: movieDraft },
      webSeries: { published: seriesPub, draft: seriesDraft },
      dubbed: { published: dubbedPub, draft: dubbedDraft }
    },
    recent
  });
}
