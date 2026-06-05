export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-white/5 ${className}`} />;
}

export function MovieCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-[140px] shrink-0 sm:w-[160px]">
      <Skeleton className={compact ? "aspect-[.8] w-full" : "aspect-[.72] w-full rounded-xl"} />
      <Skeleton className="mt-3 h-3.5 w-[85%]" />
      <Skeleton className="mt-2 h-2.5 w-[55%]" />
    </div>
  );
}

export function RankedMovieCardSkeleton() {
  return (
    <div className="w-[128px] shrink-0 sm:w-[148px]">
      <Skeleton className="aspect-[.72] w-full rounded-xl" />
      <Skeleton className="mt-3 h-3 w-full" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="shell pt-5 sm:pt-8">
      <Skeleton className="h-[320px] w-full rounded-3xl sm:h-[380px]" />
    </div>
  );
}

export function ContentRailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
