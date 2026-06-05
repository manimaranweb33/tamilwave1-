import { HomepageSectionKey } from "@prisma/client";

export const DEFAULT_HERO = {
  title: "Your next Tamil favorite starts here.",
  subtitle:
    "Browse top Tamil movies, dubbed blockbusters, trending picks and fresh releases in one crisp, mobile-first index.",
  ctaLabel: "Explore Releases",
  ctaHref: "#recently-added",
  backgroundImageUrl: null as string | null
};

export const HOMEPAGE_SECTION_LIMITS: Partial<Record<HomepageSectionKey, number>> = {
  TOP_TAMIL_MOVIES: 10,
  TOP_DUBBED: 10,
  TRENDING: 12,
  FEATURED: 20
};

export const RECENTLY_ADDED_LIMIT = 20;

export const CURATED_SECTION_KEYS: HomepageSectionKey[] = [
  HomepageSectionKey.TOP_TAMIL_MOVIES,
  HomepageSectionKey.TOP_DUBBED,
  HomepageSectionKey.TRENDING,
  HomepageSectionKey.FEATURED
];

export const SECTION_ADMIN_LABELS: Record<HomepageSectionKey, string> = {
  HERO: "Hero Banner",
  TOP_TAMIL_MOVIES: "Top Tamil Movies",
  TOP_DUBBED: "Top Dubbed Movies",
  TRENDING: "Trending",
  FEATURED: "Featured"
};
