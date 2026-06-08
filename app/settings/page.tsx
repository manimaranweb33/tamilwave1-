"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

function SettingsForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    setLoading(false);
    if (res.ok) {
      await update({ name });
      setMessage("Profile updated.");
    } else {
      setMessage("Failed to update profile.");
    }
  }

  return (
    <div className="shell py-10">
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Account</p>
      <h1 className="mt-2 text-3xl font-black">Settings</h1>
      <form onSubmit={save} className="mt-8 max-w-lg grid gap-3 rounded-2xl border border-line bg-panel p-6">
        <label className="text-xs font-bold text-zinc-400">Display name</label>
        <input
          className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm outline-none focus:border-wave"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-xs text-zinc-500">Email: {session?.user?.email}</p>
        {message && <p className="text-sm text-wave">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-wave py-3 text-sm font-black text-black disabled:opacity-50"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-xl border border-line py-3 text-sm font-bold text-zinc-300 hover:border-red-400 hover:text-red-400"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <UserSessionProvider>
      <SettingsForm />
    </UserSessionProvider>
  );
}
