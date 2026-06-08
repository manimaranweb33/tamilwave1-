"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clapperboard,
  Film,
  Home,
  Image,
  LayoutDashboard,
  MonitorPlay,
  Sparkles,
  Tv
} from "lucide-react";

const links = [
  { href: "/editor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/editor/movies", label: "Movies", icon: Film },
  { href: "/editor/series", label: "Web Series", icon: Tv },
  { href: "/editor/dubbed", label: "Dubbed", icon: Clapperboard },
  { href: "/editor/content", label: "All Content", icon: Film },
  { href: "/editor/platforms", label: "Platforms", icon: MonitorPlay },
  { href: "/editor/media", label: "Media Library", icon: Image },
  { href: "/editor/homepage", label: "Homepage", icon: Sparkles }
];

export function EditorSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-line bg-panel p-4">
      <Link href="/" className="mb-6 block text-sm font-black text-wave">
        TamilWave Editor
      </Link>
      <nav className="grid gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/editor" && pathname.startsWith(href));
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
