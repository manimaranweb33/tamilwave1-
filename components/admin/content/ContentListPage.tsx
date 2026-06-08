import Link from "next/link";
import { redirect } from "next/navigation";
import { ContentType } from "@prisma/client";
import { adminAuth } from "@/lib/auth/admin-auth";
import { editorAuth } from "@/lib/auth/editor-auth";
import { listAdminContent } from "@/lib/admin/content-queries";
import { canEditContent } from "@/lib/auth/permissions";
import { ContentTable } from "@/components/admin/content/ContentTable";
import { Pagination } from "@/components/admin/ui/Pagination";

const TYPE_LABELS: Record<string, string> = {
  MOVIE: "Movies",
  WEB_SERIES: "Web Series",
  DUBBED_MOVIE: "Dubbed Content"
};

export async function ContentListPage({
  fixedType,
  basePath,
  searchParams,
  portal = "admin"
}: {
  fixedType?: ContentType;
  basePath: string;
  searchParams: { q?: string; type?: string; status?: string; page?: string };
  portal?: "admin" | "editor";
}) {
  const session = portal === "editor" ? await editorAuth() : await adminAuth();
  const loginPath = portal === "editor" ? "/editor/login" : "/admin/login";
  if (!session?.user) redirect(loginPath);

  const page = Math.max(Number(searchParams.page) || 1, 1);
  const { items, total, pages } = await listAdminContent({
    q: searchParams.q,
    type: fixedType ?? (searchParams.type as ContentType | undefined),
    status: searchParams.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
    page,
    pageSize: 20
  });

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  const title = fixedType ? TYPE_LABELS[fixedType] : "All Content";
  const contentBase = portal === "editor" ? "/editor/content" : "/admin/content";
  const newHref = fixedType ? `${contentBase}/new?type=${fixedType}` : `${contentBase}/new`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">{title}</h1>
          <p className="text-sm text-zinc-500">{total} items</p>
        </div>
        {canEdit && (
          <Link href={newHref} className="rounded-xl bg-wave px-4 py-2 text-sm font-black text-black">
            Add {fixedType === ContentType.WEB_SERIES ? "series" : fixedType === ContentType.DUBBED_MOVIE ? "dubbed title" : "movie"}
          </Link>
        )}
      </div>

      <form className="mt-6 flex flex-wrap gap-2" action={basePath} method="get">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search title, slug, genre…"
          className="min-w-[200px] flex-1 rounded-xl border border-line bg-panel px-4 py-2 text-sm"
        />
        {!fixedType && (
          <select name="type" defaultValue={searchParams.type} className="rounded-xl border border-line bg-panel px-3 py-2 text-sm">
            <option value="">All types</option>
            <option value="MOVIE">Movie</option>
            <option value="WEB_SERIES">Web Series</option>
            <option value="DUBBED_MOVIE">Dubbed</option>
          </select>
        )}
        <select name="status" defaultValue={searchParams.status} className="rounded-xl border border-line bg-panel px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button type="submit" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
          Search
        </button>
      </form>

      <div className="mt-6">
        <ContentTable items={items} canEdit={canEdit} editBasePath={contentBase} />
      </div>

      <Pagination
        page={page}
        pages={pages}
        basePath={basePath}
        searchParams={{
          q: searchParams.q,
          type: fixedType ?? searchParams.type,
          status: searchParams.status
        }}
      />
    </div>
  );
}
