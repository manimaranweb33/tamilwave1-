import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { contentInclude } from "@/lib/admin/content-service";
import { ContentForm } from "@/components/admin/content/ContentForm";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "Edit content" };

export default async function EditContentPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const item = await db.content.findFirst({
    where: { id: params.id, deletedAt: null },
    include: contentInclude
  });
  if (!item) notFound();

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  const initial = {
    title: item.title,
    tamilTitle: item.tamilTitle ?? "",
    slug: item.slug,
    description: item.description,
    year: item.year,
    type: item.type,
    genre: item.genre,
    status: item.status,
    quality: item.quality ?? "HD",
    accent: item.accent,
    featured: item.featured,
    trending: item.trending,
    posterUrl: item.posterUrl ?? "",
    trailerUrl: item.trailerUrl ?? "",
    rating: item.rating?.toString() ?? "",
    ratingCount: item.ratingCount?.toString() ?? "",
    runtimeMinutes: item.runtimeMinutes?.toString() ?? "",
    metaTitle: item.metaTitle ?? "",
    metaDescription: item.metaDescription ?? "",
    keywords: item.keywords.join(", "),
    canonicalUrl: item.canonicalUrl ?? "",
    ogImageUrl: item.ogImageUrl ?? ""
  };

  return (
    <div>
      <h1 className="text-2xl font-black">Edit: {item.title}</h1>
      <div className="mt-6">
        <ContentForm initial={initial} contentId={item.id} readOnly={!canEdit} />
      </div>
    </div>
  );
}
