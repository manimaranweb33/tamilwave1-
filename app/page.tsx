import Link from "next/link";
import { ArrowRight, Clapperboard, Flame, Play, Radio, Sparkles } from "lucide-react";
import { HomepageSectionKey } from "@prisma/client";
import { archiveYears, getMediaItems } from "@/lib/catalog";
import { getPublicHomepageData } from "@/lib/admin/homepage-service";
import { getSectionItems } from "@/lib/homepage-public";
import { MediaCard } from "@/components/media-card";
import { MediaGrid } from "@/components/media-grid";

export const revalidate = 60;

const categoryLinks = [
  ["Action", "/category/movies"],
  ["Horror", "/search?q=horror"],
  ["Thriller", "/search?q=thriller"],
  ["Romance", "/search?q=romance"],
  ["Comedy", "/search?q=comedy"],
  ["Family", "/search?q=family"],
  ["Dubbed", "/category/dubbed"],
  ["Web Series", "/category/web-series"]
];

function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[.22em] text-wave">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <Link className="flex shrink-0 items-center gap-1 text-xs font-bold text-zinc-400 transition hover:text-wave" href={href}>
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default async function Home() {
  const mediaItems = await getMediaItems();
  let hero = null;
  try {
    const data = await getPublicHomepageData();
    hero = data.hero;
  } catch {
    // DB optional during dev
  }

  const [trendingSlots, topTamil, topDubbed, featuredSlots] = await Promise.all([
    getSectionItems(HomepageSectionKey.TRENDING, 8),
    getSectionItems(HomepageSectionKey.TOP_TAMIL_MOVIES, 10),
    getSectionItems(HomepageSectionKey.TOP_DUBBED, 10),
    getSectionItems(HomepageSectionKey.FEATURED, 10)
  ]);

  const latest = [...mediaItems].sort((a, b) => b.year - a.year).slice(0, 18);
  const trending =
    trendingSlots.length > 0
      ? trendingSlots
      : mediaItems
          .filter((item) => item.id % 17 === 0 || item.year >= new Date().getFullYear() - 1)
          .slice(0, 8);
  const tamilMovies =
    topTamil.length > 0
      ? topTamil
      : mediaItems.filter((item) => item.type === "Movie").slice(0, 10);
  const webSeries = mediaItems.filter((item) => item.type === "Web Series").slice(0, 10);
  const dubbedMovies =
    topDubbed.length > 0
      ? topDubbed
      : mediaItems.filter((item) => item.type === "Dubbed").slice(0, 10);

  const heroTitle = hero?.title ?? "Your next Tamil favorite starts here.";
  const heroSubtitle =
    hero?.subtitle ??
    "Browse new releases, series, dubbed favorites and year-wise archives in one crisp, carefully organized place.";
  const ctaHref = hero?.ctaHref ?? "#latest";
  const ctaLabel = hero?.ctaLabel ?? "Explore Releases";

  return (
    <>
      <section id="top" className="shell scroll-mt-24 pt-5 sm:pt-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-wave/20 bg-[#152019] shadow-glow"
          style={
            hero?.backgroundImageUrl
              ? { backgroundImage: `url(${hero.backgroundImageUrl})`, backgroundSize: "cover" }
              : undefined
          }
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(circle at 78% 40%, #00c853 0, transparent 26%), radial-gradient(circle at 45% 120%, #00662b 0, transparent 35%)"
            }}
          />
          <div className="absolute -right-8 -top-24 h-[440px] w-[390px] rotate-12 rounded-[60px] border border-white/10 bg-white/5 sm:right-10" />
          <div className="relative max-w-3xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-wave/35 bg-wave/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-mint">
              <Sparkles className="h-3.5 w-3.5" /> A fresh Tamil entertainment index
            </div>
            <h1 className="max-w-xl text-balance text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{heroSubtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="flex items-center gap-2 rounded-xl bg-wave px-5 py-3 text-sm font-black text-black transition hover:bg-mint"
                href={ctaHref}
              >
                <Play className="h-4 w-4 fill-current" /> {ctaLabel}
              </Link>
              <Link
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-wave hover:text-wave"
                href={`/archive/${archiveYears[0]}`}
              >
                <Radio className="h-4 w-4" /> Browse Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featuredSlots.length > 0 && (
        <section className="shell mt-12 scroll-mt-24">
          <SectionHeading eyebrow="Featured" title="Featured Content" href="/category/latest" />
          <MediaGrid items={featuredSlots} />
        </section>
      )}

      <section id="latest" className="shell mt-12 scroll-mt-24">
        <SectionHeading eyebrow="Just Added" title="Latest Releases" href="/category/latest" />
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {latest.map((item) => (
            <div className="w-40 shrink-0 snap-start sm:w-48" key={item.slug}>
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      </section>

      <section id="trending" className="shell mt-14 scroll-mt-24">
        <div className="mb-5 flex items-center gap-2">
          <Flame className="h-5 w-5 fill-wave text-wave" />
          <h2 className="section-title">Trending This Week</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-4">
          {trending.map((item, index) => (
            <Link
              className="group grid grid-cols-[48px_1fr] gap-4 rounded-xl border border-line bg-panel p-4 transition hover:-translate-y-1 hover:border-wave/50 hover:bg-wave/5"
              href={`/title/${item.slug}`}
              key={item.slug}
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-wave text-lg font-black text-black">
                {index + 1}
              </span>
              <span>
                <span className="block text-sm font-black group-hover:text-wave">{item.title}</span>
                <span className="mt-1 block text-[11px] text-zinc-500">
                  {item.type} - {item.genre} - {item.year}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="tamil-movies" className="shell mt-16 scroll-mt-24">
        <SectionHeading eyebrow="Cinema picks" title="Tamil Movies" href="/category/movies" />
        <MediaGrid items={tamilMovies} />
      </section>
      <section id="web-series" className="shell mt-16 scroll-mt-24">
        <SectionHeading eyebrow="Streaming stories" title="Web Series" href="/category/web-series" />
        <MediaGrid items={webSeries} />
      </section>
      <section id="dubbed-movies" className="shell mt-16 scroll-mt-24">
        <SectionHeading eyebrow="Big titles in Tamil" title="Dubbed Movies" href="/category/dubbed" />
        <MediaGrid items={dubbedMovies} />
      </section>

      <section className="shell mt-16">
        <SectionHeading eyebrow="Find your mood" title="Popular Categories" href="/category/movies" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryLinks.map(([title, href]) => (
            <Link
              className="group flex items-center gap-3 rounded-xl border border-line bg-panel p-4 transition hover:-translate-y-1 hover:border-wave/60 hover:bg-wave/5"
              href={href}
              key={title}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-wave/10 text-wave">
                <Clapperboard className="h-4 w-4" />
              </span>
              <span className="font-black group-hover:text-wave">{title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell mt-16">
        <SectionHeading eyebrow="Browse the years" title="Movies by Year" href={`/archive/${archiveYears[0]}`} />
        <div className="flex flex-wrap gap-2">
          {archiveYears.slice(0, 17).map((year) => (
            <Link
              className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${year === archiveYears[0] ? "border-wave bg-wave text-black" : "border-line bg-panel text-zinc-400 hover:border-wave hover:text-wave"}`}
              href={`/archive/${year}`}
              key={year}
            >
              {year}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
