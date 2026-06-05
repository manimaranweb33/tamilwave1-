import Link from "next/link";
import { Ticket } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { ContentRail } from "@/components/ui/content-rail";
import { SectionHeader } from "@/components/ui/section-header";

type TheaterItem = MediaItem & { releaseStatus?: string | null };

export function InTheatersSection({ items }: { items: TheaterItem[] }) {
  return (
    <section id="in-theaters" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader eyebrow="Now showing" title="In theaters" />
      <ContentRail ariaLabel="In theaters">
        {items.map((item) => {
          const background = item.posterUrl
            ? `url("${item.posterUrl}") center / cover`
            : `linear-gradient(150deg, ${item.accent}99, #1a1a1a 70%)`;
          return (
            <div key={item.slug} className="w-[140px] shrink-0 snap-start sm:w-[156px]" role="listitem">
              <div
                className="poster-lines relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-elevated"
                style={{ background }}
              >
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-12">
                  <p className="line-clamp-2 text-sm font-black">{item.title}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-wave">
                    {item.releaseStatus ?? "In theaters"}
                  </p>
                </div>
              </div>
              <Link
                href={`/title/${item.slug}`}
                className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-line bg-panel py-2 text-[11px] font-bold hover:border-wave"
              >
                <Ticket className="h-3.5 w-3.5" />
                Book tickets
              </Link>
            </div>
          );
        })}
      </ContentRail>
    </section>
  );
}
