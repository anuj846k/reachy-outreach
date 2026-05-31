import { inngest } from './client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { Firecrawl } from 'firecrawl';
import { db } from '@/db/drizzle';
import { offerings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isLinkedInUrl, scrapeLinkedInCompany } from '@/lib/apify-linkedin';
import {
  buildLinkedInExtractionPrompt,
  parseGeminiJson,
} from '@/lib/extractors/gemini-refiner';

const google = createGoogleGenerativeAI();
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

const offeringSchema = {
  type: 'object',
  properties: {
    offeringSummary: {
      type: 'string',
      description: 'What the company or product does',
    },
    idealCustomerProfile: {
      type: 'string',
      description: 'Who they sell to or target audience',
    },
    customerProblems: {
      type: 'string',
      description: 'What problems they solve for customers',
    },
    keyDifferentiators: {
      type: 'string',
      description: 'What makes them different from competitors',
    },
    proofPoints: {
      type: 'string',
      description: 'Evidence, testimonials, or credibility signals',
    },
  },
} as const;

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

export const extractOffering = inngest.createFunction(
  {
    id: 'extract-offering',
    triggers: { event: 'offering/extract' },
  },
  async ({ event, step }) => {
    const { url, offeringId } = event.data;

    // Mark as processing
    await db
      .update(offerings)
      .set({ extractionStatus: 'processing' })
      .where(eq(offerings.id, offeringId));

    try {
      let extractedData: {
        offeringSummary: string | null;
        idealCustomerProfile: string | null;
        customerProblems: string | null;
        keyDifferentiators: string | null;
        proofPoints: string | null;
        rawExtractedData: string | null;
        metadata: Record<string, unknown>;
      };

      if (isLinkedInUrl(url)) {
        const linkedinData = await step.run('scrape-linkedin', async () => {
          const data = await scrapeLinkedInCompany(url);
          if (!data) {
            throw new Error('LinkedIn scrape returned no data');
          }
          return data;
        });

        const { text: extractedText } = await step.ai.wrap(
          'extract-offering-from-linkedin',
          generateText,
          {
            model: google('gemini-2.5-flash'),
            system:
              'You are an expert at extracting business value propositions from company data. Return ONLY valid JSON.',
            prompt: buildLinkedInExtractionPrompt(linkedinData),
          },
        );

        const extracted = parseGeminiJson(extractedText);

        extractedData = {
          ...extracted,
          rawExtractedData: JSON.stringify(linkedinData, null, 2),
          metadata: {
            pageTitle: (linkedinData.name as string) || null,
            pageDescription: (linkedinData.tagline as string) || null,
            faviconUrl: (linkedinData.logo as string) || null,
            ogImageUrl:
              (linkedinData.backgroundCover as string) ||
              (linkedinData.logo as string) ||
              null,
          },
        };
      } else {
        const result = await step.run('call-firecrawl', async () => {
          return await firecrawl.scrape(url, {
            formats: [
              'markdown',
              {
                type: 'json',
                schema: offeringSchema,
                prompt: 'Extract the company offering details',
              },
            ],
            onlyMainContent: true,
            onlyCleanContent: true,
          });
        });

        if (!result) {
          throw new Error('Firecrawl returned no result');
        }

        const extracted = result.json as Record<string, string>;
        const meta = result.metadata as Record<string, unknown>;

        extractedData = {
          offeringSummary: extracted?.offeringSummary || null,
          idealCustomerProfile: extracted?.idealCustomerProfile || null,
          customerProblems: extracted?.customerProblems || null,
          keyDifferentiators: extracted?.keyDifferentiators || null,
          proofPoints: extracted?.proofPoints || null,
          rawExtractedData: result.markdown || null,
          metadata: {
            pageTitle: (meta?.title as string) || null,
            pageDescription: (meta?.description as string) || null,
            faviconUrl: (meta?.favicon as string) || null,
            ogImageUrl: (meta?.ogImage as string) || null,
          },
        };
      }

      await db
        .update(offerings)
        .set({
          offeringSummary: extractedData.offeringSummary,
          idealCustomerProfile: extractedData.idealCustomerProfile,
          customerProblems: extractedData.customerProblems,
          keyDifferentiators: extractedData.keyDifferentiators,
          proofPoints: extractedData.proofPoints,
          rawExtractedData: extractedData.rawExtractedData,
          extractionStatus: 'completed',
          metadata: extractedData.metadata,
        })
        .where(eq(offerings.id, offeringId));

      return { success: true, offeringId };
    } catch (error) {
      await db
        .update(offerings)
        .set({
          extractionStatus: 'failed',
        })
        .where(eq(offerings.id, offeringId));

      throw error;
    }
  },
);
