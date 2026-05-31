'use client';

import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { ExtractionStatus } from '@/features/offerings/lib/utils';

interface ExtractionStatusBadgeProps {
  status: ExtractionStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    Icon: Clock,
    iconClassName: 'text-muted-foreground',
  },
  processing: {
    label: 'Processing',
    variant: 'secondary' as const,
    Icon: Loader2,
    iconClassName: 'animate-spin text-primary',
  },
  completed: {
    label: 'Completed',
    variant: 'default' as const,
    Icon: CheckCircle2,
    iconClassName: 'text-primary-foreground',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
    Icon: XCircle,
    iconClassName: 'text-destructive',
  },
};

export function ExtractionStatusBadge({ status, className }: ExtractionStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const { label, variant, Icon, iconClassName } = config;

  return (
    <Badge variant={variant} className={cn('gap-1', className)}>
      {status === 'processing' ? (
        <Spinner className={cn('size-3', iconClassName)} />
      ) : (
        <Icon className={cn('size-3', iconClassName)} />
      )}
      {label}
    </Badge>
  );
}
