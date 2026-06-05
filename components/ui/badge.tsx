import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "muted" | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "border-line bg-panel text-zinc-300",
  accent: "border-wave/40 bg-wave/10 text-mint",
  muted: "border-transparent bg-white/5 text-zinc-400",
  outline: "border-line bg-transparent text-zinc-300"
};

export function Badge({
  children,
  variant = "default",
  className = ""
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.14em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
