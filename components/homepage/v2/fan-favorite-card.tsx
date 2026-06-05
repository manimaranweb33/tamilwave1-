"use client";

import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { TrailerModal } from "@/components/homepage/v2/trailer-modal";
import { useState } from "react";

export function FanFavoriteCard({ item }: { item: MediaItem }) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const background = item.posterUrl
    ? `url("${item.posterUrl}") center / cover`
    : `linear-gradient(150deg, ${item.accent}99, #1a1a1a 70%)`;
  const rating = item.rating != null ? item.rating.toFixed(1) : "—";

  return (
    <>
      <div className="w-[140px] shrink-0 snap-start sm:w-[156px]">
        <div
          className="poster-lines relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-elevated shadow-card"
          style={{ background }}
        >
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 pt-10">
            <p className="line-clamp-2 text-sm font-black">{item.title}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-wave">
              <Star className="h-3 w-3 fill-current" />
              {rating}
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex gap-2">
          <Link
            href={`/title/${item.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-wave px-2 py-2 text-[11px] font-black text-black"
          >
            <Play className="h-3 w-3 fill-current" />
            Watch
          </Link>
          {item.trailerUrl ? (
            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-line px-2 py-2 text-[11px] font-bold text-zinc-300 hover:border-wave"
            >
              Trailer
            </button>
          ) : null}
        </div>
      </div>
      {item.trailerUrl ? (
        <TrailerModal
          open={trailerOpen}
          title={item.title}
          trailerUrl={item.trailerUrl}
          onClose={() => setTrailerOpen(false)}
        />
      ) : null}
    </>
  );
}
