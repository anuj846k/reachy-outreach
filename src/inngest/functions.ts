import { inngest } from './client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI();

export const executeAI = inngest.createFunction(
  {
    id: 'execute-ai',
    triggers: { event: 'execute/ai' },
  },
  async ({ event, step }) => {
    console.log('Received event:', event);
    const { steps } = await step.ai.wrap('google-generate-text', generateText, {
      system: 'You are a helpful assistant  that provides concise answers.',
      model: google('gemini-2.5-flash'),
      prompt: "write something on the topic of 'AI in 2028'",
    });

    return steps;
  },
);
