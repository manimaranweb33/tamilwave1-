import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/auth/admin-auth";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminSessionProvider } from "@/components/auth/AdminSessionProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await adminAuth();
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen bg-ink text-white">
        <AdminSidebar role={session.user.role} />
        <div className="flex flex-1 flex-col">
          <AdminHeader email={session.user.email ?? ""} role={session.user.role} />
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
