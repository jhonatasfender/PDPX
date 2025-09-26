"use client";

import { Skeleton } from "../ui/skeleton";

export function BagItemsSkeleton() {
  return (
    <>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4"
        >
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </>
  );
}

export function BagSummarySkeleton() {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="border-t border-neutral-800 pt-3 flex justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
