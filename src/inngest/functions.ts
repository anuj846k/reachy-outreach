import { inngest } from './client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { Firecrawl } from 'firecrawl';
import { db } from '@/db/drizzle';
import {
  conversationMessages,
  offerings,
  outreachMessages,
  prospects,
} from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { isLinkedInUrl, scrapeLinkedInCompany } from '@/lib/apify-linkedin';
import {
  buildLinkedInExtractionPrompt,
  buildConsolidatedProspectPrompt,
  offeringExtractionSchema,
  prospectExtractionSchema,
} from '@/lib/extractors/gemini-refiner';
import { type ProspectSource } from '@/features/prospects/lib/utils';

const google = createGoogleGenerativeAI();
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

const firecrawlOfferingSchema = {
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

const firecrawlProspectSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Full name of the person' },
    jobTitle: { type: 'string', description: 'Current job title or role' },
    company: { type: 'string', description: 'Current company or organization' },
    companyDescription: {
      type: 'string',
      description: 'What the company does (1 sentence)',
    },
    bio: {
      type: 'string',
      description: 'Professional summary or about section (2-3 sentences)',
    },
    painPoints: {
      type: 'string',
      description:
        'Inferred professional challenges based on role and industry',
    },
    skills: {
      type: 'string',
      description: 'Key skills or technologies mentioned, comma-separated',
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

        const result = await step.ai.wrap(
          'extract-offering-from-linkedin',
          generateText,
          {
            model: google('gemini-2.5-flash'),
            output: Output.object({ schema: offeringExtractionSchema }),
            system:
              'You are an expert at extracting business value propositions from company data.',
            prompt: buildLinkedInExtractionPrompt(linkedinData),
          },
        );

        const extracted = result.output;

        if (!extracted) {
          throw new Error('Failed to extract offering data from LinkedIn');
        }

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
                schema: firecrawlOfferingSchema,
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

export const extractProspect = inngest.createFunction(
  {
    id: 'extract-prospect',
    triggers: { event: 'prospect/extract' },
  },
  async ({ event, step }) => {
    const { prospectId, sources = [], prospectName = '' } = event.data;

    if (sources.length === 0) {
      await db
        .update(prospects)
        .set({ extractionStatus: 'completed' })
        .where(eq(prospects.id, prospectId));
      return { success: true, prospectId, reason: 'No sources found' };
    }

    const processingSources: ProspectSource[] = sources.map((s: any) => ({
      ...s,
      status: 'processing',
    }));

    await step.run('set-processing-status', async () => {
      await db
        .update(prospects)
        .set({
          extractionStatus: 'processing',
          sources: processingSources,
        })
        .where(eq(prospects.id, prospectId));
    });

    const scrapedResults: Array<{ url: string; content: string }> = [];
    const finalSources = [...processingSources];
    let profileImageUrl: string | null = null;
    let location: string | null = null;

    for (let i = 0; i < finalSources.length; i++) {
      const source = finalSources[i];
      if (source.type === 'url') {
        try {
          const url = source.value;
          if (isLinkedInUrl(url)) {
            const linkedinData = await step.run(
              `scrape-linkedin-${source.id}`,
              async () => {
                const data = await scrapeLinkedInCompany(url);
                if (!data) {
                  throw new Error('LinkedIn scrape returned no data');
                }
                return data;
              }
            );

            scrapedResults.push({
              url,
              content: JSON.stringify(linkedinData, null, 2),
            });

            if (linkedinData) {
              const photo = ((linkedinData as any).profilePicture?.url as string) || (linkedinData.photo as string) || null;
              if (photo) profileImageUrl = photo;
              const loc = ((linkedinData as any).location?.linkedinText as string) || null;
              if (loc) location = loc;
            }

            source.status = 'completed';
          } else {
            const result = await step.run(
              `scrape-firecrawl-${source.id}`,
              async () => {
                return await firecrawl.scrape(url, {
                  formats: ['markdown'],
                  onlyMainContent: true,
                  onlyCleanContent: true,
                });
              }
            );

            if (result && result.markdown) {
              scrapedResults.push({
                url,
                content: result.markdown,
              });

              const metaImage = (result.metadata as any)?.ogImage as string;
              if (metaImage && !profileImageUrl) {
                profileImageUrl = metaImage;
              }
            } else {
              throw new Error('Firecrawl returned no content');
            }

            source.status = 'completed';
          }
        } catch (err) {
          console.error(`Scrape failed for source ${source.value}:`, err);
          source.status = 'failed';
          source.error = err instanceof Error ? err.message : 'Unknown scraping error';
        }
      }
    }

    await step.run('save-scraped-sources', async () => {
      await db
        .update(prospects)
        .set({ sources: finalSources })
        .where(eq(prospects.id, prospectId));
    });

    if (scrapedResults.length > 0) {
      try {
        const result = await step.ai.wrap(
          'reconcile-prospect-sources',
          generateText,
          {
            model: google('gemini-2.5-flash'),
            output: Output.object({ schema: prospectExtractionSchema }),
            system: 'You are a professional research assistant that synthesizes information from multiple source URLs into a single, unified professional profile.',
            prompt: buildConsolidatedProspectPrompt(scrapedResults),
          }
        );

        const extracted = result.output;

        if (!extracted) {
          throw new Error('Gemini failed to extract consolidated profile');
        }

        await step.run('save-prospect-insights', async () => {
          await db
            .update(prospects)
            .set({
              name: extracted.name || prospectName,
              jobTitle: extracted.jobTitle || null,
              company: extracted.company || null,
              companyDescription: extracted.companyDescription || null,
              bio: extracted.bio || null,
              painPoints: extracted.painPoints || null,
              skills: extracted.skills || null,
              rawExtractedData: scrapedResults
                .map((r) => `URL: ${r.url}\n\n${r.content}`)
                .join('\n\n====================\n\n'),
              extractionStatus: 'completed',
              metadata: {
                profileImageUrl: profileImageUrl || null,
                location: location || null,
              },
            })
            .where(eq(prospects.id, prospectId));
        });
      } catch (err) {
        console.error('Gemini consolidation failed:', err);
        await db
          .update(prospects)
          .set({ extractionStatus: 'failed' })
          .where(eq(prospects.id, prospectId));
        throw err;
      }
    } else {
      const hasUrlSources = sources.some((s: any) => s.type === 'url');
      await step.run('set-overall-completed-or-failed', async () => {
        await db
          .update(prospects)
          .set({
            extractionStatus: hasUrlSources ? 'failed' : 'completed',
          })
          .where(eq(prospects.id, prospectId));
      });
    }

    return { success: true, prospectId };
  },
);

export const summarizeConversation = inngest.createFunction(
  {
    id: 'summarize-conversation',

    triggers: { event: 'conversation/summarize' },
  },
  async ({ event, step }) => {
    const { outreachMessageId } = event.data;

    const [outreach] = await step.run('fetch-outreach', () =>
      db
        .select()
        .from(outreachMessages)
        .where(eq(outreachMessages.id, outreachMessageId))
        .limit(1),
    );

    const rawMessages = await step.run('fetch-messages', () =>
      db
        .select()
        .from(conversationMessages)
        .where(eq(conversationMessages.outreachMessageId, outreachMessageId))
        .orderBy(asc(conversationMessages.createdAt)),
    );

    const activeCount = rawMessages.length <= 6 ? 2 : 4;
    const messagesToSummarize = rawMessages.slice(0, -activeCount);
    if (messagesToSummarize.length === 0)
      return { success: false, reason: 'No messages to summarize' };

    const formattedMessages = messagesToSummarize
      .map(
        (m) =>
          `${m.role === 'user' ? 'PROSPECT' : 'SALESPERSON'}: ${m.content}`,
      )
      .join('\n\n');

    const oldSummary = outreach.rollingSummary || 'No old summary exists.';

    const systemPrompt = `You are a helpful assistant specialized in writing highly compressed, objective summaries of sales conversation histories.
Your task is to merge the OLD SUMMARY with the NEW BATCH OF MESSAGES and output a consolidated NEW SUMMARY.

Rules:
- The summary must be extremely concise and direct (under 3 sentences max).
- It must state key agreements, specific objections (e.g., refund queries, pricing discussions), and the current state of the relationship.
- Avoid repeating details. Write in a neutral, objective business tone.
- Do NOT output greetings, conversational filler, or headers. Write ONLY the summary copy.`;

    const promptText = `
OLD SUMMARY:
${oldSummary}

NEW BATCH OF MESSAGES TO INCORPORATE:
${formattedMessages}

Generate the updated, consolidated summary now (under 3 sentences):`;

    const { text: newSummary } = await step.ai.wrap(
      'generate-summary',
      generateText,
      {
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        prompt: promptText,
      },
    );

    await step.run('save-summary', () =>
      db
        .update(outreachMessages)
        .set({ rollingSummary: newSummary.trim() })
        .where(eq(outreachMessages.id, outreachMessageId)),
    );

    return { success: true, outreachMessageId };
  },
);
