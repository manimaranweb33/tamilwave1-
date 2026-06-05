import Link from "next/link";
import { Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";

export function RankedMovieCard({ item, rank }: { item: MediaItem; rank: number }) {
  const background = item.posterUrl
    ? `linear-gradient(to top, #000 0%, rgba(0,0,0,.7) 45%, transparent 78%), url("${item.posterUrl}") center / cover`
    : `radial-gradient(circle at 70% 20%, ${item.accent}dd, transparent 28%), linear-gradient(150deg, ${item.accent}99, #121212 70%)`;

  const rankSize = rank <= 3 ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl";

  return (
    <Link href={`/title/${item.slug}`} className="group relative block w-[128px] shrink-0 touch-manipulation sm:w-[148px]">
      <span
        className={`pointer-events-none absolute -left-1 bottom-6 z-20 font-black leading-none text-white/25 transition group-hover:text-wave/80 ${rankSize}`}
        style={{ WebkitTextStroke: "1px rgba(255,255,255,.08)" }}
        aria-hidden
      >
        {rank}
      </span>
      <div
        className="poster-lines relative ml-5 overflow-hidden rounded-xl bg-zinc-800 shadow-card ring-1 ring-white/5 transition duration-300 group-hover:-translate-y-0.5 group-hover:ring-wave/40 group-active:scale-[0.98] aspect-[.72]"
        style={{ background }}
      >
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent p-2.5 pt-10">
          <p className="line-clamp-2 text-xs font-black leading-tight">{item.title}</p>
          <p className="mt-0.5 text-[10px] text-zinc-400">
            {item.year} · {item.genre}
          </p>
        </div>
        <span className="absolute right-2 top-2 z-10 grid h-7 w-7 scale-90 place-items-center rounded-full bg-wave text-black opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
          <Play className="h-3 w-3 fill-current" />
        </span>
      </div>
    </Link>
  );
}
