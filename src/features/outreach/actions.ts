'use server';

import { db } from '@/db/drizzle';
import { outreachMessages, offerings, prospects, conversationMessages } from '@/db/schema';
import { and, asc, desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { DEFAULT_OUTREACH_TEMPLATE, fillTemplate } from '@/lib/prompt-template';

const google = createGoogleGenerativeAI();

function buildSystemPrompt(
  offering: {
    name: string;
    offeringSummary: string | null;
    idealCustomerProfile: string | null;
    keyDifferentiators: string | null;
  },
  prospect: {
    name: string;
    jobTitle: string | null;
    company: string | null;
    bio: string | null;
    painPoints: string | null;
  },
  tone: string,
  customContext: string | undefined,
  customTemplate: string | undefined,
): string {
  const template = customTemplate || DEFAULT_OUTREACH_TEMPLATE;

  return fillTemplate(template, {
    tone,
    offeringName: offering.name,
    offeringSummary: offering.offeringSummary || 'N/A',
    idealCustomerProfile: offering.idealCustomerProfile || 'N/A',
    keyDifferentiators: offering.keyDifferentiators || 'N/A',
    prospectName: prospect.name,
    prospectJobTitle: prospect.jobTitle || 'N/A',
    prospectCompany: prospect.company || 'N/A',
    prospectBio: prospect.bio || 'N/A',
    prospectPainPoints: prospect.painPoints || 'N/A',
    customContext: customContext || '',
  });
}

function parseOutreachResponse(text: string): {
  subjectLine: string | null;
  content: string;
} {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);
    return {
      subjectLine: parsed.subjectLine || null,
      content: parsed.content || text,
    };
  } catch {
    return {
      subjectLine: null,
      content: text,
    };
  }
}

export async function generateOutreach(data: {
  offeringId: string;
  prospectId: string;
  tone: string;
  customContext?: string;
  customTemplate?: string;
  userId: string;
}) {
  const [offering] = await db
    .select()
    .from(offerings)
    .where(eq(offerings.id, data.offeringId))
    .limit(1);

  const [prospect] = await db
    .select()
    .from(prospects)
    .where(eq(prospects.id, data.prospectId))
    .limit(1);

  if (!offering || !prospect) {
    throw new Error('Offering or prospect not found');
  }

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    system: 'You are an expert sales copywriter. Follow the instructions in the user prompt.',
    prompt: buildSystemPrompt(
      offering,
      prospect,
      data.tone,
      data.customContext,
      data.customTemplate,
    ),
  });

  const parsed = parseOutreachResponse(text);

  const [message] = await db
    .insert(outreachMessages)
    .values({
      id: randomUUID(),
      userId: data.userId,
      offeringId: data.offeringId,
      prospectId: data.prospectId,
      subjectLine: parsed.subjectLine,
      content: parsed.content,
      tone: data.tone,
      customContext: data.customContext || null,
      status: 'draft',
    })
    .returning();

  if (!message) {
    throw new Error('Failed to save outreach message');
  }

  revalidatePath('/dashboard/outreach');

  return { success: true, messageId: message.id };
}

export async function getOutreach(id: string) {
  const [message] = await db
    .select()
    .from(outreachMessages)
    .where(eq(outreachMessages.id, id))
    .limit(1);

  return message ?? null;
}

export async function getOutreaches(userId: string) {
  const rows = await db
    .select({
      id: outreachMessages.id,
      offeringId: outreachMessages.offeringId,
      prospectId: outreachMessages.prospectId,
      subjectLine: outreachMessages.subjectLine,
      content: outreachMessages.content,
      tone: outreachMessages.tone,
      customContext: outreachMessages.customContext,
      status: outreachMessages.status,
      createdAt: outreachMessages.createdAt,
    })
    .from(outreachMessages)
    .where(eq(outreachMessages.userId, userId))
    .orderBy(desc(outreachMessages.createdAt));

  return rows;
}

export async function getOutreachesWithNames(userId: string) {
  const rows = await db
    .select({
      id: outreachMessages.id,
      offeringId: outreachMessages.offeringId,
      prospectId: outreachMessages.prospectId,
      subjectLine: outreachMessages.subjectLine,
      content: outreachMessages.content,
      tone: outreachMessages.tone,
      status: outreachMessages.status,
      createdAt: outreachMessages.createdAt,
      offeringName: offerings.name,
      prospectName: prospects.name,
    })
    .from(outreachMessages)
    .leftJoin(offerings, eq(outreachMessages.offeringId, offerings.id))
    .leftJoin(prospects, eq(outreachMessages.prospectId, prospects.id))
    .where(eq(outreachMessages.userId, userId))
    .orderBy(desc(outreachMessages.createdAt));

  return rows;
}

export async function deleteOutreach(id: string) {
  const user = await requireAuth();

  const [deleted] = await db
    .delete(outreachMessages)
    .where(
      and(
        eq(outreachMessages.id, id),
        eq(outreachMessages.userId, user.id),
      ),
    )
    .returning({ id: outreachMessages.id });

  if (!deleted) {
    throw new Error(
      'Outreach message not found or you do not have permission to delete it.',
    );
  }

  revalidatePath('/dashboard/outreach');
  return { success: true };
}

export async function updateOutreachStatus(
  id: string,
  status: 'draft' | 'sent' | 'archived',
) {
  const user = await requireAuth();

  const [updated] = await db
    .update(outreachMessages)
    .set({ status })
    .where(
      and(
        eq(outreachMessages.id, id),
        eq(outreachMessages.userId, user.id),
      ),
    )
    .returning({ id: outreachMessages.id });

  if (!updated) {
    throw new Error('Outreach message not found.');
  }

  revalidatePath('/dashboard/outreach');
  return { success: true };
}

export async function updateOutreach(
  id: string,
  data: {
    subjectLine: string | null;
    content: string;
    status?: 'draft' | 'sent' | 'archived';
  },
) {
  const user = await requireAuth();

  const [updated] = await db
    .update(outreachMessages)
    .set({
      subjectLine: data.subjectLine,
      content: data.content,
      status: data.status,
    })
    .where(
      and(
        eq(outreachMessages.id, id),
        eq(outreachMessages.userId, user.id),
      ),
    )
    .returning({ id: outreachMessages.id });

  if (!updated) {
    throw new Error('Outreach message not found or you do not have permission.');
  }

  revalidatePath('/dashboard/outreach');
  revalidatePath(`/dashboard/outreach/${id}`);
  return { success: true };
}

export async function getConversationThread(outreachMessageId: string) {
  const user = await requireAuth();

  const [outreach] = await db
    .select()
    .from(outreachMessages)
    .where(
      and(
        eq(outreachMessages.id, outreachMessageId),
        eq(outreachMessages.userId, user.id),
      ),
    )
    .limit(1);

  if (!outreach) {
    throw new Error('Outreach message not found.');
  }

  const messages = await db
    .select()
    .from(conversationMessages)
    .where(eq(conversationMessages.outreachMessageId, outreachMessageId))
    .orderBy(asc(conversationMessages.createdAt));

  return messages;
}

export async function saveAssistantReply(
  outreachMessageId: string,
  content: string,
) {
  const user = await requireAuth();

  const [outreach] = await db
    .select()
    .from(outreachMessages)
    .where(
      and(
        eq(outreachMessages.id, outreachMessageId),
        eq(outreachMessages.userId, user.id),
      ),
    )
    .limit(1);

  if (!outreach) {
    throw new Error('Outreach message not found.');
  }

  const [saved] = await db
    .insert(conversationMessages)
    .values({
      id: randomUUID(),
      outreachMessageId,
      role: 'assistant',
      content,
    })
    .returning();

  return saved;
}
