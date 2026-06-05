import { ExternalLink, Tv } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import type { TitlePlatformLink } from "@/lib/title-service";

const PLATFORM_COLORS: Record<string, string> = {
  netflix: "#e50914",
  "prime-video": "#00a8e1",
  "amazon-prime": "#00a8e1",
  "disney-hotstar": "#0c3b7a",
  zee5: "#8230ff",
  "sony-liv": "#f7b500",
  aha: "#ff6b00",
  "sun-nxt": "#e85d04"
};

function PlatformCard({ platform, external }: { platform: TitlePlatformLink; external: boolean }) {
  const accent = PLATFORM_COLORS[platform.slug] ?? "#00c853";
  const isExternal = external && platform.url.startsWith("http");

  const body = (
    <>
      <span
        className="grid h-14 w-14 place-items-center rounded-xl text-lg font-black text-white shadow-card"
        style={{ background: `linear-gradient(145deg, ${accent}, #141414)` }}
      >
        {platform.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-8 w-8 object-contain" src={platform.logoUrl} loading="lazy" />
        ) : (
          platform.name.charAt(0)
        )}
      </span>
      <span className="text-center text-sm font-bold text-zinc-200 group-hover:text-wave">{platform.name}</span>
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400">
        {isExternal ? "Watch" : "Explore"} <ExternalLink className="h-3 w-3" />
      </span>
    </>
  );

  const className =
    "group flex min-w-[140px] shrink-0 snap-start flex-col items-center gap-3 rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-wave/50 hover:bg-wave/5 active:scale-[0.98] sm:min-w-[156px]";

  if (isExternal) {
    return (
      <a
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <a href={platform.url} className={className}>
      {body}
    </a>
  );
}

export function TitlePlatforms({
  platforms,
  hasDirectLinks
}: {
  platforms: TitlePlatformLink[];
  hasDirectLinks: boolean;
}) {
  if (!platforms.length) return null;

  return (
    <section className="mt-12 sm:mt-14">
      <SectionHeader
        eyebrow="Where to watch"
        title="Streaming platforms"
        icon={<Tv className="h-5 w-5 text-wave" />}
      />
      <p className="mb-4 -mt-2 text-sm text-zinc-500">
        {hasDirectLinks
          ? "Official platform links for this title."
          : "Browse this title across popular streaming services."}
      </p>
      <div className="rail-fade relative">
        <div className="rail-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:px-8">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              external={hasDirectLinks}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
