import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function OutreachCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-3/4 rounded-md" />
      </CardHeader>
      <CardContent className="pt-3 space-y-2">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-5/6 rounded-md" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </CardFooter>
    </Card>
  );
}
