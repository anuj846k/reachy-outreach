import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { extractOffering, extractProspect, summarizeConversation } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [extractOffering, extractProspect, summarizeConversation],
});
