"use client";

import { Menu, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/catalog";
import { Logo } from "@/components/logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [light, setLight] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; slug: string; meta: string }[]>([]);
  const updateQuery = (value: string) => setQuery(value);

  useEffect(() => {
    if (query.trim().length < 2) return setSuggestions([]);
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setSuggestions(data.items ?? []))
      .catch(() => undefined);
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    document.documentElement.style.filter = light ? "invert(.9) hue-rotate(180deg)" : "";
  }, [light]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-ink/95 backdrop-blur-xl">
      <div className="shell flex h-[68px] items-center gap-4">
        <Logo />
        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {navItems.map(([label, href]) => (
            <Link className="rounded-lg px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-wave/10 hover:text-wave" href={href} key={href}>{label}</Link>
          ))}
        </nav>
        <div className="relative ml-auto hidden w-64 lg:block xl:ml-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input value={query} onInput={(event) => updateQuery(event.currentTarget.value)} onChange={(event) => updateQuery(event.currentTarget.value)} className="w-full rounded-xl border border-line bg-zinc-900 py-2 pl-9 pr-3 text-xs outline-none transition placeholder:text-zinc-600 focus:border-wave" placeholder="Search movies, series..." />
          {!!suggestions.length && (
            <div className="absolute top-11 w-full rounded-xl border border-line bg-panel p-2 shadow-card">
              {suggestions.map((item) => <Link className="block rounded-lg px-3 py-2 text-xs hover:bg-wave/10 hover:text-wave" href={`/title/${item.slug}`} key={item.slug}><span className="font-bold">{item.title}</span><span className="mt-1 block text-[10px] text-zinc-500">{item.meta}</span></Link>)}
            </div>
          )}
        </div>
        <button onClick={() => setLight(!light)} className="rounded-xl border border-line p-2.5 text-zinc-300 transition hover:border-wave hover:text-wave" aria-label="Toggle light mode">
          {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button onClick={() => setOpen(!open)} className="rounded-xl border border-line p-2.5 xl:hidden" aria-label="Toggle menu">{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
      </div>
      {open && (
        <div className="shell border-t border-line py-3 xl:hidden">
          <form action="/search" className="mb-3 flex items-center rounded-xl border border-line bg-zinc-900 px-3"><Search className="h-4 w-4 text-zinc-500" /><input name="q" className="w-full bg-transparent px-3 py-3 text-sm outline-none" placeholder="Search TamilWave..." /></form>
          <nav className="grid grid-cols-2 gap-1">
            {navItems.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-wave/10 hover:text-wave" href={href} key={href}>{label}</Link>)}
          </nav>
        </div>
      )}
    </header>
  );
}
