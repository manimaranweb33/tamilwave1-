import { Smartphone } from "lucide-react";

export function AppPromoSection() {
  return (
    <section id="app-promo" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-panel via-elevated to-panel">
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">TamilWave mobile</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Get the TamilWave app</h2>
            <p className="mt-2 max-w-lg text-sm text-zinc-400">
              Browse Tamil movies, dubbed hits and web series on the go. Personalized watchlists and trailer alerts — coming soon to iOS and Android.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-ink px-4 py-3 text-sm font-bold text-zinc-400">
              <Smartphone className="h-4 w-4" />
              App Store — soon
            </span>
            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-ink px-4 py-3 text-sm font-bold text-zinc-400">
              <Smartphone className="h-4 w-4" />
              Google Play — soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
