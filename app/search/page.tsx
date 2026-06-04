import { Breadcrumbs } from "@/components/breadcrumbs";
import { MediaGrid } from "@/components/media-grid";
import { getMediaItems } from "@/lib/catalog";
import { getPublishedContents } from "@/lib/catalog-service";

export const revalidate = 60;

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q ?? "").toLowerCase();
  let items = await getPublishedContents({ search: query || undefined, limit: 200 });
  if (!items.length) {
    const mediaItems = await getMediaItems();
    items = query
      ? mediaItems.filter((item) =>
          `${item.title} ${item.tamilTitle} ${item.genre} ${item.type}`.toLowerCase().includes(query)
        )
      : mediaItems;
  }

  return (
    <div className="shell py-8">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="text-3xl font-black tracking-tight">Search TamilWave</h1>
      <form className="mt-5" action="/search" method="get">
        <input
          name="q"
          defaultValue={searchParams.q}
          className="w-full max-w-xl rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-wave"
          placeholder="Search movies, web series, dubbed titles..."
        />
      </form>
      <p className="mt-5 text-xs text-zinc-500">
        {items.length} indexed results{query ? ` for "${searchParams.q}"` : ""}
      </p>
      <div className="mt-7">
        <MediaGrid items={items.slice(0, 40)} />
      </div>
    </div>
  );
}
