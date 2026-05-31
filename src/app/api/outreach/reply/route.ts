export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Allow streaming responses up to 30 seconds

import { NextRequest } from 'next/server';
import { streamText, smoothStream } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { db } from '@/db/drizzle';
import { outreachMessages, conversationMessages, offerings, prospects } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

const google = createGoogleGenerativeAI();

export async function POST(req: NextRequest) {
  try {
    const { outreachMessageId, replyText } = await req.json();

    if (!outreachMessageId || !replyText) {
      return new Response('Missing outreachMessageId or replyText', { status: 400 });
    }

    const [outreach] = await db
      .select()
      .from(outreachMessages)
      .where(eq(outreachMessages.id, outreachMessageId))
      .limit(1);

    if (!outreach) {
      return new Response('Outreach message not found', { status: 404 });
    }

    const existingMessages = await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.outreachMessageId, outreachMessageId))
      .orderBy(asc(conversationMessages.createdAt));

    const threadHistory = existingMessages
      .map((m) => `${m.role === 'user' ? 'PROSPECT' : 'SALESPERSON'}: ${m.content}`)
      .join('\n\n');

    let offeringContext = '';
    if (outreach.offeringId) {
      const [offering] = await db
        .select()
        .from(offerings)
        .where(eq(offerings.id, outreach.offeringId))
        .limit(1);
      if (offering) {
        offeringContext = `OFFERING BEING PITCHED:
Name: ${offering.name}
Summary: ${offering.offeringSummary || 'N/A'}
ICP: ${offering.idealCustomerProfile || 'N/A'}
Key Differentiators: ${offering.keyDifferentiators || 'N/A'}`;
      }
    }

    let prospectContext = '';
    if (outreach.prospectId) {
      const [prospect] = await db
        .select()
        .from(prospects)
        .where(eq(prospects.id, outreach.prospectId))
        .limit(1);
      if (prospect) {
        prospectContext = `PROSPECT WHO REPLIED:
Name: ${prospect.name}
Role: ${prospect.jobTitle || 'N/A'} at ${prospect.company || 'N/A'}
Bio: ${prospect.bio || 'N/A'}
Pain Points: ${prospect.painPoints || 'N/A'}`;
      }
    }

    await db.insert(conversationMessages).values({
      id: crypto.randomUUID(),
      outreachMessageId,
      role: 'user',
      content: replyText,
    });

    const systemPrompt = `You are an AI salesperson having a 1-on-1 direct conversation with a prospect.
Your role is to write ONLY the actual copy-pasteable reply that the salesperson will send to the prospect.

${offeringContext ? `${offeringContext}\n\n` : ''}${prospectContext ? `${prospectContext}\n\n` : ''}${threadHistory ? `CONVERSATION HISTORY:\n${threadHistory}\n\n` : ''}PROSPECT JUST REPLIED: ${replyText}

Rules:
- Write ONLY the actual message copy that will be sent. Do not include greetings or sign-offs unless missing from the conversation flow, and keep them extremely casual and natural.
- Write in a natural, casual, and direct business-casual human tone. Avoid PR-speak, jargon-heavy marketing slogans, and repeating company taglines verbatim.
- MATCH the length, complexity, and pacing of the prospect. If the prospect asks a short, direct 1-sentence question, respond with a short, direct 1-sentence answer. Avoid writing long paragraphs to reply to brief queries.
- Address their specific point, objection, or question directly and honestly instead of side-stepping with generic marketing pitches.
- Vary your message length and structure naturally. Avoid making every message look like exactly two perfectly balanced sentences.
- Keep the tone helpful, authentic, and collaborative.
- Do NOT use brackets or placeholders. Synthesize real, concrete content based on the Offering and Prospect details provided.

Write ONLY the final response copy. No JSON, no subject line, no labels.`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: 'Write your follow-up response now.',
      temperature: 0.7,
      experimental_transform: smoothStream(),
      onError({ error }) {
        console.error('Stream error:', error);
      },
      async onFinish({ text }) {
        await db.insert(conversationMessages).values({
          id: crypto.randomUUID(),
          outreachMessageId,
          role: 'assistant',
          content: text,
        });
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Reply stream error:', error);
    return new Response(
      error instanceof Error ? error.message : 'Internal server error',
      { status: 500 },
    );
  }
}
