import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { executeAI, extractOffering, extractProspect } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeAI, extractOffering, extractProspect],
});
