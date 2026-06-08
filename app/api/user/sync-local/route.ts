import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/user/session";
import { syncLocalWatchlist } from "@/lib/user/watchlist-service";

export async function POST(req: Request) {
  const { user, error } = await requireUserSession();
  if (error) return error;

  const body = await req.json().catch(() => ({ watchlist: [] }));
  const watchlist = Array.isArray(body.watchlist) ? body.watchlist : [];

  await syncLocalWatchlist(user!.id, watchlist);

  return NextResponse.json({ ok: true });
}
