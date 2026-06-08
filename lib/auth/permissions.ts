import type { UserRole } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  image?: string | null;
};

export function isUserRole(role: UserRole) {
  return role === "USER";
}

export function isEditorRole(role: UserRole) {
  return role === "EDITOR" || role === "ADMIN";
}

export function isAdminRole(role: UserRole) {
  return role === "ADMIN";
}

export function canAccessAdmin(user: AuthUser | null | undefined) {
  return user?.role === "ADMIN";
}

export function canAccessEditor(user: AuthUser | null | undefined) {
  return user?.role === "EDITOR" || user?.role === "ADMIN";
}

export function canEditContent(user: AuthUser | null | undefined) {
  return user?.role === "EDITOR" || user?.role === "ADMIN";
}

export function canManageUsers(user: AuthUser | null | undefined) {
  return user?.role === "ADMIN";
}

export function canBulkDelete(user: AuthUser | null | undefined) {
  return user?.role === "EDITOR" || user?.role === "ADMIN";
}

export function canManageHomepage(user: AuthUser | null | undefined) {
  return user?.role === "EDITOR" || user?.role === "ADMIN";
}

export function canManageSettings(user: AuthUser | null | undefined) {
  return user?.role === "ADMIN";
}
