import { adminAuth } from "@/lib/auth/admin-auth";
import { editorAuth } from "@/lib/auth/editor-auth";
import { NextResponse } from "next/server";
import type { AuthUser } from "@/lib/auth/permissions";
import {
  canAccessAdmin,
  canAccessEditor,
  canEditContent,
  canManageUsers
} from "@/lib/auth/permissions";

export async function getAdminSession(): Promise<AuthUser | null> {
  const session = await adminAuth();
  if (!session?.user?.id || !session.user.email) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name
  };
}

export async function getEditorSession(): Promise<AuthUser | null> {
  const session = await editorAuth();
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
  if (!canAccessAdmin(user)) {
    return { user: null as AuthUser | null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, error: null };
}

export async function getCMSession(): Promise<AuthUser | null> {
  const admin = await getAdminSession();
  if (canAccessAdmin(admin)) return admin;
  const editor = await getEditorSession();
  if (canAccessEditor(editor)) return editor;
  return null;
}

export async function requireCMSAccess() {
  const user = await getCMSession();
  if (!canEditContent(user)) {
    return { user: null as AuthUser | null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, error: null };
}

/** @deprecated Use requireCMSAccess */
export async function requireEditorSession() {
  return requireCMSAccess();
}

export async function requireEditorCMSAccess() {
  return requireCMSAccess();
}

export async function requireSuperAdminSession() {
  const result = await requireAdminSession();
  if (result.error) return result;
  if (!canManageUsers(result.user)) {
    return { user: result.user, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
