"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function TitleError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="shell flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-panel text-wave">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-2xl font-black tracking-tight">Could not load this title</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        {error.message || "Something went wrong while fetching title details. Please try again."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-wave px-5 py-3 text-sm font-black text-black transition hover:bg-mint active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-line bg-panel px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-wave hover:text-wave"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
