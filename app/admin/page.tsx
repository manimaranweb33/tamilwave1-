import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getDashboardStats } from "@/lib/admin/content-queries";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await getDashboardStats();
  const recent = await db.content.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, title: true, type: true, status: true, slug: true, createdAt: true }
  });

  const canEdit = canEditContent({
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">TamilWave content management overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Movies" published={stats.movies} draft={0} href="/admin/movies" />
        <StatCard label="Total Web Series" published={stats.series} draft={0} href="/admin/series" />
        <StatCard label="Total Dubbed" published={stats.dubbed} draft={0} href="/admin/dubbed" />
        <StatCard label="Published Content" published={stats.published} draft={0} />
        <StatCard label="Draft Content" published={0} draft={stats.draft} href="/admin/content?status=DRAFT" />
        <StatCard label="Media Assets" published={stats.mediaCount} draft={0} href="/admin/media" />
      </div>

      {canEdit && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/content/new?type=MOVIE" className="rounded-xl bg-wave px-4 py-2 text-sm font-black text-black">
            Add movie
          </Link>
          <Link href="/admin/content/new?type=WEB_SERIES" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Add web series
          </Link>
          <Link href="/admin/content/new?type=DUBBED_MOVIE" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Add dubbed title
          </Link>
          <Link href="/admin/homepage" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Manage homepage
          </Link>
          <Link href="/admin/platforms" className="rounded-xl border border-line px-4 py-2 text-sm font-bold hover:border-wave">
            Platforms
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
