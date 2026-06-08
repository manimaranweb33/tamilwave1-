"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);
    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join TamilWave to save titles, rate movies, and build your watchlist."
    >
      <div className="grid gap-4">
        <GoogleSignInButton callbackUrl="/profile" />
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-line" />
          OR
          <span className="h-px flex-1 bg-line" />
        </div>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-white outline-none focus:border-wave"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            minLength={8}
          />
          <input
            type="password"
            className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-white outline-none focus:border-wave"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-wave py-3 text-sm font-black text-black disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-wave hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
