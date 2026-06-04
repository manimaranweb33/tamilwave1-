import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getHomepageSections } from "@/lib/admin/homepage-service";
import { db } from "@/lib/db";
import { HomepageEditor } from "@/components/admin/homepage/HomepageEditor";
import { HeroEditor } from "@/components/admin/homepage/HeroEditor";
import { canManageHomepage } from "@/lib/auth/permissions";

export const metadata = { title: "Homepage" };

export default async function AdminHomepagePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageHomepage({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/admin");
  }

  const [sections, heroes] = await Promise.all([
    getHomepageSections(),
    db.heroBanner.findMany({ orderBy: { updatedAt: "desc" }, take: 5 })
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black">Homepage management</h1>
      <Link href="/admin/homepage/hero" className="mt-2 inline-block text-sm text-wave hover:underline">
        Edit hero banner
      </Link>
      <section className="mt-8">
        <h2 className="text-lg font-black">Hero preview</h2>
        <div className="mt-4">
          <HeroEditor heroes={heroes} />
        </div>
      </section>
      <section className="mt-12">
        <h2 className="text-lg font-black">Curated sections</h2>
        <div className="mt-4">
          <HomepageEditor
            sections={sections.map((s) => ({
              id: s.id,
              key: s.key,
              title: s.title,
              slots: s.slots.map((slot) => ({
                contentId: slot.contentId,
                position: slot.position,
                content: { title: slot.content.title, slug: slot.content.slug }
              }))
            }))}
          />
        </div>
      </section>
    </div>
  );
}
