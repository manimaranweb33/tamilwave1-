import Link from "next/link";
import { redirect } from "next/navigation";
import { editorAuth } from "@/lib/auth/editor-auth";
import { canEditContent } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { getDashboardStats } from "@/lib/admin/content-queries";

export const metadata = { title: "Editor Dashboard" };

export default async function EditorDashboardPage() {
  const session = await editorAuth();
  if (!session?.user) redirect("/editor/login");

  const stats = await getDashboardStats();
  const recent = await db.content.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, title: true, type: true, status: true, slug: true }
  });

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Editor Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Manage movies, series, trailers and homepage sections</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/editor/movies" className="rounded-xl border border-line bg-panel p-4 hover:border-wave">
          <p className="text-xs text-zinc-500">Movies</p>
          <p className="text-2xl font-black">{stats.movies}</p>
        </Link>
        <Link href="/editor/series" className="rounded-xl border border-line bg-panel p-4 hover:border-wave">
          <p className="text-xs text-zinc-500">Web Series</p>
          <p className="text-2xl font-black">{stats.series}</p>
        </Link>
        <Link href="/editor/dubbed" className="rounded-xl border border-line bg-panel p-4 hover:border-wave">
          <p className="text-xs text-zinc-500">Dubbed</p>
          <p className="text-2xl font-black">{stats.dubbed}</p>
        </Link>
        <Link href="/editor/homepage" className="rounded-xl border border-line bg-panel p-4 hover:border-wave">
          <p className="text-xs text-zinc-500">Published</p>
          <p className="text-2xl font-black">{stats.published}</p>
        </Link>
      </div>

      {canEdit && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/editor/content/new?type=MOVIE" className="rounded-xl bg-wave px-4 py-2 text-sm font-black text-black">
            Add movie
          </Link>
          <Link href="/editor/homepage" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Homepage sections
          </Link>
          <Link href="/editor/platforms" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Platforms
          </Link>
        </div>
      )}

      <h2 className="mt-10 text-lg font-black">Recent content</h2>
      <ul className="mt-4 grid gap-2">
        {recent.map((row) => (
          <li key={row.id}>
            <Link href={`/editor/content/${row.id}`} className="text-sm font-bold hover:text-wave">
              {row.title}
            </Link>
            <span className="ml-2 text-xs text-zinc-500">{row.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
