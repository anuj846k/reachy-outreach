'use client';

import { ProspectsError } from '@/features/prospects/components/prospects-error';

export default function ProspectsErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ProspectsError error={error} reset={reset} />;
}
