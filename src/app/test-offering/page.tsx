import { requireAuth } from '@/lib/auth-utils';
import TestOfferingForm from '@/components/TestOfferingForm';

export default async function TestOfferingPage() {
  const user = await requireAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Offering Extraction</h1>
      <p className="text-gray-600 mb-6">Signed in as: {user.name || user.email}</p>
      <TestOfferingForm userId={user.id} />
    </div>
  );
}
