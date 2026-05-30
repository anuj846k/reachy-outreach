'use server';

import { inngest } from '@/inngest/client';

export async function triggerAI() {
  await inngest.send({ name: 'execute/ai' });
  return { success: true, message: 'AI generation triggered' };
}
