const WATCHLIST_KEY = "tamilwave-watchlist";
const RECENTLY_VIEWED_KEY = "tamilwave-recently-viewed";

export type WatchlistEntry = {
  slug: string;
  title: string;
  posterUrl?: string;
  type: string;
};

export function readWatchlist(): WatchlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? (JSON.parse(raw) as WatchlistEntry[]) : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(items: WatchlistEntry[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items.slice(0, 50)));
}

export function toggleWatchlist(entry: WatchlistEntry) {
  const list = readWatchlist();
  const exists = list.some((item) => item.slug === entry.slug);
  const next = exists ? list.filter((item) => item.slug !== entry.slug) : [entry, ...list];
  writeWatchlist(next);
  return !exists;
}

export function isInWatchlist(slug: string) {
  return readWatchlist().some((item) => item.slug === slug);
}

export function readRecentlyViewed(): WatchlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? (JSON.parse(raw) as WatchlistEntry[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(entry: WatchlistEntry) {
  const list = readRecentlyViewed().filter((item) => item.slug !== entry.slug);
  list.unshift(entry);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list.slice(0, 20)));
}

export function trackRecentlyViewed(entry: WatchlistEntry) {
  if (typeof window === "undefined") return;
  pushRecentlyViewed(entry);
}
