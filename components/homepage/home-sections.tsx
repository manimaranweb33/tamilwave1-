import { Flame } from "lucide-react";
import { HomepageSectionKey } from "@prisma/client";
import { getCuratedSectionItems, getRecentlyAdded } from "@/lib/homepage-public";
import { SectionHeader } from "@/components/ui/section-header";
import { ContentRail } from "@/components/ui/content-rail";
import { MovieCard } from "@/components/ui/movie-card";
import { RankedMovieCard } from "@/components/ui/ranked-movie-card";

export async function TopTamilSection() {
  const items = await getCuratedSectionItems(HomepageSectionKey.TOP_TAMIL_MOVIES, (all) =>
    all.filter((item) => item.type === "Movie")
  );

  return (
    <section id="top-tamil" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader eyebrow="Chart" title="Top 10 Tamil Movies" href="/category/movies" />
      <ContentRail ariaLabel="Top 10 Tamil movies">
        {items.map((item, index) => (
          <div key={item.slug} role="listitem">
            <RankedMovieCard item={item} rank={index + 1} />
          </div>
        ))}
      </ContentRail>
    </section>
  );
}

export async function TopDubbedSection() {
  const items = await getCuratedSectionItems(HomepageSectionKey.TOP_DUBBED, (all) =>
    all.filter((item) => item.type === "Dubbed")
  );

  return (
    <section id="top-dubbed" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader eyebrow="Chart" title="Top 10 Tamil Dubbed Movies" href="/category/dubbed" />
      <ContentRail ariaLabel="Top 10 Tamil dubbed movies">
        {items.map((item, index) => (
          <div key={item.slug} role="listitem">
            <RankedMovieCard item={item} rank={index + 1} />
          </div>
        ))}
      </ContentRail>
    </section>
  );
}

export async function TrendingSection() {
  const items = await getCuratedSectionItems(HomepageSectionKey.TRENDING, (all) =>
    all.filter((item) => item.id % 17 === 0 || item.year >= new Date().getFullYear() - 1)
  );

  return (
    <section id="trending" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader
        eyebrow="Hot now"
        title="Trending Now"
        href="/category/trending"
        icon={<Flame className="h-5 w-5 fill-wave text-wave" />}
      />
      <ContentRail ariaLabel="Trending movies and series">
        {items.map((item) => (
          <div className="w-[140px] shrink-0 snap-start sm:w-[160px]" key={item.slug} role="listitem">
            <MovieCard item={item} compact />
          </div>
        ))}
      </ContentRail>
    </section>
  );
}

export async function RecentlyAddedSection() {
  const items = await getRecentlyAdded();

  return (
    <section id="recently-added" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader eyebrow="Fresh picks" title="Recently Added" href="/category/latest" />
      <ContentRail ariaLabel="Recently added titles">
        {items.map((item) => (
          <div className="w-[140px] shrink-0 snap-start sm:w-[160px]" key={item.slug} role="listitem">
            <MovieCard item={item} compact />
          </div>
        ))}
      </ContentRail>
    </section>
  );
}
