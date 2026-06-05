import { ContentRailSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function TitlePageSkeleton() {
  return (
    <div className="shell py-6 sm:py-8">
      <Skeleton className="mb-6 h-4 w-48" />
      <Skeleton className="h-[420px] w-full rounded-3xl sm:h-[460px]" />
      <div className="mt-8 panel p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-[92%]" />
        <Skeleton className="mt-2 h-4 w-[80%]" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="mb-5 h-6 w-52" />
        <ContentRailSkeleton count={6} />
      </div>
      <div className="mt-12">
        <Skeleton className="mb-5 h-6 w-44" />
        <ContentRailSkeleton count={6} />
      </div>
    </div>
  );
}
