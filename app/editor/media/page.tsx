import { redirect } from "next/navigation";
import { editorAuth } from "@/lib/auth/editor-auth";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "Media Library" };

export default async function EditorMediaPage() {
  const session = await editorAuth();
  if (!session?.user) redirect("/editor/login");
  if (!canEditContent({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/editor");
  }

  return (
    <div>
      <h1 className="text-2xl font-black">Media library</h1>
      <p className="mt-2 text-sm text-zinc-500">Upload posters, backdrops, and images.</p>
      <div className="mt-8">
        <MediaLibrary />
      </div>
    </div>
  );
}
