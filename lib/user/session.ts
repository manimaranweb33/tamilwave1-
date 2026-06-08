import { userAuth } from "@/lib/auth/user-auth";
import { NextResponse } from "next/server";
import type { AuthUser } from "@/lib/auth/permissions";
import { isUserRole } from "@/lib/auth/permissions";

export async function getUserSession(): Promise<AuthUser | null> {
  const session = await userAuth();
  if (!session?.user?.id || !session.user.email) return null;
  if (!isUserRole(session.user.role)) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name,
    image: session.user.image ?? null
  };
}

export async function requireUserSession() {
  const user = await getUserSession();
  if (!user) {
    return { user: null as AuthUser | null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, error: null };
}
