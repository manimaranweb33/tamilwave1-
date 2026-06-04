import Link from "next/link";
import { Logo } from "@/components/logo";
import { archiveYears } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-[#0d0e0e]">
      <div className="shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><Logo /><p className="mt-4 max-w-sm text-xs leading-6 text-zinc-500">TamilWave is an entertainment discovery index for Tamil movies, web series, dubbed titles and archive browsing.</p></div>
        <div><p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-wave">Explore</p><div className="grid gap-2 text-sm text-zinc-400"><Link href="/category/movies">Tamil Movies</Link><Link href="/category/web-series">Web Series</Link><Link href="/category/dubbed">Dubbed Movies</Link><Link href={`/archive/${archiveYears[0]}`}>Archive</Link></div></div>
        <div><p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-wave">Information</p><div className="grid gap-2 text-sm text-zinc-400"><Link href="/contact">Contact</Link><Link href="/privacy">Privacy Policy</Link><Link href="/dmca">DMCA</Link></div></div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-zinc-600">© {new Date().getFullYear()} TamilWave. Original design.</div>
    </footer>
  );
}
