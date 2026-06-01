'use server';

import { inngest } from '@/inngest/client';
import { db } from '@/db/drizzle';
import { prospects } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { type ProspectSource } from '@/features/prospects/lib/utils';

export interface CreateProspectWithSourcesData {
  userId: string;
  name: string;
  sources: Array<{ type: 'url'; value: string }>;
  jobTitle?: string;
  company?: string;
  companyDescription?: string;
  bio?: string;
  painPoints?: string;
  skills?: string;
}

export interface UpdateProspectData {
  name: string;
  jobTitle?: string | null;
  company?: string | null;
  companyDescription?: string | null;
  bio?: string | null;
  painPoints?: string | null;
  skills?: string | null;
  sources?: ProspectSource[] | null;
}

export async function createProspectWithSources(
  data: CreateProspectWithSourcesData,
) {
  const {
    userId,
    name,
    sources,
    jobTitle,
    company,
    companyDescription,
    bio,
    painPoints,
    skills,
  } = data;

  const dbSources: ProspectSource[] = sources.map((s) => ({
    id: randomUUID(),
    type: s.type,
    value: s.value,
    status: 'pending',
    error: null,
  }));

  const [prospect] = await db
    .insert(prospects)
    .values({
      id: randomUUID(),
      userId,
      name,
      sources: dbSources,
      extractionStatus: sources.length > 0 ? 'pending' : 'completed',
      jobTitle: jobTitle || null,
      company: company || null,
      companyDescription: companyDescription || null,
      bio: bio || null,
      painPoints: painPoints || null,
      skills: skills || null,
    })
    .returning();

  if (!prospect) {
    throw new Error('Failed to create prospect');
  }

  if (sources.length > 0) {
    await inngest.send({
      name: 'prospect/extract',
      data: {
        prospectId: prospect.id,
        sources: dbSources,
        prospectName: prospect.name,
      },
    });
  }

  revalidatePath('/dashboard/prospects');

  return {
    success: true,
    prospectId: prospect.id,
    message:
      sources.length > 0 ? 'Extraction started' : 'Prospect created manually',
  };
}

export async function getProspect(id: string) {
  const [prospect] = await db
    .select()
    .from(prospects)
    .where(eq(prospects.id, id))
    .limit(1);

  return prospect ?? null;
}

export async function getProspects(userId: string) {
  const rows = await db
    .select({
      id: prospects.id,
      name: prospects.name,
      jobTitle: prospects.jobTitle,
      company: prospects.company,
      sources: prospects.sources,
      extractionStatus: prospects.extractionStatus,
      createdAt: prospects.createdAt,
      metadata: prospects.metadata,
    })
    .from(prospects)
    .where(eq(prospects.userId, userId))
    .orderBy(desc(prospects.createdAt));

  return rows;
}

export async function deleteProspect(id: string) {
  const user = await requireAuth();

  const [deleted] = await db
    .delete(prospects)
    .where(and(eq(prospects.id, id), eq(prospects.userId, user.id)))
    .returning({ id: prospects.id });

  if (!deleted) {
    throw new Error(
      'Prospect not found or you do not have permission to delete it.',
    );
  }

  revalidatePath('/dashboard/prospects');
  return { success: true };
}

export async function updateProspect(id: string, data: UpdateProspectData) {
  const user = await requireAuth();

  const [updated] = await db
    .update(prospects)
    .set({
      name: data.name,
      jobTitle: data.jobTitle ?? null,
      company: data.company ?? null,
      companyDescription: data.companyDescription ?? null,
      bio: data.bio ?? null,
      painPoints: data.painPoints ?? null,
      skills: data.skills ?? null,
      sources: data.sources ?? undefined,
    })
    .where(and(eq(prospects.id, id), eq(prospects.userId, user.id)))
    .returning({ id: prospects.id });

  if (!updated) {
    throw new Error(
      'Prospect not found or you do not have permission to edit it.',
    );
  }

  revalidatePath('/dashboard/prospects');
  revalidatePath(`/dashboard/prospects/${id}`);
  return { success: true };
}
