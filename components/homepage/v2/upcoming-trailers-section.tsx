"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { youtubeThumbnail } from "@/lib/youtube";
import { ContentRail } from "@/components/ui/content-rail";
import { SectionHeader } from "@/components/ui/section-header";
import { TrailerModal } from "@/components/homepage/v2/trailer-modal";

export function UpcomingTrailersSection({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState<MediaItem | null>(null);

  return (
    <>
      <section id="upcoming-trailers" className="shell mt-12 scroll-mt-24 sm:mt-14">
        <SectionHeader eyebrow="Watch next" title="Upcoming trailers" />
        <ContentRail ariaLabel="Upcoming trailers">
          {items.map((item) => {
            const thumb =
              youtubeThumbnail(item.trailerUrl) ??
              item.backdropUrl ??
              item.posterUrl ??
              undefined;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActive(item)}
                className="group w-[180px] shrink-0 snap-start text-left sm:w-[200px]"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-elevated">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-elevated to-panel" />
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/30 transition group-hover:bg-black/20">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-wave text-black shadow-glow">
                      <Play className="h-5 w-5 fill-current" />
                    </span>
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-black">{item.title}</p>
              </button>
            );
          })}
        </ContentRail>
      </section>
      {active?.trailerUrl ? (
        <TrailerModal
          open
          title={active.title}
          trailerUrl={active.trailerUrl}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
