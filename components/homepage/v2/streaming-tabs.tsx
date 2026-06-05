"use client";

import { useMemo, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { DEFAULT_STREAMING_PLATFORMS } from "@/lib/admin/ensure-platforms";
import { ContentRail } from "@/components/ui/content-rail";
import { MovieCard } from "@/components/ui/movie-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Tv } from "lucide-react";

const TABS = DEFAULT_STREAMING_PLATFORMS.map((p) => ({
  slug: p.slug,
  label: p.name
}));

export function StreamingTabs({ grouped }: { grouped: Record<string, MediaItem[]> }) {
  const [active, setActive] = useState(TABS[0]?.slug ?? "netflix");
  const items = useMemo(() => grouped[active] ?? [], [grouped, active]);

  return (
    <section id="streaming" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader
        eyebrow="Platforms"
        title="Explore what's streaming"
        icon={<Tv className="h-5 w-5 text-wave" />}
      />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setActive(tab.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
              active === tab.slug
                ? "border-wave bg-wave text-black"
                : "border-line bg-panel text-zinc-400 hover:border-wave/50 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ContentRail ariaLabel={`${active} streaming titles`}>
        {items.length ? (
          items.map((item) => (
            <div key={item.slug} className="w-[140px] shrink-0 snap-start sm:w-[160px]" role="listitem">
              <MovieCard item={item} compact />
            </div>
          ))
        ) : (
          <p className="px-2 py-8 text-sm text-zinc-500">No titles linked to this platform yet.</p>
        )}
      </ContentRail>
    </section>
  );
}
