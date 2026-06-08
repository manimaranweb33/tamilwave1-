import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

export async function verifyCredentials(
  email: string,
  password: string,
  allowedRoles: UserRole[]
) {
  const normalized = email.toLowerCase().trim();
  const user = await db.user.findUnique({ where: { email: normalized } });
  if (!user?.passwordHash) return null;
  if (!allowedRoles.includes(user.role)) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
