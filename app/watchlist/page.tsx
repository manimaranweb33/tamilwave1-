"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";
import type { WatchlistEntry } from "@/lib/watchlist";

function WatchlistContent() {
  const [items, setItems] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/watchlist")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="shell py-10">
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Saved titles</p>
      <h1 className="mt-2 text-3xl font-black">My Watchlist</h1>
      {loading ? (
        <p className="mt-8 text-sm text-zinc-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-panel p-8 text-center">
          <p className="text-zinc-400">Your watchlist is empty.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-bold text-wave hover:underline">
            Browse titles
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/title/${item.slug}`}
              className="flex gap-4 rounded-xl border border-line bg-panel p-4 transition hover:border-wave"
            >
              {item.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.posterUrl} alt="" className="h-24 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-24 w-16 rounded-lg bg-elevated" />
              )}
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{item.type}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WatchlistPage() {
  return (
    <UserSessionProvider>
      <WatchlistContent />
    </UserSessionProvider>
  );
}
