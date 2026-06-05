import Link from "next/link";
import { archiveYears } from "@/lib/catalog";
import { Logo } from "@/components/logo";

const exploreLinks = [
  { label: "Tamil Movies", href: "/category/movies" },
  { label: "Web Series", href: "/category/web-series" },
  { label: "Dubbed Movies", href: "/category/dubbed" },
  { label: "Trending", href: "/category/trending" },
  { label: "Latest", href: "/category/latest" },
  { label: "Archive", href: `/archive/${archiveYears[0]}` }
];

const homeAnchors = [
  { label: "Top Tamil Movies", href: "/#top-tamil" },
  { label: "Top Dubbed", href: "/#top-dubbed" },
  { label: "Trending Now", href: "/#trending" },
  { label: "Recently Added", href: "/#recently-added" },
  { label: "Streaming Platforms", href: "/#platforms" }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-[#0a0b0b]">
      <div className="shell grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-500">
            TamilWave is a Tamil entertainment discovery index — movies, web series, dubbed titles, and year-wise archives in one place.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[.2em] text-wave">On this page</p>
          <ul className="grid gap-2.5 text-sm text-zinc-400">
            {homeAnchors.map((link) => (
              <li key={link.href}>
                <Link className="transition hover:text-wave" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[.2em] text-wave">Explore</p>
          <ul className="grid gap-2.5 text-sm text-zinc-400">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition hover:text-wave" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[.2em] text-wave">Information</p>
          <ul className="grid gap-2.5 text-sm text-zinc-400">
            <li>
              <Link className="transition hover:text-wave" href="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-wave" href="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-wave" href="/dmca">
                DMCA
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-wave" href="/search">
                Search
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-zinc-600 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} TamilWave. All rights reserved.</p>
          <p className="text-zinc-700">Tamil movies · Web series · Dubbed entertainment index</p>
        </div>
      </div>
    </footer>
  );
}
