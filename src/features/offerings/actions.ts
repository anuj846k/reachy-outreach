'use server';

import { inngest } from '@/inngest/client';
import { db } from '@/db/drizzle';
import { offerings } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { isLinkedInUrl } from '@/lib/apify-linkedin';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export interface ManualOfferingData {
  userId: string;
  name: string;
  offeringSummary?: string;
  idealCustomerProfile?: string;
  customerProblems?: string;
  keyDifferentiators?: string;
  proofPoints?: string;
}

export interface UpdateOfferingData {
  name: string;
  offeringSummary?: string | null;
  idealCustomerProfile?: string | null;
  customerProblems?: string | null;
  keyDifferentiators?: string | null;
  proofPoints?: string | null;
  sourceUrl?: string | null;
}

export async function createOfferingWithExtraction(formData: {
  name: string;
  sourceUrl: string;
  userId: string;
}) {
  const { name, sourceUrl, userId } = formData;

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

  await inngest.send({
    name: 'offering/extract',
    data: { url: sourceUrl, offeringId: offering.id },
  });

  revalidatePath('/dashboard/offerings');

  return {
    success: true,
    offeringId: offering.id,
    message: 'Extraction started',
  };
}

export async function getOffering(id: string) {
  const [offering] = await db
    .select()
    .from(offerings)
    .where(eq(offerings.id, id))
    .limit(1);

  return offering ?? null;
}

export async function getOfferings(userId: string) {
  const rows = await db
    .select({
      id: offerings.id,
      name: offerings.name,
      sourceUrl: offerings.sourceUrl,
      sourceType: offerings.sourceType,
      extractionStatus: offerings.extractionStatus,
      createdAt: offerings.createdAt,
      metadata: offerings.metadata,
    })
    .from(offerings)
    .where(eq(offerings.userId, userId))
    .orderBy(desc(offerings.createdAt));

  return rows;
}

export async function deleteOffering(id: string) {
  const user = await requireAuth();

  const [deleted] = await db
    .delete(offerings)
    .where(and(eq(offerings.id, id), eq(offerings.userId, user.id)))
    .returning({ id: offerings.id });

  if (!deleted) {
    throw new Error('Offering not found or you do not have permission to delete it.');
  }

  revalidatePath('/dashboard/offerings');
  return { success: true };
}

export async function createManualOffering(data: ManualOfferingData) {
  const {
    userId,
    name,
    offeringSummary,
    idealCustomerProfile,
    customerProblems,
    keyDifferentiators,
    proofPoints,
  } = data;

  const [offering] = await db
    .insert(offerings)
    .values({
      id: randomUUID(),
      userId,
      name,
      sourceType: 'manual',
      extractionStatus: 'completed',
      offeringSummary: offeringSummary || null,
      idealCustomerProfile: idealCustomerProfile || null,
      customerProblems: customerProblems || null,
      keyDifferentiators: keyDifferentiators || null,
      proofPoints: proofPoints || null,
    })
    .returning();

  if (!offering) {
    throw new Error('Failed to create offering');
  }

  revalidatePath('/dashboard/offerings');
  return { success: true, offeringId: offering.id };
}

export async function updateOffering(id: string, data: UpdateOfferingData) {
  const user = await requireAuth();

  const [updated] = await db
    .update(offerings)
    .set({
      name: data.name,
      offeringSummary: data.offeringSummary ?? null,
      idealCustomerProfile: data.idealCustomerProfile ?? null,
      customerProblems: data.customerProblems ?? null,
      keyDifferentiators: data.keyDifferentiators ?? null,
      proofPoints: data.proofPoints ?? null,
      sourceUrl: data.sourceUrl ?? null,
    })
    .where(and(eq(offerings.id, id), eq(offerings.userId, user.id)))
    .returning({ id: offerings.id });

  if (!updated) {
    throw new Error('Offering not found or you do not have permission to edit it.');
  }

  revalidatePath('/dashboard/offerings');
  revalidatePath(`/dashboard/offerings/${id}`);
  return { success: true };
}
