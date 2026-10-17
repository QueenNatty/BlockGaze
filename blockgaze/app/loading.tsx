import { Skeleton, TableSkeleton } from "@/components/States";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <TableSkeleton />
    </div>
  );
}
