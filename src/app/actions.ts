'use server';

import { inngest } from '@/inngest/client';
import { db } from '@/db/drizzle';
import { offerings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { isLinkedInUrl } from '@/lib/apify-linkedin';

export async function triggerAI() {
  await inngest.send({ name: 'execute/ai' });
  return { success: true, message: 'AI generation triggered' };
}

export async function createOfferingWithExtraction(formData: {
  name: string;
  sourceUrl: string;
  userId: string;
}) {
  const { name, sourceUrl, userId } = formData;

  // Create offering in DB with pending status
  const [offering] = await db
    .insert(offerings)
    .values({
      id: randomUUID(),
      name,
      userId,
      sourceUrl,
      sourceType: isLinkedInUrl(sourceUrl) ? 'linkedin' : 'website',
      extractionStatus: 'pending',
    })
    .returning();

  if (!offering) {
    throw new Error('Failed to create offering');
  }

  // Trigger Inngest background job
  await inngest.send({
    name: 'offering/extract',
    data: { url: sourceUrl, offeringId: offering.id },
  });

  return {
    success: true,
    offeringId: offering.id,
    message: 'Extraction started',
  };
}

export async function getOffering(id: string) {
  const offering = await db
    .select()
    .from(offerings)
    .where(eq(offerings.id, id))
    .limit(1);

  return offering[0] || null;
}
