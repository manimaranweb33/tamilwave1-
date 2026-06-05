import { Trophy } from "lucide-react";
import {
  getBoxOfficeIndia,
  getComingSoon,
  getFanFavorites,
  getGroupedStreamingContent,
  getHeroTrailerSlides,
  getInTheaters,
  getTopTenThisWeek,
  getUpcomingTrailers
} from "@/lib/homepage-v2-data";
import { HeroTrailerCarousel } from "@/components/homepage/v2/hero-trailer-carousel";
import { WatchlistSignInBanner } from "@/components/homepage/v2/watchlist-banner";
import { TopTenCard } from "@/components/homepage/v2/top-ten-card";
import { FanFavoriteCard } from "@/components/homepage/v2/fan-favorite-card";
import { StreamingTabs } from "@/components/homepage/v2/streaming-tabs";
import { InTheatersSection } from "@/components/homepage/v2/in-theaters-section";
import { BoxOfficeSection } from "@/components/homepage/v2/box-office-section";
import { ComingSoonSection } from "@/components/homepage/v2/coming-soon-section";
import { UpcomingTrailersSection } from "@/components/homepage/v2/upcoming-trailers-section";
import { RecentlyViewedSection } from "@/components/homepage/v2/recently-viewed-section";
import { AppPromoSection } from "@/components/homepage/v2/app-promo-section";
import { SignInPromoSection } from "@/components/homepage/v2/sign-in-promo-section";
import { ContentRail } from "@/components/ui/content-rail";
import { SectionHeader } from "@/components/ui/section-header";

export async function HomepageV2Sections() {
  const [
    heroSlides,
    topTen,
    fanFavorites,
    streamingGrouped,
    inTheaters,
    boxOffice,
    comingSoon,
    upcomingTrailers
  ] = await Promise.all([
    getHeroTrailerSlides(),
    getTopTenThisWeek(),
    getFanFavorites(),
    getGroupedStreamingContent(),
    getInTheaters(),
    getBoxOfficeIndia(),
    getComingSoon(),
    getUpcomingTrailers()
  ]);

  return (
    <>
      <HeroTrailerCarousel slides={heroSlides} />
      <WatchlistSignInBanner />

      <section id="top-ten" className="shell mt-12 scroll-mt-24 sm:mt-14">
        <SectionHeader
          eyebrow="TamilWave chart"
          title="Top 10 TamilWave this week"
          href="/category/trending"
          icon={<Trophy className="h-5 w-5 text-wave" />}
        />
        <ContentRail ariaLabel="Top 10 this week">
          {topTen.slice(0, 10).map((item, index) => (
            <TopTenCard key={item.slug} item={item} rank={index + 1} />
          ))}
        </ContentRail>
      </section>

      <section id="fan-favorites" className="shell mt-12 scroll-mt-24 sm:mt-14">
        <SectionHeader eyebrow="Community picks" title="Fan favorites" href="/category/latest" />
        <ContentRail ariaLabel="Fan favorites">
          {fanFavorites.slice(0, 12).map((item) => (
            <FanFavoriteCard key={item.slug} item={item} />
          ))}
        </ContentRail>
      </section>

      <StreamingTabs grouped={streamingGrouped} />
      <InTheatersSection items={inTheaters} />
      <BoxOfficeSection items={boxOffice} />
      <ComingSoonSection items={comingSoon} />
      <UpcomingTrailersSection items={upcomingTrailers} />
      <RecentlyViewedSection />
      <AppPromoSection />
      <SignInPromoSection />
    </>
  );
}
