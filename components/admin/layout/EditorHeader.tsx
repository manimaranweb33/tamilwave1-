"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function EditorHeader({ email, role }: { email: string; role: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-line px-6">
      <p className="text-xs text-zinc-500">
        Editor: <span className="font-bold text-zinc-300">{email}</span>
        <span className="ml-2 rounded bg-wave/10 px-2 py-0.5 text-[10px] font-black uppercase text-wave">
          {role}
        </span>
      </p>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/editor/login" })}
        className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-zinc-400 hover:border-wave hover:text-wave"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </button>
    </header>
  );
}
