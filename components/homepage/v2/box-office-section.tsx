import Link from "next/link";
import { IndianRupee, Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { SectionHeader } from "@/components/ui/section-header";

export function BoxOfficeSection({ items }: { items: MediaItem[] }) {
  return (
    <section id="box-office" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader
        eyebrow="India charts"
        title="Top box office India"
        href="/category/movies"
        icon={<IndianRupee className="h-5 w-5 text-wave" />}
      />
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <ol className="divide-y divide-line">
          {items.slice(0, 10).map((item, index) => (
            <li key={item.slug}>
              <Link
                href={`/title/${item.slug}`}
                className="flex items-center gap-4 px-4 py-3 transition hover:bg-elevated sm:px-5 sm:py-4"
              >
                <span className="w-8 text-2xl font-black text-wave/80">{index + 1}</span>
                <div
                  className="h-16 w-11 shrink-0 overflow-hidden rounded-md border border-line bg-elevated bg-cover bg-center"
                  style={
                    item.posterUrl
                      ? { backgroundImage: `url(${item.posterUrl})` }
                      : { background: `linear-gradient(145deg, ${item.accent}, #1a1a1a)` }
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{item.title}</p>
                  <p className="text-xs text-zinc-500">
                    {item.type} · {item.year} · {item.genre}
                  </p>
                </div>
                {item.rating != null ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-wave">
                    <Star className="h-4 w-4 fill-current" />
                    {item.rating.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Trending</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
