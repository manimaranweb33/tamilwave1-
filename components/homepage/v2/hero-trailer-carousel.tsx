"use client";

import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/homepage-v2-data";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import { Badge } from "@/components/ui/badge";

export function HeroTrailerCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [watchlisted, setWatchlisted] = useState(false);
  const active = slides[index] ?? slides[0];

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!slides.length) return;
      setIndex((prev) => (prev + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => go(1), 7000);
    return () => clearInterval(timer);
  }, [go, slides.length]);

  useEffect(() => {
    if (!active) return;
    isInWatchlist(active.slug).then(setWatchlisted);
  }, [active]);

  if (!active) {
    return (
      <section className="shell pt-4 sm:pt-6">
        <div className="flex h-[280px] items-center justify-center rounded-2xl border border-line bg-panel sm:h-[420px]">
          <p className="text-sm text-zinc-500">No trailer highlights available yet.</p>
        </div>
      </section>
    );
  }

  const thumb =
    youtubeThumbnail(active.trailerUrl) ??
    active.backdropUrl ??
    active.posterUrl ??
    undefined;
  const ytId = extractYouTubeId(active.trailerUrl);

  async function onWatchlist() {
    const added = await toggleWatchlist({
      slug: active.slug,
      title: active.title,
      posterUrl: active.posterUrl,
      type: active.type
    });
    setWatchlisted(added);
  }

  return (
    <section id="hero" className="shell scroll-mt-24 pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-elevated shadow-glow sm:rounded-3xl">
        <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
          {ytId ? (
            <iframe
              key={ytId}
              title={`${active.title} trailer`}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=0&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${ytId}`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <Badge variant="accent" className="mb-3">
            Featured trailer
          </Badge>
          <h1 className="max-w-2xl font-display text-2xl font-black tracking-tight sm:text-4xl">{active.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-300">
            {active.type} · {active.year} · {active.genre}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/title/${active.slug}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-wave px-5 py-3 text-sm font-black text-black transition hover:bg-mint"
            >
              <Play className="h-4 w-4 fill-current" />
              View title
            </Link>
            <button
              type="button"
              onClick={onWatchlist}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-panel/80 px-5 py-3 text-sm font-bold backdrop-blur-sm transition hover:border-wave"
            >
              <Bookmark className={`h-4 w-4 ${watchlisted ? "fill-wave text-wave" : ""}`} />
              {watchlisted ? "In watchlist" : "Add to watchlist"}
            </button>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/70 text-zinc-200 hover:border-wave"
              aria-label="Previous trailer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/70 text-zinc-200 hover:border-wave"
              aria-label="Next trailer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-5 flex gap-1.5 sm:bottom-auto sm:top-4">
              {slides.map((slide, i) => (
                <button
                  key={slide.slug}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-wave" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
