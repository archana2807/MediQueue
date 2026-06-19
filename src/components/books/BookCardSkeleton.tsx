import { Skeleton } from "@/components/ui/skeleton";

interface BookCardSkeletonProps {
  view?: "grid" | "list";
}

export default function BookCardSkeleton({ view = "grid" }: BookCardSkeletonProps) {
  if (view === "list") {
    return (
      <div className="flex gap-5 rounded-lg border border-gray-200 bg-white p-4">
        <Skeleton className="h-32 w-24 flex-shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2.5 py-1">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
