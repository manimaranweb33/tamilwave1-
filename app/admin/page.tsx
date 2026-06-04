import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ContentStatus, ContentType } from "@prisma/client";
import { db } from "@/lib/db";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const baseWhere = { deletedAt: null };
  const [moviePub, movieDraft, seriesPub, seriesDraft, dubbedPub, dubbedDraft, recent] =
    await Promise.all([
      db.content.count({ where: { ...baseWhere, type: ContentType.MOVIE, status: ContentStatus.PUBLISHED } }),
      db.content.count({ where: { ...baseWhere, type: ContentType.MOVIE, status: ContentStatus.DRAFT } }),
      db.content.count({
        where: { ...baseWhere, type: ContentType.WEB_SERIES, status: ContentStatus.PUBLISHED }
      }),
      db.content.count({ where: { ...baseWhere, type: ContentType.WEB_SERIES, status: ContentStatus.DRAFT } }),
      db.content.count({
        where: { ...baseWhere, type: ContentType.DUBBED_MOVIE, status: ContentStatus.PUBLISHED }
      }),
      db.content.count({ where: { ...baseWhere, type: ContentType.DUBBED_MOVIE, status: ContentStatus.DRAFT } }),
      db.content.findMany({
        where: baseWhere,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, type: true, status: true, slug: true, createdAt: true }
      })
    ]);

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">TamilWave content overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tamil Movies" published={moviePub} draft={movieDraft} />
        <StatCard label="Web Series" published={seriesPub} draft={seriesDraft} />
        <StatCard label="Dubbed Movies" published={dubbedPub} draft={dubbedDraft} />
      </div>

      {canEdit && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/content/new" className="rounded-xl bg-wave px-4 py-2 text-sm font-black text-black">
            Add content
          </Link>
          <Link href="/admin/homepage" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Manage homepage
          </Link>
          <Link href="/admin/content?status=DRAFT" className="rounded-xl border border-line px-4 py-2 text-sm font-bold">
            View drafts
          </Link>
        </div>
      )}

      <h2 className="mt-10 text-lg font-black">Recently added</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((row) => (
              <tr key={row.id} className="border-b border-line/50">
                <td className="p-3">
                  <Link href={`/admin/content/${row.id}`} className="font-bold hover:text-wave">
                    {row.title}
                  </Link>
                </td>
                <td className="p-3 text-zinc-500">{row.type.replace("_", " ")}</td>
                <td className="p-3 text-zinc-500">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
