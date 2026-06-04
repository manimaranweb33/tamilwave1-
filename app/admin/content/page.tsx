import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ContentStatus, ContentType, type Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ContentTable } from "@/components/admin/content/ContentTable";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "Content" };

export default async function AdminContentPage({
  searchParams
}: {
  searchParams: { q?: string; type?: string; status?: string; page?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const page = Math.max(Number(searchParams.page) || 1, 1);
  const pageSize = 20;
  const where: Prisma.ContentWhereInput = { deletedAt: null };
  if (searchParams.type && Object.values(ContentType).includes(searchParams.type as ContentType)) {
    where.type = searchParams.type as ContentType;
  }
  if (searchParams.status && Object.values(ContentStatus).includes(searchParams.status as ContentStatus)) {
    where.status = searchParams.status as ContentStatus;
  }
  if (searchParams.q?.trim()) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { slug: { contains: searchParams.q, mode: "insensitive" } }
    ];
  }

  const [items, total] = await Promise.all([
    db.content.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, title: true, slug: true, type: true, status: true, year: true }
    }),
    db.content.count({ where })
  ]);

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Content</h1>
          <p className="text-sm text-zinc-500">{total} items</p>
        </div>
        {canEdit && (
          <Link href="/admin/content/new" className="rounded-xl bg-wave px-4 py-2 text-sm font-black text-black">
            Add content
          </Link>
        )}
      </div>

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search…"
          className="rounded-xl border border-line bg-panel px-4 py-2 text-sm"
        />
        <select name="type" defaultValue={searchParams.type} className="rounded-xl border border-line bg-panel px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="MOVIE">Movie</option>
          <option value="WEB_SERIES">Web Series</option>
          <option value="DUBBED_MOVIE">Dubbed</option>
        </select>
        <select name="status" defaultValue={searchParams.status} className="rounded-xl border border-line bg-panel px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button type="submit" className="rounded-xl border border-line px-4 py-2 text-sm font-bold">
          Filter
        </button>
      </form>

      <div className="mt-6">
        <ContentTable items={items} canEdit={canEdit} />
      </div>
    </div>
  );
}
