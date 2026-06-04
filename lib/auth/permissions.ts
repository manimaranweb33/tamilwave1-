import type { UserRole } from "@prisma/client";

export type AdminUser = { id: string; email: string; role: UserRole; name?: string | null };

export function canViewAdmin(user: AdminUser | null | undefined) {
  return !!user;
}

export function canEditContent(user: AdminUser | null | undefined) {
  return user?.role === "SUPER_ADMIN" || user?.role === "EDITOR";
}

export function canManageUsers(user: AdminUser | null | undefined) {
  return user?.role === "SUPER_ADMIN";
}

export function canBulkDelete(user: AdminUser | null | undefined) {
  return user?.role === "SUPER_ADMIN" || user?.role === "EDITOR";
}

export function canManageHomepage(user: AdminUser | null | undefined) {
  return user?.role === "SUPER_ADMIN" || user?.role === "EDITOR";
}
