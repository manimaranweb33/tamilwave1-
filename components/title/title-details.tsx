import type { ReactNode } from "react";
import { Clapperboard, Film, Layers, User, Users } from "lucide-react";
import type { TitleDetail } from "@/lib/title-service";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-line/80 py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="text-[10px] font-black uppercase tracking-[.18em] text-zinc-500">{label}</dt>
      <dd className="text-sm font-medium text-zinc-200 sm:max-w-[70%] sm:text-right">{value}</dd>
    </div>
  );
}

export function TitleDetails({ title }: { title: TitleDetail }) {
  const isSeries = title.type === "Web Series";

  return (
    <section className="panel p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-2">
        <Film className="h-5 w-5 text-wave" />
        <h2 className="section-title">About this title</h2>
      </div>

      <p className="subtle max-w-3xl whitespace-pre-line">{title.description}</p>

      <dl className="mt-6 divide-y divide-line/80 rounded-xl border border-line bg-ink/40 px-4 sm:px-5">
        {title.director ? (
          <DetailRow
            label="Director"
            value={
              <span className="inline-flex items-center justify-end gap-2">
                <User className="h-4 w-4 text-wave" />
                {title.director}
              </span>
            }
          />
        ) : null}

        {title.cast.length ? (
          <DetailRow
            label="Cast"
            value={
              <ul className="space-y-2 text-left sm:text-right">
                {title.cast.map((member) => (
                  <li key={`${member.name}-${member.character ?? ""}`}>
                    <span className="inline-flex items-center justify-end gap-2">
                      <Users className="h-4 w-4 shrink-0 text-wave" />
                      <span>
                        {member.name}
                        {member.character ? (
                          <span className="text-zinc-500"> as {member.character}</span>
                        ) : null}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            }
          />
        ) : null}

        <DetailRow label="Release year" value={title.year} />
        <DetailRow label="Status" value={title.statusLabel} />

        {isSeries ? (
          <>
            <DetailRow
              label="Seasons"
              value={title.seriesSeasons != null ? String(title.seriesSeasons) : null}
            />
            <DetailRow
              label="Episodes"
              value={title.seriesEpisodes != null ? String(title.seriesEpisodes) : null}
            />
            <DetailRow
              label="Series status"
              value={
                title.seriesStatus ? (
                  <span className="inline-flex items-center justify-end gap-2">
                    <Layers className="h-4 w-4 text-wave" />
                    {title.seriesStatus}
                  </span>
                ) : null
              }
            />
          </>
        ) : (
          <DetailRow
            label="Format"
            value={
              <span className="inline-flex items-center justify-end gap-2">
                <Clapperboard className="h-4 w-4 text-wave" />
                {title.type} · {title.quality}
              </span>
            }
          />
        )}
      </dl>
    </section>
  );
}
