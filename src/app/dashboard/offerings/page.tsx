import { requireAuth } from '@/lib/auth-utils';
import { getOfferings } from '@/features/offerings/actions';
import { OfferingsView } from '@/features/offerings/components/offerings-view';

export default async function OfferingsPage() {
  const user = await requireAuth();
  const offerings = await getOfferings(user.id);

  return <OfferingsView userId={user.id} offerings={offerings} />;
}
