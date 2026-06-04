import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MediaGrid } from "@/components/media-grid";
import { archiveYears, getMediaItems } from "@/lib/catalog";

const pageSize = 10;

export function generateStaticParams() {
  return archiveYears.map((year) => ({ year: String(year) }));
}

export function generateMetadata({ params }: { params: { year: string } }): Metadata {
  return {
    title: `${params.year} Tamil Releases`,
    description: `Browse TamilWave's ${params.year} Tamil movie, dubbed movie and series index.`
  };
}

export default async function ArchivePage({
  params,
  searchParams
}: {
  params: { year: string };
  searchParams: { page?: string };
}) {
  const year = Number(params.year);
  if (!archiveYears.includes(year)) notFound();

  const page = Math.max(Number(searchParams.page) || 1, 1);
  const mediaItems = await getMediaItems();
  const source = mediaItems.filter((item) => item.year === year && item.type === "Movie");
  const pages = Math.max(Math.ceil(source.length / pageSize), 1);
  const items = source.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="shell py-8">
      <Breadcrumbs items={[{ label: "Archive" }, { label: String(year) }]} />
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Year Archive</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{year} Tamil Releases</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Browse indexed Tamil movie releases from {year}. Each archive page shows 10 cards across two desktop rows.
      </p>
      <div className="mt-8">
        {items.length ? (
          <MediaGrid items={items} />
        ) : (
          <div className="rounded-xl border border-line bg-panel p-8 text-sm text-zinc-400">
            No Tamil movie releases are indexed for {year} yet.
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <Link
              className={`grid h-10 w-10 place-items-center rounded-xl border text-sm font-bold ${number === page ? "border-wave bg-wave text-black" : "border-line bg-panel text-zinc-400 hover:border-wave"}`}
              href={`/archive/${year}?page=${number}`}
              key={number}
            >
              {number}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
