import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCMSAccess } from "@/lib/admin/session";

export async function GET(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize")) || 24, 1), 60);
  const kind = searchParams.get("kind");

  const where =
    kind === "poster"
      ? { mimeType: { startsWith: "image/" } }
      : kind === "backdrop"
        ? { mimeType: { startsWith: "image/" } }
        : { mimeType: { startsWith: "image/" } };

  const [items, total] = await Promise.all([
    db.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        uploadedBy: { select: { email: true, name: true } }
      }
    }),
    db.mediaAsset.count({ where })
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / pageSize) || 1
  });
}
