"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { readRecentlyViewed, type WatchlistEntry } from "@/lib/watchlist";
import { ContentRail } from "@/components/ui/content-rail";
import { SectionHeader } from "@/components/ui/section-header";
import { History } from "lucide-react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

function RecentlyViewedSectionInner() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [items, setItems] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    setItems([]);

    if (status === "loading") return;

    if (!userId) {
      setItems(readRecentlyViewed());
      return;
    }

    let active = true;
    const controller = new AbortController();

    fetch("/api/user/recently-viewed", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        setItems(data?.items ?? []);
      })
      .catch(() => undefined);

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId, status]);

  if (!items.length) return null;

  return (
    <section id="recently-viewed" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <SectionHeader
        eyebrow="Your activity"
        title="Recently viewed"
        icon={<History className="h-5 w-5 text-wave" />}
      />
      <ContentRail ariaLabel="Recently viewed titles">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/title/${item.slug}`}
            className="w-[120px] shrink-0 snap-start sm:w-[132px]"
          >
            <div
              className="aspect-[2/3] overflow-hidden rounded-xl border border-line bg-elevated bg-cover bg-center"
              style={
                item.posterUrl
                  ? { backgroundImage: `url(${item.posterUrl})` }
                  : { background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)" }
              }
            />
            <p className="mt-2 line-clamp-2 text-xs font-bold">{item.title}</p>
          </Link>
        ))}
      </ContentRail>
    </section>
  );
}

export function RecentlyViewedSection() {
  return (
    <UserSessionProvider>
      <RecentlyViewedSectionInner />
    </UserSessionProvider>
  );
}
