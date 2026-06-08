"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/profile";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    await fetch("/api/user/sync-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        watchlist: JSON.parse(localStorage.getItem("tamilwave-watchlist") ?? "[]")
      })
    }).catch(() => undefined);

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthCard
      title="Sign In to TamilWave"
      subtitle="Save titles, build your watchlist, rate movies and get personalized recommendations."
    >
      <div className="grid gap-4">
        <GoogleSignInButton callbackUrl={callbackUrl} />
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-line" />
          OR
          <span className="h-px flex-1 bg-line" />
        </div>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            type="email"
            className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-white outline-none focus:border-wave"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-white outline-none focus:border-wave"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-wave py-3 text-sm font-black text-black disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-wave hover:underline">
            Create Account
          </Link>
        </p>
        <p className="text-center text-xs">
          <Link href="/forgot-password" className="text-zinc-500 hover:text-wave">
            Forgot password?
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
