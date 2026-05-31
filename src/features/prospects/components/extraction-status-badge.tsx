'use client';

import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { ExtractionStatus } from '@/features/prospects/lib/utils';

interface ExtractionStatusBadgeProps {
  status: ExtractionStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    iconClassName: 'text-muted-foreground',
  },
  processing: {
    label: 'Processing',
    variant: 'secondary' as const,
    iconClassName: 'animate-spin text-primary',
  },
  completed: {
    label: 'Completed',
    variant: 'default' as const,
    iconClassName: 'text-primary-foreground',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
    iconClassName: 'text-destructive',
  },
};

export function ExtractionStatusBadge({ status, className }: ExtractionStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;

  return (
    <Badge variant={config.variant} className={cn('gap-1', className)}>
      {status === 'processing' ? (
        <Spinner className={cn('size-3', config.iconClassName)} />
      ) : (
        status === 'completed' ? (
          <CheckCircle2 className={cn('size-3', config.iconClassName)} />
        ) : status === 'failed' ? (
          <XCircle className={cn('size-3', config.iconClassName)} />
        ) : (
          <Clock className={cn('size-3', config.iconClassName)} />
        )
      )}
      {config.label}
    </Badge>
  );
}
