import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCMSAccess } from "@/lib/admin/session";

export async function GET(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const q = new URL(request.url).searchParams.get("q")?.trim();
  const genres = await db.genre.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { name: "asc" },
    take: 20
  });
  return NextResponse.json({ genres });
}

export async function POST(request: Request) {
  const { error } = await requireCMSAccess();
  if (error) return error;

  const { name } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const genre = await db.genre.upsert({
    where: { slug },
    update: {},
    create: { name: name.trim(), slug }
  });
  return NextResponse.json(genre);
}
