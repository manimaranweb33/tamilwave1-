import type { MediaItem } from "@/lib/types";
import { MediaCard } from "@/components/media-card";

export function MediaGrid({ items }: { items: MediaItem[] }) {
  return <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">{items.map((item) => <MediaCard item={item} key={item.slug} />)}</div>;
}
