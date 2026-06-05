import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";

export function SignInPromoSection() {
  return (
    <section id="sign-in-promo" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <div className="rounded-2xl border border-wave/20 bg-[#1a1608] px-6 py-8 text-center sm:px-10 sm:py-10">
        <Sparkles className="mx-auto h-8 w-8 text-wave" />
        <h2 className="mt-4 text-2xl font-black sm:text-3xl">Sign in for more access</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
          Follow your favorite Tamil stars, track upcoming releases, and sync your watchlist across devices when TamilWave accounts launch.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/admin/login"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-wave px-6 py-3 text-sm font-black text-black transition hover:bg-mint"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-line px-6 py-3 text-sm font-bold text-zinc-300 hover:border-wave"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
