import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function OfferingCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="pt-3">
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </CardFooter>
    </Card>
  );
}
