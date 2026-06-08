"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function EditorLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
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
      setError("Invalid editor credentials");
      return;
    }
    router.push(params.get("callbackUrl") ?? "/editor");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-line bg-panel p-8 shadow-card"
    >
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">TamilWave</p>
      <h1 className="mt-2 text-2xl font-black">Editor sign in</h1>
      <p className="mt-2 text-sm text-zinc-500">Content management for editors only.</p>
      <div className="mt-6 grid gap-3">
        <input
          type="email"
          className="rounded-xl border border-line bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-wave"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="rounded-xl border border-line bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-wave"
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}

export default function EditorLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
        <EditorLoginForm />
      </Suspense>
    </div>
  );
}
