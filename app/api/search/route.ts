import { NextResponse } from "next/server";
import { getPublishedContents } from "@/lib/catalog-service";
import { mediaItems } from "@/lib/catalog-data";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.toLowerCase() ?? "";
  if (query.length < 2) return NextResponse.json({ items: [] });

  let items = await getPublishedContents({ search: query, limit: 6 });
  if (!items.length) {
    items = mediaItems
      .filter((item) =>
        `${item.title} ${item.tamilTitle} ${item.genre} ${item.type}`.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }

  return NextResponse.json({
    items: items.map((item) => ({
      title: item.title,
      slug: item.slug,
      meta: `${item.type} - ${item.year}`
    }))
  });
}
