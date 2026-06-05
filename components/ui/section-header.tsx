import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  href,
  actionLabel = "See all",
  icon
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  actionLabel?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[.22em] text-wave">{eyebrow}</p>
        ) : null}
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="section-title truncate">{title}</h2>
        </div>
      </div>
      {href ? (
        <Link
          className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-zinc-400 transition hover:bg-wave/10 hover:text-wave"
          href={href}
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
