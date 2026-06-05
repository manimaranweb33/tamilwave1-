import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { ensureDefaultPlatforms } from "@/lib/admin/ensure-platforms";
import { PlatformManager } from "@/components/admin/platforms/PlatformManager";
import { canManageHomepage } from "@/lib/auth/permissions";

export const metadata = { title: "Streaming Platforms" };

export default async function AdminPlatformsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageHomepage({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/admin");
  }

  await ensureDefaultPlatforms();
  const platforms = await db.platform.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { contents: true } } }
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Streaming platforms</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Manage where-to-watch platforms linked to movies, series, and dubbed titles.
      </p>
      <div className="mt-8">
        <PlatformManager platforms={platforms} />
      </div>
    </div>
  );
}
