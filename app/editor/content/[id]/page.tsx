import { redirect, notFound } from "next/navigation";
import { editorAuth } from "@/lib/auth/editor-auth";
import { db } from "@/lib/db";
import { contentInclude } from "@/lib/admin/content-service";
import { contentToFormInitial } from "@/lib/admin/content-form-map";
import { ContentForm } from "@/components/admin/content/ContentForm";
import { ContentActions } from "@/components/admin/content/ContentActions";
import { canEditContent } from "@/lib/auth/permissions";
import { ensureDefaultPlatforms } from "@/lib/admin/ensure-platforms";

export const metadata = { title: "Edit content" };

export default async function EditorEditContentPage({ params }: { params: { id: string } }) {
  const session = await editorAuth();
  if (!session?.user) redirect("/editor/login");

  const [item, platforms] = await Promise.all([
    db.content.findFirst({
      where: { id: params.id, deletedAt: null },
      include: contentInclude
    }),
    ensureDefaultPlatforms().then(() =>
      db.platform.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } })
    )
  ]);

  if (!item) notFound();

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Edit: {item.title}</h1>
      <ContentActions contentId={item.id} status={item.status} canEdit={canEdit} />
      <div className="mt-2">
        <ContentForm
          initial={contentToFormInitial(item)}
          contentId={item.id}
          readOnly={!canEdit}
          platforms={platforms}
        />
      </div>
    </div>
  );
}
