"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/catalog";
import { Logo } from "@/components/logo";

function SearchBar({
  className = "",
  inputClassName = "",
  onNavigate
}: {
  className?: string;
  inputClassName?: string;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ title: string; slug: string; meta: string }[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(data.items ?? []);
        setOpen(true);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form action="/search" className="relative" onSubmit={() => onNavigate?.()}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          name="q"
          onChange={(event) => setQuery(event.currentTarget.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          className={`w-full min-h-[44px] rounded-xl border border-line bg-zinc-900/90 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-wave focus:ring-1 focus:ring-wave/30 ${inputClassName}`}
          placeholder="Search movies, series, dubbed..."
          autoComplete="off"
          aria-label="Search TamilWave"
          aria-expanded={open}
          aria-controls="search-suggestions"
        />
      </form>
      {open && suggestions.length > 0 ? (
        <div
          id="search-suggestions"
          className="absolute top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-line bg-panel shadow-card"
          role="listbox"
        >
          {suggestions.map((item) => (
            <Link
              className="block border-b border-line/60 px-3 py-2.5 text-sm last:border-0 hover:bg-wave/10"
              href={`/title/${item.slug}`}
              key={item.slug}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              role="option"
            >
              <span className="font-bold text-zinc-100">{item.title}</span>
              <span className="mt-0.5 block text-[11px] text-zinc-500">{item.meta}</span>
            </Link>
          ))}
          <Link
            className="block bg-zinc-900/50 px-3 py-2 text-center text-xs font-bold text-wave hover:bg-wave/10"
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            View all results
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition duration-300 ${
        scrolled ? "border-line bg-ink/98 shadow-[0_8px_24px_rgba(0,0,0,.35)]" : "border-line/70 bg-ink/90"
      } backdrop-blur-xl`}
    >
      <div className="shell flex h-16 items-center gap-3 sm:h-[68px] sm:gap-4">
        <Logo />

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex xl:ml-4" aria-label="Main">
          {navItems.map(([label, href]) => (
            <Link
              className="rounded-lg px-2.5 py-2 text-xs font-bold text-zinc-300 transition hover:bg-wave/10 hover:text-wave xl:px-3"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden min-w-0 flex-1 max-w-md lg:block">
          <SearchBar />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-line bg-panel/50 text-zinc-200 transition hover:border-wave/50 hover:text-wave lg:ml-2"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`fixed inset-0 top-16 z-40 bg-black/60 transition-opacity lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed right-0 top-16 z-50 h-[calc(100dvh-4rem)] w-[min(100%,320px)] border-l border-line bg-ink shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">
          <SearchBar className="mb-4" onNavigate={() => setMenuOpen(false)} />
          <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-wave">Browse</p>
          <nav className="grid gap-1" aria-label="Mobile">
            {navItems.map(([label, href]) => (
              <Link
                onClick={() => setMenuOpen(false)}
                className="min-h-[44px] rounded-xl px-3 py-3 text-sm font-bold text-zinc-300 transition hover:bg-wave/10 hover:text-wave"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-line pt-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-zinc-500">Categories</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link className="rounded-lg border border-line px-3 py-2 text-zinc-400 hover:border-wave hover:text-wave" href="/category/movies" onClick={() => setMenuOpen(false)}>
                Movies
              </Link>
              <Link className="rounded-lg border border-line px-3 py-2 text-zinc-400 hover:border-wave hover:text-wave" href="/category/web-series" onClick={() => setMenuOpen(false)}>
                Web Series
              </Link>
              <Link className="rounded-lg border border-line px-3 py-2 text-zinc-400 hover:border-wave hover:text-wave" href="/category/dubbed" onClick={() => setMenuOpen(false)}>
                Dubbed
              </Link>
              <Link className="rounded-lg border border-line px-3 py-2 text-zinc-400 hover:border-wave hover:text-wave" href="/search" onClick={() => setMenuOpen(false)}>
                Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
