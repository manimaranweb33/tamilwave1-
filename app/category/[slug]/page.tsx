import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MediaGrid } from "@/components/media-grid";
import { categoryMap, getMediaItems } from "@/lib/catalog";

export const revalidate = 60;

export function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: categoryMap[params.slug]?.title ?? "Category" };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryMap[params.slug];
  if (!category) notFound();
  const mediaItems = await getMediaItems();
  const items = mediaItems.filter(category.filter).slice(0, 60);

  return (
    <div className="shell py-8">
      <Breadcrumbs items={[{ label: "Categories" }, { label: category.title }]} />
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Browse collection</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{category.title}</h1>
      <p className="mt-3 text-sm text-zinc-400">Handy, quick-to-scan indexing for your next Tamil entertainment pick.</p>
      <div className="mt-8">
        <MediaGrid items={items} />
      </div>
    </div>
  );
}
