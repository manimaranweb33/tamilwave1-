import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canEditContent({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/admin");
  }

  return (
    <div>
      <h1 className="text-2xl font-black">Media library</h1>
      <p className="mt-2 text-sm text-zinc-500">Posters, backdrops, and images uploaded through the CMS.</p>
      <div className="mt-8">
        <MediaLibrary />
      </div>
    </div>
  );
}
