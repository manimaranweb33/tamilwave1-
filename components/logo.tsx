import Link from "next/link";

export function Logo() {
  return (
    <Link className="group flex items-center gap-2.5" href="/" aria-label="TamilWave home">
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-wave shadow-glow">
        <span className="absolute -left-2 top-2 h-5 w-10 rotate-[-18deg] rounded-full border-[3px] border-ink/80" />
        <span className="absolute -left-1 top-5 h-5 w-10 rotate-[-18deg] rounded-full border-[3px] border-ink/80" />
      </span>
      <span className="text-[21px] font-black tracking-[-.06em]">Tamil<span className="text-wave">Wave</span></span>
    </Link>
  );
}
