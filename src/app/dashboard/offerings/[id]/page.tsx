import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { getOffering } from '@/features/offerings/actions';
import { OfferingDetail } from '@/features/offerings/components/offering-detail';

interface OfferingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OfferingDetailPage({ params }: OfferingDetailPageProps) {
  const { id } = await params;

  await requireAuth();
  const offering = await getOffering(id);

  if (!offering) notFound();

  return <OfferingDetail offering={offering} />;
}
