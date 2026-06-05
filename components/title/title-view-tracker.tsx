"use client";

import { useEffect } from "react";
import { pushRecentlyViewed } from "@/lib/watchlist";

export function TitleViewTracker({
  slug,
  title,
  posterUrl,
  type
}: {
  slug: string;
  title: string;
  posterUrl?: string | null;
  type: string;
}) {
  useEffect(() => {
    pushRecentlyViewed({
      slug,
      title,
      posterUrl: posterUrl ?? undefined,
      type
    });
  }, [slug, title, posterUrl, type]);

  return null;
}
