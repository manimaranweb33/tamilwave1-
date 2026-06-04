import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { canManageUsers } from "@/lib/auth/permissions";
import { UsersManager } from "@/components/admin/users/UsersManager";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageUsers({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/admin");
  }

  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Users</h1>
      <p className="text-sm text-zinc-500">Super admin only</p>
      <div className="mt-6">
        <UsersManager users={users} />
      </div>
    </div>
  );
}
