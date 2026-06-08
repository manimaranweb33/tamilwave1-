"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";
import { Star } from "lucide-react";

function TitleRatingInner({ slug, initialScore }: { slug: string; initialScore?: number }) {
  const { data: session, status } = useSession();
  const [score, setScore] = useState(initialScore ?? 0);
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!initialScore);

  useEffect(() => {
    if (!session?.user) return;

    let active = true;
    fetch(`/api/user/ratings?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || data?.score == null) return;
        setScore(data.score);
        setSaved(true);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [session?.user, slug]);

  async function rate(value: number) {
    if (!session?.user) return;
    setSaving(true);
    const res = await fetch("/api/user/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, score: value })
    });
    setSaving(false);
    if (res.ok) {
      setScore(value);
      setSaved(true);
    }
  }

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <div className="rounded-xl border border-line bg-panel/60 px-4 py-3">
        <p className="text-sm text-zinc-400">Sign in to rate this title.</p>
        <Link href={`/login?callbackUrl=/title/${slug}`} className="mt-2 inline-block text-sm font-bold text-wave hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-panel/60 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[.15em] text-zinc-500">Your rating</p>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            disabled={saving}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => rate(value)}
            className="p-0.5 transition disabled:opacity-50"
            aria-label={`Rate ${value} out of 10`}
          >
            <Star
              className={`h-5 w-5 ${
                value <= (hover || score) ? "fill-wave text-wave" : "text-zinc-600"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-bold text-wave">{saved ? `${score}/10` : "Tap to rate"}</span>
      </div>
    </div>
  );
}

export function TitleRating({ slug, initialScore }: { slug: string; initialScore?: number }) {
  return (
    <UserSessionProvider>
      <TitleRatingInner slug={slug} initialScore={initialScore} />
    </UserSessionProvider>
  );
}
