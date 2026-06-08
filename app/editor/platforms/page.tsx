import { redirect } from "next/navigation";
import { editorAuth } from "@/lib/auth/editor-auth";
import { db } from "@/lib/db";
import { ensureDefaultPlatforms } from "@/lib/admin/ensure-platforms";
import { PlatformManager } from "@/components/admin/platforms/PlatformManager";
import { canManageHomepage } from "@/lib/auth/permissions";

export const metadata = { title: "Streaming Platforms" };

export default async function EditorPlatformsPage() {
  const session = await editorAuth();
  if (!session?.user) redirect("/editor/login");
  if (!canManageHomepage({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/editor");
  }

  await ensureDefaultPlatforms();
  const platforms = await db.platform.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { contents: true } } }
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Streaming platforms</h1>
      <p className="mt-2 text-sm text-zinc-500">Manage where-to-watch platforms for TamilWave titles.</p>
      <div className="mt-8">
        <PlatformManager platforms={platforms} />
      </div>
    </div>
  );
}
