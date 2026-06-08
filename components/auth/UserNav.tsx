"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogIn, User } from "lucide-react";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

function UserNavInner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20 rounded-lg bg-panel/50" />;
  }

  if (session?.user) {
    return (
      <Link
        href="/profile"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-panel/50 px-3 py-2 text-xs font-bold text-zinc-200 transition hover:border-wave hover:text-wave"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{session.user.name ?? "Profile"}</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-wave hover:text-wave"
      >
        <LogIn className="h-3.5 w-3.5" />
        Sign In
      </Link>
      <Link
        href="/register"
        className="hidden min-h-[44px] items-center rounded-xl bg-wave px-3 py-2 text-xs font-black text-black transition hover:bg-mint sm:inline-flex"
      >
        Create Account
      </Link>
    </div>
  );
}

export function UserNav() {
  return (
    <UserSessionProvider>
      <UserNavInner />
    </UserSessionProvider>
  );
}
