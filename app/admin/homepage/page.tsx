import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getHomepageSections } from "@/lib/admin/homepage-service";
import { db } from "@/lib/db";
import { HomepageEditor } from "@/components/admin/homepage/HomepageEditor";
import { HeroEditor } from "@/components/admin/homepage/HeroEditor";
import { canManageHomepage } from "@/lib/auth/permissions";
import { SECTION_ADMIN_LABELS } from "@/lib/homepage-config";

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
      <p className="mt-2 max-w-2xl text-sm text-zinc-500">
        Control the public homepage hero and curated rails. Recently Added loads the latest published
        content automatically (by created date).
      </p>

      <section id="hero-banner" className="mt-10 scroll-mt-6">
        <h2 className="text-lg font-black">{SECTION_ADMIN_LABELS.HERO}</h2>
        <p className="mt-1 text-xs text-zinc-500">Title, subtitle, backdrop image, and CTA button.</p>
        <div className="mt-4">
          <HeroEditor heroes={heroes} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-black">Curated sections</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Top Tamil, Top Dubbed, Trending, and Featured slots. Empty sections fall back to the static
          catalog on the live site.
        </p>
        <div className="mt-4">
          <HomepageEditor
            sections={sections.map((s) => ({
              id: s.id,
              key: s.key,
              title: s.title,
              slots: s.slots.map((slot) => ({
                contentId: slot.contentId,
                position: slot.position,
                content: {
                  title: slot.content.title,
                  slug: slot.content.slug,
                  status: slot.content.status
                }
              }))
            }))}
          />
        </div>
      </section>
    </div>
  );
}
