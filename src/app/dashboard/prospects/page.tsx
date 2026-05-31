import { requireAuth } from '@/lib/auth-utils';
import { getProspects } from '@/features/prospects/actions';
import { ProspectsView } from '@/features/prospects/components/prospects-view';

export default async function ProspectsPage() {
  const user = await requireAuth();
  const prospects = await getProspects(user.id);

  return <ProspectsView userId={user.id} prospects={prospects} />;
}
