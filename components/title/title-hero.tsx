import type { ReactNode } from "react";
import { Calendar, Clock, Languages, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TitleDetail } from "@/lib/title-service";
import { formatRating, formatRuntime } from "@/lib/title-service";

function MetaChip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel px-3 py-2 text-xs text-zinc-300">
      <span className="text-wave">{icon}</span>
      {children}
    </span>
  );
}

export function TitleHero({ title }: { title: TitleDetail }) {
  const runtime = formatRuntime(title.runtimeMinutes);
  const rating = formatRating(title.rating);
  const backdropStyle = title.backdropUrl
    ? { backgroundImage: `url(${title.backdropUrl})` }
    : title.posterUrl
      ? { backgroundImage: `url(${title.posterUrl})` }
      : {
          background: `radial-gradient(circle at 75% 20%, ${title.accent}99, transparent 35%), linear-gradient(145deg, #121816, #111111 65%)`
        };

  const posterBackground = title.posterUrl
    ? `url("${title.posterUrl}") center / cover`
    : `radial-gradient(circle at 68% 24%, ${title.accent}dd, transparent 30%), linear-gradient(145deg, ${title.accent}99, #141414 72%)`;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-[#121816] sm:rounded-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={backdropStyle}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/55" aria-hidden />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 12% 100%, rgba(0,200,83,.22) 0, transparent 42%)"
        }}
        aria-hidden
      />

      <div className="relative grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,200px)_1fr] lg:items-end lg:gap-8 lg:p-10">
        <div
          className="poster-lines relative mx-auto aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-xl shadow-card ring-1 ring-white/10 lg:mx-0 lg:max-w-none"
          style={{ background: posterBackground }}
          role="img"
          aria-label={`${title.title} poster`}
        />

        <div className="min-w-0 pb-1">
          <Badge variant="accent" className="mb-3">
            {title.type}
          </Badge>
          <h1 className="font-display text-3xl font-black leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {title.title}
          </h1>
          {title.originalTitle && title.originalTitle !== title.title ? (
            <p className="mt-2 text-lg text-zinc-400">{title.originalTitle}</p>
          ) : null}
          {title.tamilTitle && title.tamilTitle !== title.title && title.tamilTitle !== title.originalTitle ? (
            <p className="mt-1 text-base text-zinc-500">{title.tamilTitle}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <MetaChip icon={<Calendar className="h-3.5 w-3.5" />}>{title.year}</MetaChip>
            {runtime ? <MetaChip icon={<Clock className="h-3.5 w-3.5" />}>{runtime}</MetaChip> : null}
            {rating ? (
              <MetaChip icon={<Star className="h-3.5 w-3.5 fill-current" />}>
                {rating}
                {title.ratingCount ? (
                  <span className="text-zinc-500"> ({title.ratingCount.toLocaleString()})</span>
                ) : null}
              </MetaChip>
            ) : null}
            <MetaChip icon={<Languages className="h-3.5 w-3.5" />}>{title.language}</MetaChip>
            {title.country ? (
              <MetaChip icon={<MapPin className="h-3.5 w-3.5" />}>{title.country}</MetaChip>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {title.genres.map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
