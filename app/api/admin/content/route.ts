import { NextResponse } from "next/server";
import { ContentStatus, ContentType, type Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireCMSAccess } from "@/lib/admin/session";
import { contentInclude, createContent } from "@/lib/admin/content-service";
import { contentToAdminJson } from "@/lib/admin/content-mapper";
import { logAudit } from "@/lib/admin/audit";
import { checkApiRateLimit } from "@/lib/admin/rate-limit";

export async function GET(request: Request) {
  const { user, error } = await requireCMSAccess();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type") as ContentType | null;
  const status = searchParams.get("status") as ContentStatus | null;
  const year = Number(searchParams.get("year")) || undefined;
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize")) || 20, 1), 50);

  const where: Prisma.ContentWhereInput = { deletedAt: null };
  if (type && Object.values(ContentType).includes(type)) where.type = type;
  if (status && Object.values(ContentStatus).includes(status)) where.status = status;
  if (year) where.year = year;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { tamilTitle: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { genre: { contains: q, mode: "insensitive" } },
      { sourceTitle: { contains: q, mode: "insensitive" } },
      { cast: { some: { person: { name: { contains: q, mode: "insensitive" } } } } }
    ];
  }

  const [items, total] = await Promise.all([
    db.content.findMany({
      where,
      include: contentInclude,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    db.content.count({ where })
  ]);

  return NextResponse.json({
    items: items.map(contentToAdminJson),
    total,
    page,
    pages: Math.ceil(total / pageSize)
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireCMSAccess();
  if (error) return error;
  const limitErr = checkApiRateLimit(`content-write:${user!.id}`);
  if (limitErr) return NextResponse.json({ error: limitErr }, { status: 429 });

  try {
    const body = await request.json();
    const item = await createContent(body);
    await logAudit({
      actorId: user!.id,
      action: "CREATE",
      entity: "Content",
      entityId: item?.id,
      metadata: { slug: item?.slug }
    });
    return NextResponse.json(contentToAdminJson(item!), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Validation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
