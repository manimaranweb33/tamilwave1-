import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getCMSession, requireCMSAccess } from "@/lib/admin/session";
import { db } from "@/lib/db";
import { createContent } from "@/lib/admin/content-service";

/** Legacy/script API — prefer /api/admin/content */
export async function GET(request: Request) {
  const session = await getCMSession();
  if (!session) {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
  }

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year")) || undefined;
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const pageSize = 20;
  const where = year ? { year, deletedAt: null } : { deletedAt: null };
  const [items, total] = await Promise.all([
    db.content.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    db.content.count({ where })
  ]);
  return NextResponse.json({ items, total, page, pages: Math.ceil(total / pageSize) });
}

export async function POST(request: Request) {
  const session = await requireCMSAccess();
  const bearer = requireAdmin(request);
  if (session.error && bearer) return bearer;
  if (session.error) return session.error;

  try {
    const body = await request.json();
    const item = await createContent(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 400 });
  }
}
