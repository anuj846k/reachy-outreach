import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { getProspect } from '@/features/prospects/actions';
import { ProspectDetailView } from '@/features/prospects/components/prospect-detail';

interface ProspectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProspectDetailPage({ params }: ProspectDetailPageProps) {
  const { id } = await params;

  await requireAuth();
  const prospect = await getProspect(id);

  if (!prospect) notFound();

  return <ProspectDetailView prospect={prospect} />;
}
