'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface OutreachErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function OutreachError({ error, reset }: OutreachErrorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Outreach</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate and manage personalized outreach messages
        </p>
      </div>

      <Empty className="min-h-[360px] border border-dashed border-destructive/30">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to load outreach messages</EmptyTitle>
          <EmptyDescription>
            {error.message || 'Something went wrong while fetching your outreach messages.'}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" variant="outline" onClick={reset}>
            <RefreshCw />
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
