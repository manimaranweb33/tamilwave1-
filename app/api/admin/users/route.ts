import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/admin/session";

export async function GET() {
  const { error } = await requireSuperAdminSession();
  if (error) return error;

  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const { error } = await requireSuperAdminSession();
  if (error) return error;

  const { email, password, name, role } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      name,
      passwordHash,
      role: (role as UserRole) ?? UserRole.EDITOR
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });
  return NextResponse.json(user, { status: 201 });
}
