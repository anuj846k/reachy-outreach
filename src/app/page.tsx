import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';

export default async function HomePage() {
  await requireAuth();
  redirect('/dashboard');
}
