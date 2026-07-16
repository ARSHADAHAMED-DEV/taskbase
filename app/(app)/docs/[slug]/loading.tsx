import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Skeleton className="mb-4 h-8 w-64" />
      <Skeleton className="h-[60vh]" />
    </div>
  );
}
