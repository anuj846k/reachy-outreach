import { requireAuth } from '@/lib/auth-utils';
import { getOutreachesWithNames } from '@/features/outreach/actions';
import { getOfferings } from '@/features/offerings/actions';
import { getProspects } from '@/features/prospects/actions';
import { OutreachView } from '@/features/outreach/components/outreach-view';

export default async function OutreachPage() {
  const user = await requireAuth();

  const [outreaches, offerings, prospects] = await Promise.all([
    getOutreachesWithNames(user.id),
    getOfferings(user.id),
    getProspects(user.id),
  ]);

  return (
    <OutreachView
      userId={user.id}
      offerings={offerings}
      prospects={prospects}
      outreaches={outreaches}
    />
  );
}
