import Link from "next/link";
import { BookmarkPlus } from "lucide-react";

export function WatchlistSignInBanner() {
  return (
    <section id="watchlist-banner" className="shell mt-8 scroll-mt-24 sm:mt-10">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-panel px-5 py-5 sm:flex-row sm:items-center sm:px-7">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Personalize TamilWave</p>
          <h2 className="mt-1 text-lg font-black sm:text-xl">Track titles with your watchlist</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Save Tamil movies, series and dubbed picks locally — sign in support coming soon.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-wave/40 bg-wave/10 px-5 py-3 text-sm font-black text-wave transition hover:bg-wave hover:text-black"
        >
          <BookmarkPlus className="h-4 w-4" />
          Sign in to save
        </Link>
      </div>
    </section>
  );
}
