"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogIn, Sparkles } from "lucide-react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

function SignInPromoSectionInner() {
  const { data: session, status } = useSession();
  if (status === "loading" || session?.user) return null;

  return (
    <section id="sign-in-promo" className="shell mt-12 scroll-mt-24 sm:mt-14">
      <div className="rounded-2xl border border-wave/20 bg-[#1a1608] px-6 py-8 text-center sm:px-10 sm:py-10">
        <Sparkles className="mx-auto h-8 w-8 text-wave" />
        <h2 className="mt-4 text-2xl font-black sm:text-3xl">Sign in for more access</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
          Follow your favorite Tamil stars, track upcoming releases, and sync your watchlist across devices.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-wave px-6 py-3 text-sm font-black text-black transition hover:bg-mint"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-line px-6 py-3 text-sm font-bold text-zinc-300 hover:border-wave"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SignInPromoSection() {
  return (
    <UserSessionProvider>
      <SignInPromoSectionInner />
    </UserSessionProvider>
  );
}
