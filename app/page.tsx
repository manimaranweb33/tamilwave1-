import { Suspense } from "react";
import { HomepageV2Sections } from "@/components/homepage/v2/home-v2-sections";
import { ContentRailSkeleton, HeroSkeleton } from "@/components/ui/skeleton";

export const revalidate = 60;

function HomepageFallback() {
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

export default function Home() {
  return (
    <Suspense fallback={<HomepageFallback />}>
      <HomepageV2Sections />
    </Suspense>
  );
}
