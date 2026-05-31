import { Skeleton } from '@/components/ui/skeleton';
import { ProspectCardSkeleton } from './prospect-card-skeleton';

const SKELETON_COUNT = 6;

export function ProspectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProspectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
