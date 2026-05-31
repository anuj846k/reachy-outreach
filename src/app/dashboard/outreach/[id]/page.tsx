import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { getOutreach } from '@/features/outreach/actions';
import { OutreachDetail } from '@/features/outreach/components/outreach-detail';

interface OutreachDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OutreachDetailPage({
  params,
}: OutreachDetailPageProps) {
  const { id } = await params;

  await requireAuth();
  const message = await getOutreach(id);

  if (!message) notFound();

  return (
    <OutreachDetail
      message={{
        ...message,
        offeringName: null,
        prospectName: null,
        prospectJobTitle: null,
        prospectCompany: null,
      }}
    />
  );
}
