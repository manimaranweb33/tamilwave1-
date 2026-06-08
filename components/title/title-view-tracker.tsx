"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";
import { pushRecentlyViewed, type WatchlistEntry } from "@/lib/watchlist";

type TitleViewTrackerProps = {
  slug: string;
  title: string;
  posterUrl?: string | null;
  type: string;
};

function TitleViewTrackerInner({ slug, title, posterUrl, type }: TitleViewTrackerProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const entry: WatchlistEntry = {
      slug,
      title,
      posterUrl: posterUrl ?? undefined,
      type
    };

    if (!session?.user?.id) {
      pushRecentlyViewed(entry);
      return;
    }

    const controller = new AbortController();
    fetch("/api/user/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      signal: controller.signal
    }).catch(() => undefined);

    return () => controller.abort();
  }, [session?.user?.id, slug, title, posterUrl, type, status]);

  return null;
}

export function TitleViewTracker(props: TitleViewTrackerProps) {
  return (
    <UserSessionProvider>
      <TitleViewTrackerInner {...props} />
    </UserSessionProvider>
  );
}
