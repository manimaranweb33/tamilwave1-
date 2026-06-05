import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function MovieCard({ item, compact = false }: { item: MediaItem; compact?: boolean }) {
  const background = item.posterUrl
    ? `linear-gradient(to top, #000 0%, rgba(0,0,0,.65) 40%, rgba(0,0,0,.1) 75%), url("${item.posterUrl}") center / cover`
    : `radial-gradient(circle at 68% 24%, ${item.accent}dd, transparent 30%), linear-gradient(145deg, ${item.accent}99, #141414 72%)`;

  return (
    <Link href={`/title/${item.slug}`} className="group block touch-manipulation">
      <div
        className={`poster-lines relative overflow-hidden rounded-xl bg-zinc-800 shadow-card ring-1 ring-white/5 transition duration-300 group-hover:-translate-y-0.5 group-hover:ring-wave/40 group-active:scale-[0.98] ${compact ? "aspect-[.8]" : "aspect-[.72]"}`}
        style={{ background }}
      >
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/55 to-transparent p-3 pt-12">
          <Badge variant="accent" className="mb-1.5">
            {item.type}
          </Badge>
          <p className="line-clamp-2 text-sm font-black leading-tight tracking-tight sm:text-base">{item.title}</p>
          {item.tamilTitle ? <p className="mt-0.5 line-clamp-1 text-[11px] text-white/60">{item.tamilTitle}</p> : null}
        </div>
        <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
          {item.year}
        </span>
        <span className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 scale-90 place-items-center rounded-full bg-wave text-black opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          <Play className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>
      <div className="px-0.5 pt-2.5">
        <p className="flex items-center gap-1 text-[11px] text-zinc-500">
          <Star className="h-3 w-3 shrink-0 fill-wave text-wave" />
          <span className="truncate">{item.genre}</span>
          <span className="text-zinc-700">·</span>
          <span className="shrink-0">{item.quality}</span>
        </p>
      </div>
    </Link>
  );
}
