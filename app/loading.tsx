import { ContentRailSkeleton, HeroSkeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      <HeroSkeleton />
      <div className="shell mt-10 space-y-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="mb-5 h-6 w-56 animate-pulse rounded bg-white/5" />
            <ContentRailSkeleton count={8} />
          </div>
        ))}
      </div>
    </>
  );
}
