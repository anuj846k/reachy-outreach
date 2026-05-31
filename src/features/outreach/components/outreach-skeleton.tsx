import { Skeleton } from '@/components/ui/skeleton';
import { OutreachCardSkeleton } from './outreach-card-skeleton';

const SKELETON_COUNT = 6;

export function OutreachSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <OutreachCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
