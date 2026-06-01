'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
] as const;

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const days = Number(searchParams.get('days')) || 30;
  const [, startTransition] = useTransition();

  function handleChange(newDays: number) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('days', String(newDays));
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
      {RANGES.map((range) => (
        <button
          key={range.days}
          onClick={() => handleChange(range.days)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
            days === range.days
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}