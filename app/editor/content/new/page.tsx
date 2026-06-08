import { redirect } from "next/navigation";
import { ContentType } from "@prisma/client";
import { editorAuth } from "@/lib/auth/editor-auth";
import { db } from "@/lib/db";
import { ContentForm } from "@/components/admin/content/ContentForm";
import { canEditContent } from "@/lib/auth/permissions";
import { ensureDefaultPlatforms } from "@/lib/admin/ensure-platforms";

export const metadata = { title: "New content" };

const ALLOWED_TYPES = new Set<string>([
  ContentType.MOVIE,
  ContentType.WEB_SERIES,
  ContentType.DUBBED_MOVIE
]);

export default async function EditorNewContentPage({
  searchParams
}: {
  searchParams: { type?: string };
}) {
  const session = await editorAuth();
  if (!session?.user) redirect("/editor/login");
  if (!canEditContent({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/editor/content");
  }

  const type =
    searchParams.type && ALLOWED_TYPES.has(searchParams.type)
      ? searchParams.type
      : ContentType.MOVIE;

  await ensureDefaultPlatforms();
  const platforms = await db.platform.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true }
  });

  const titles: Record<string, string> = {
    MOVIE: "Add movie",
    WEB_SERIES: "Add web series",
    DUBBED_MOVIE: "Add dubbed content"
  };

  return (
    <div>
      <h1 className="text-2xl font-black">{titles[type] ?? "Add content"}</h1>
      <div className="mt-6">
        <ContentForm initial={{ type }} platforms={platforms} />
      </div>
    </div>
  );
}
