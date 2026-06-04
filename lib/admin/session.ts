import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { AdminUser } from "@/lib/auth/permissions";
import { canViewAdmin, canEditContent, canManageUsers } from "@/lib/auth/permissions";

export async function getAdminSession(): Promise<AdminUser | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name
  };
}

export async function requireAdminSession() {
  const user = await getAdminSession();
  if (!canViewAdmin(user)) {
    return { user: null as AdminUser | null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, error: null };
}

export async function requireEditorSession() {
  const result = await requireAdminSession();
  if (result.error) return result;
  if (!canEditContent(result.user)) {
    return { user: result.user, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

export async function requireSuperAdminSession() {
  const result = await requireAdminSession();
  if (result.error) return result;
  if (!canManageUsers(result.user)) {
    return { user: result.user, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
