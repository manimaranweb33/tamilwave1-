const WATCHLIST_KEY = "tamilwave-watchlist";
const GUEST_RECENTLY_VIEWED_KEY = "tamilwave-guest-recently-viewed";

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

export function toggleWatchlistLocal(entry: WatchlistEntry) {
  const list = readWatchlist();
  const exists = list.some((item) => item.slug === entry.slug);
  const next = exists ? list.filter((item) => item.slug !== entry.slug) : [entry, ...list];
  writeWatchlist(next);
  return !exists;
}

export function isInWatchlistLocal(slug: string) {
  return readWatchlist().some((item) => item.slug === slug);
}

export async function toggleWatchlist(entry: WatchlistEntry): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/user/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: entry.slug })
    });
    if (res.status === 401) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    if (res.ok) {
      const data = await res.json();
      return !!data.added;
    }
  } catch {
    // Database is the source of truth for authenticated watchlists.
  }

  return false;
}

export async function isInWatchlist(slug: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/user/watchlist");
    if (res.ok) {
      const data = await res.json();
      return (data.items as WatchlistEntry[]).some((item) => item.slug === slug);
    }
  } catch {
    // Database is the source of truth for authenticated watchlists.
  }

  return false;
}

export function readRecentlyViewed(): WatchlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_RECENTLY_VIEWED_KEY);
    return raw ? (JSON.parse(raw) as WatchlistEntry[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(entry: WatchlistEntry) {
  const list = readRecentlyViewed().filter((item) => item.slug !== entry.slug);
  list.unshift(entry);
  localStorage.setItem(GUEST_RECENTLY_VIEWED_KEY, JSON.stringify(list));
}

export async function trackRecentlyViewed(entry: WatchlistEntry) {
  if (typeof window === "undefined") return;

  try {
    const res = await fetch("/api/user/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: entry.slug })
    });
    if (res.status === 401) pushRecentlyViewed(entry);
  } catch {
    pushRecentlyViewed(entry);
  }
}
