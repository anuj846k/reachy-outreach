'use client';

import { OutreachError } from '@/features/outreach/components/outreach-error';

export default function OutreachErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <OutreachError error={error} reset={reset} />;
}
