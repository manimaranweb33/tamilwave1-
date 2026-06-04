import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession, requireEditorSession } from "@/lib/admin/session";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const q = new URL(request.url).searchParams.get("q")?.trim();
  const people = await db.person.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { name: "asc" },
    take: 20
  });
  return NextResponse.json({ people });
}

export async function POST(request: Request) {
  const { error } = await requireEditorSession();
  if (error) return error;

  const { name, tamilName } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
  const person = await db.person.create({
    data: { name: name.trim(), tamilName, slug }
  });
  return NextResponse.json(person, { status: 201 });
}
