'use client';

import { OfferingsError } from '@/features/offerings/components/offerings-error';

export default function OfferingsErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <OfferingsError error={error} reset={reset} />;
}
