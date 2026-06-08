"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

type RatingItem = {
  slug: string;
  title: string;
  posterUrl?: string;
  type: string;
  score: number;
};

function RatingsContent() {
  const [items, setItems] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/ratings")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="shell py-10">
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Your votes</p>
      <h1 className="mt-2 text-3xl font-black">My Ratings</h1>
      {loading ? (
        <p className="mt-8 text-sm text-zinc-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-panel p-8 text-center">
          <p className="text-zinc-400">You haven&apos;t rated any titles yet.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-bold text-wave hover:underline">
            Discover titles
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
                <p className="mt-2 text-sm font-black text-wave">{item.score}/10</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RatingsPage() {
  return (
    <UserSessionProvider>
      <RatingsContent />
    </UserSessionProvider>
  );
}
