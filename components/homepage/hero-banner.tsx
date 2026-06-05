import Link from "next/link";
import { Play, Radio, Sparkles } from "lucide-react";
import { archiveYears } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";

type HeroBannerProps = {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  backgroundImageUrl?: string | null;
};

export function HeroBanner({ title, subtitle, ctaHref, ctaLabel, backgroundImageUrl }: HeroBannerProps) {
  return (
    <section id="top" className="shell scroll-mt-24 pt-4 sm:pt-7">
      <div
        className="hero-banner relative overflow-hidden rounded-2xl border border-wave/20 bg-[#121816] shadow-glow sm:rounded-3xl"
        style={
          backgroundImageUrl
            ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 85% 35%, #00c853 0, transparent 28%), radial-gradient(circle at 20% 100%, #00662b 0, transparent 40%)"
          }}
          aria-hidden
        />
        <div className="absolute -right-6 -top-20 hidden h-[360px] w-[280px] rotate-12 rounded-[48px] border border-white/10 bg-white/[.04] md:block" aria-hidden />

        <div className="relative grid gap-6 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:py-16">
          <div className="max-w-2xl">
            <Badge variant="accent" className="mb-4 gap-1.5 px-3 py-1">
              <Sparkles className="h-3 w-3" />
              Tamil entertainment index
            </Badge>
            <h1 className="text-balance font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-wave px-5 py-3 text-sm font-black text-black transition hover:bg-mint active:scale-[0.98]"
                href={ctaHref}
              >
                <Play className="h-4 w-4 fill-current" />
                {ctaLabel}
              </Link>
              <Link
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-wave hover:text-wave active:scale-[0.98]"
                href={`/archive/${archiveYears[0]}`}
              >
                <Radio className="h-4 w-4" />
                Browse Archive
              </Link>
            </div>
          </div>

          <div className="hidden gap-2 lg:grid">
            {["New releases", "Top Tamil picks", "Dubbed hits"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-bold text-zinc-300 backdrop-blur-sm"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
