'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProspectCard } from './prospect-card';
import { Prospect } from '@/features/prospects/lib/utils';

interface ProspectsListProps {
  prospects: Prospect[];
}

const POLL_INTERVAL_MS = 4000;

export function ProspectsList({ prospects }: ProspectsListProps) {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasPending = prospects.some(
    (p) => p.extractionStatus === 'pending' || p.extractionStatus === 'processing',
  );

  useEffect(() => {
    if (hasPending) {
      intervalRef.current = setInterval(() => {
        router.refresh();
      }, POLL_INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasPending, router]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {prospects.map((prospect) => (
        <ProspectCard key={prospect.id} {...prospect} />
      ))}
    </div>
  );
}
