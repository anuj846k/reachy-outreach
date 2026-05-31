'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OfferingCard } from './offering-card';
import { Offering } from '@/features/offerings/lib/utils';

interface OfferingsListProps {
  offerings: Offering[];
}

const POLL_INTERVAL_MS = 4000;

export function OfferingsList({ offerings }: OfferingsListProps) {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasPending = offerings.some(
    (o) => o.extractionStatus === 'pending' || o.extractionStatus === 'processing',
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
      {offerings.map((offering) => (
        <OfferingCard key={offering.id} {...offering} />
      ))}
    </div>
  );
}
