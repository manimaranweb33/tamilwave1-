import { Sparkles } from "lucide-react";
import { MovieCard } from "@/components/ui/movie-card";
import { ContentRail } from "@/components/ui/content-rail";
import { SectionHeader } from "@/components/ui/section-header";
import type { MediaItem } from "@/lib/types";
import { categoryHref } from "@/lib/title-service";
import type { TitleDetail } from "@/lib/title-service";

export function TitleRelated({ title, items }: { title: TitleDetail; items: MediaItem[] }) {
  if (!items.length) return null;

  return (
    <section className="mt-12 sm:mt-14">
      <SectionHeader
        eyebrow="You may also like"
        title="Related titles"
        href={categoryHref(title.type)}
        actionLabel="Browse category"
        icon={<Sparkles className="h-5 w-5 text-wave" />}
      />
      <ContentRail ariaLabel="Related titles">
        {items.map((item) => (
          <div key={item.slug} className="w-[140px] shrink-0 snap-start sm:w-[160px]" role="listitem">
            <MovieCard item={item} compact />
          </div>
        ))}
      </ContentRail>
    </section>
  );
}
