import { Calendar, Film, Play, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MediaCard } from "@/components/media-card";
import { findItem, getMediaItems, getAllPublishedSlugs } from "@/lib/catalog";
import { findPublishedContentRecord } from "@/lib/catalog-service";
import { mediaItems as staticItems } from "@/lib/catalog-data";

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
  const record = await findPublishedContentRecord(params.slug);
  if (record) {
    return {
      title: record.metaTitle ?? record.title,
      description: record.metaDescription ?? record.description,
      keywords: record.keywords,
      openGraph: record.ogImageUrl ? { images: [record.ogImageUrl] } : undefined,
      alternates: record.canonicalUrl ? { canonical: record.canonicalUrl } : undefined
    };
  }
  const item = await findItem(params.slug);
  return { title: item?.title ?? "Title", description: item?.description };
}

export default async function TitlePage({ params }: { params: { slug: string } }) {
  const item = await findItem(params.slug);
  if (!item) notFound();

  const all = await getMediaItems();
  const related = all
    .filter((other) => other.slug !== item.slug && (other.genre === item.genre || other.type === item.type))
    .slice(0, 4);

  const record = await findPublishedContentRecord(params.slug);

  return (
    <div className="shell py-8">
      <Breadcrumbs items={[{ label: item.type, href: "/category/latest" }, { label: item.title }]} />
      <div className="grid gap-7 lg:grid-cols-[270px_1fr]">
        <MediaCard item={item} />
        <div className="pt-1 lg:pt-6">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">{item.type} Index</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">{item.title}</h1>
          <p className="mt-2 text-lg text-zinc-400">{item.tamilTitle}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-300">
            <span className="flex gap-1.5 rounded-lg border border-line bg-panel px-3 py-2">
              <Calendar className="h-3.5 w-3.5 text-wave" />
              {item.year}
            </span>
            <span className="flex gap-1.5 rounded-lg border border-line bg-panel px-3 py-2">
              <Film className="h-3.5 w-3.5 text-wave" />
              {item.type}
            </span>
            <span className="flex gap-1.5 rounded-lg border border-line bg-panel px-3 py-2">
              <Tag className="h-3.5 w-3.5 text-wave" />
              {item.genre}
            </span>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400">{item.description}</p>
          {record?.trailerUrl && (
            <a
              href={record.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-wave px-5 py-3 text-sm font-black text-black transition hover:bg-mint"
            >
              <Play className="h-4 w-4 fill-current" /> Watch trailer
            </a>
          )}
          <div className="mt-8 grid min-h-20 place-items-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 text-xs font-bold uppercase tracking-[.16em] text-zinc-600">
            Advertisement placement
          </div>
        </div>
      </div>
      <section className="mt-14">
        <h2 className="section-title">Related content</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {related.map((other) => (
            <MediaCard compact item={other} key={other.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}
