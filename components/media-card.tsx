import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";

export function MediaCard({ item, compact = false }: { item: MediaItem; compact?: boolean }) {
  const background = item.posterUrl
    ? `linear-gradient(to top, #000 0%, rgba(0,0,0,.58) 38%, rgba(0,0,0,.08) 72%), url("${item.posterUrl}") center / cover`
    : `radial-gradient(circle at 68% 24%, ${item.accent}dd, transparent 30%), linear-gradient(145deg, ${item.accent}99, #141414 72%)`;

  return (
    <Link href={`/title/${item.slug}`} className="group block">
      <div className={`poster-lines relative overflow-hidden rounded-xl bg-zinc-800 shadow-card ${compact ? "aspect-[.8]" : "aspect-[.72]"}`} style={{ background }}>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent p-3 pt-14">
          <p className="text-[9px] font-black uppercase tracking-[.17em] text-wave">{item.type} · {item.quality}</p>
          <p className="mt-1 text-lg font-black leading-5 tracking-tight">{item.title}</p>
          <p className="mt-1 text-xs text-white/65">{item.tamilTitle}</p>
        </div>
        <span className="absolute left-3 top-3 z-10 rounded-md bg-black/45 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">{item.year}</span>
        <span className="absolute right-3 top-3 z-10 grid h-8 w-8 scale-75 place-items-center rounded-full bg-wave text-black opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100"><Play className="h-3.5 w-3.5 fill-current" /></span>
      </div>
      <div className="px-1 pt-3">
        <h3 className="truncate text-sm font-bold transition group-hover:text-wave">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500"><Star className="h-3 w-3 fill-wave text-wave" /> {item.genre} <span className="text-zinc-700">•</span> {item.year}</p>
      </div>
    </Link>
  );
}
