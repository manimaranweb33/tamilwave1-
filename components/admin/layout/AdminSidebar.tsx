"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Home, LayoutDashboard, Users, Sparkles } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: Film },
  { href: "/admin/homepage", label: "Homepage", icon: Sparkles },
  { href: "/admin/users", label: "Users", icon: Users, superOnly: true }
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-line bg-panel p-4">
      <Link href="/" className="mb-6 block text-sm font-black text-wave">
        TamilWave Admin
      </Link>
      <nav className="grid gap-1">
        {links
          .filter((l) => !l.superOnly || role === "SUPER_ADMIN")
          .map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  active ? "bg-wave/15 text-wave" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        <Link
          href="/"
          className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-wave"
        >
          <Home className="h-4 w-4" />
          View site
        </Link>
      </nav>
    </aside>
  );
}
