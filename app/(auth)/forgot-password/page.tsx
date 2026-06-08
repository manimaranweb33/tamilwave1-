"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Request failed");
      return;
    }

    setMessage(data.message ?? "Check your email for reset instructions.");
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email and we'll send password reset instructions if an account exists."
    >
      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          type="email"
          className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-white outline-none focus:border-wave"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-green-400">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-wave py-3 text-sm font-black text-black disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
        <p className="text-center text-sm text-zinc-400">
          <Link href="/login" className="font-bold text-wave hover:underline">
            Back to Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
