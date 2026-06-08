import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user/session";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional()
});

export async function GET() {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const profile = await db.user.findUnique({
    where: { id: user!.id },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true }
  });

  return NextResponse.json({ user: profile });
}

export async function PATCH(req: Request) {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: user!.id },
    data: parsed.data,
    select: { id: true, name: true, email: true, image: true, createdAt: true }
  });

  return NextResponse.json({ user: updated });
}
