import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { ContentRail } from "@/components/ui/content-rail";
import { SectionHeader } from "@/components/ui/section-header";

export function ComingSoonSection({ items }: { items: MediaItem[] }) {
  return (
    <section id="coming-soon" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader
        eyebrow="Theatrical"
        title="Coming soon to theaters"
        icon={<CalendarClock className="h-5 w-5 text-wave" />}
      />
      <ContentRail ariaLabel="Coming soon titles">
        {items.map((item) => {
          const background = item.posterUrl
            ? `url("${item.posterUrl}") center / cover`
            : `linear-gradient(150deg, ${item.accent}99, #1a1a1a 70%)`;
          return (
            <Link
              key={item.slug}
              href={`/title/${item.slug}`}
              className="group w-[140px] shrink-0 snap-start sm:w-[156px]"
            >
              <div
                className="poster-lines relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-elevated transition group-hover:border-wave/50"
                style={{ background }}
              >
                <span className="absolute left-2 top-2 rounded-md bg-wave px-2 py-0.5 text-[10px] font-black text-black">
                  {item.year}
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-10">
                  <p className="line-clamp-2 text-sm font-black">{item.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </ContentRail>
    </section>
  );
}
