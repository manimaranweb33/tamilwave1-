import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/admin/session";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { error } = await requireSuperAdminSession();
  if (error) return error;

  const { name, role, password } = await request.json();
  const data: { name?: string; role?: UserRole; passwordHash?: string } = {};
  if (name !== undefined) data.name = name;
  if (role && Object.values(UserRole).includes(role)) data.role = role;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.update({
    where: { id: params.id },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });
  return NextResponse.json(user);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { error } = await requireSuperAdminSession();
  if (error) return error;
  await db.user.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
