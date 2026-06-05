"use client";

import Link from "next/link";
import { Bookmark, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
import { formatRuntime } from "@/lib/youtube";

export function TopTenCard({ item, rank }: { item: MediaItem; rank: number }) {
  const [saved, setSaved] = useState(false);
  const runtime = formatRuntime(item.runtimeMinutes);
  const rating = item.rating != null ? item.rating.toFixed(1) : null;

  useEffect(() => {
    setSaved(isInWatchlist(item.slug));
  }, [item.slug]);

  const background = item.posterUrl
    ? `linear-gradient(to top, #000 0%, rgba(0,0,0,.75) 50%, transparent 80%), url("${item.posterUrl}") center / cover`
    : `linear-gradient(150deg, ${item.accent}99, #1a1a1a 70%)`;

  return (
    <div className="relative w-[150px] shrink-0 snap-start sm:w-[168px]">
      <span
        className="pointer-events-none absolute -left-1 bottom-8 z-20 text-5xl font-black leading-none text-white/20 sm:text-6xl"
        style={{ WebkitTextStroke: "1px rgba(245,197,24,.15)" }}
        aria-hidden
      >
        {rank}
      </span>
      <Link href={`/title/${item.slug}`} className="group relative ml-6 block">
        <div
          className="poster-lines relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-elevated shadow-card transition group-hover:-translate-y-0.5 group-hover:border-wave/50"
          style={{ background }}
        >
          <button
            type="button"
            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const added = toggleWatchlist({
                slug: item.slug,
                title: item.title,
                posterUrl: item.posterUrl,
                type: item.type
              });
              setSaved(added);
            }}
            className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-ink/70 backdrop-blur-sm"
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-wave text-wave" : "text-white"}`} />
          </button>
          <span className="absolute left-2 top-2 z-10 rounded-md bg-ink/70 px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-sm">
            {item.type}
          </span>
        </div>
        <div className="mt-2.5 pr-1">
          <p className="line-clamp-2 text-sm font-black leading-tight">{item.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-500">
            {runtime ? <span>{runtime}</span> : null}
            {rating ? (
              <span className="inline-flex items-center gap-0.5 text-wave">
                <Star className="h-3 w-3 fill-current" />
                {rating}
                {item.ratingCount ? <span className="text-zinc-600">({item.ratingCount.toLocaleString()})</span> : null}
              </span>
            ) : null}
          </div>
        </div>
        <span className="absolute right-0 top-[42%] grid h-8 w-8 scale-90 place-items-center rounded-full bg-wave text-black opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
          <Play className="h-3.5 w-3.5 fill-current" />
        </span>
      </Link>
    </div>
  );
}
