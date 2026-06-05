import { Play } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TitleDetails } from "@/components/title/title-details";
import { TitleHero } from "@/components/title/title-hero";
import { TitlePlatforms } from "@/components/title/title-platforms";
import { TitleRelated } from "@/components/title/title-related";
import { TitleViewTracker } from "@/components/title/title-view-tracker";
import { getAllPublishedSlugs } from "@/lib/catalog";
import { mediaItems as staticItems } from "@/lib/catalog-data";
import {
  buildTitleJsonLd,
  buildTitleMetadata,
  categoryHref,
  getRelatedTitles,
  getTitleBySlug,
  getTitlePlatformLinks
} from "@/lib/title-service";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    if (slugs.length) return slugs.map((slug) => ({ slug }));
  } catch {
    // fallback
  }
  return staticItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = await getTitleBySlug(params.slug);
  if (!title) return { title: "Title not found" };
  return buildTitleMetadata(title);
}

export default async function TitlePage({ params }: { params: { slug: string } }) {
  const title = await getTitleBySlug(params.slug);
  if (!title) notFound();

  const [related, platformLinks] = await Promise.all([
    getRelatedTitles(title),
    getTitlePlatformLinks(title)
  ]);

  const hasDirectLinks = title.platforms.length > 0;
  const jsonLd = buildTitleJsonLd(title);

  return (
    <div className="shell py-6 sm:py-8">
      <TitleViewTracker
        slug={title.slug}
        title={title.title}
        posterUrl={title.posterUrl}
        type={title.type}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: title.type, href: categoryHref(title.type) },
          { label: title.title }
        ]}
      />

      <TitleHero title={title} />

      {title.trailerUrl ? (
        <div className="mt-5 sm:mt-6">
          <a
            href={title.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-wave px-5 py-3 text-sm font-black text-black transition hover:bg-mint active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" />
            Watch trailer
          </a>
        </div>
      ) : null}

      <div className="mt-8 sm:mt-10">
        <TitleDetails title={title} />
      </div>

      <TitlePlatforms platforms={platformLinks} hasDirectLinks={hasDirectLinks} />

      <TitleRelated title={title} items={related} />
    </div>
  );
}
