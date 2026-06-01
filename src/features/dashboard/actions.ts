'use server';

import { db } from '@/db/drizzle';
import { offerings, prospects, outreachMessages, conversationMessages } from '@/db/schema';
import { and, count, eq, sql } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth-utils';

export async function getDashboardStats() {
  const user = await requireAuth();

  const [messageCount] = await db
    .select({ count: count() })
    .from(outreachMessages)
    .where(eq(outreachMessages.userId, user.id));

  const [offeringCount] = await db
    .select({ count: count() })
    .from(offerings)
    .where(eq(offerings.userId, user.id));

  const [prospectCount] = await db
    .select({ count: count() })
    .from(prospects)
    .where(eq(prospects.userId, user.id));

  const [conversationCount] = await db
    .select({ count: count() })
    .from(conversationMessages)
    .innerJoin(outreachMessages, eq(conversationMessages.outreachMessageId, outreachMessages.id))
    .where(eq(outreachMessages.userId, user.id));

  const [todayCount] = await db
    .select({ count: count() })
    .from(outreachMessages)
    .where(
      and(
        eq(outreachMessages.userId, user.id),
        sql`${outreachMessages.createdAt} >= CURRENT_DATE`,
      ),
    );

  return {
    totalMessages: messageCount.count,
    totalOfferings: offeringCount.count,
    totalProspects: prospectCount.count,
    totalConversations: conversationCount.count,
    todayMessages: todayCount.count,
  };
}

export async function getMessagesByDay(days: number = 30) {
  const user = await requireAuth();

  const rows = await db
    .select({
      date: sql<string>`DATE(${outreachMessages.createdAt})`.as('date'),
      count: count().as('count'),
    })
    .from(outreachMessages)
    .where(
      and(
        eq(outreachMessages.userId, user.id),
        sql`${outreachMessages.createdAt} >= NOW() - INTERVAL '${sql.raw(String(days))} days'`,
      ),
    )
    .groupBy(sql`DATE(${outreachMessages.createdAt})`)
    .orderBy(sql`DATE(${outreachMessages.createdAt})`);

  return fillDateGaps(rows, days);
}

export async function getStatusBreakdown() {
  const user = await requireAuth();

  const rows = await db
    .select({
      status: outreachMessages.status,
      count: count(),
    })
    .from(outreachMessages)
    .where(eq(outreachMessages.userId, user.id))
    .groupBy(outreachMessages.status);

  return rows.map((r) => ({
    status: r.status,
    count: r.count,
  }));
}

export async function getTopOfferings() {
  const user = await requireAuth();

  const rows = await db
    .select({
      name: offerings.name,
      messageCount: count(outreachMessages.id),
    })
    .from(offerings)
    .leftJoin(outreachMessages, eq(offerings.id, outreachMessages.offeringId))
    .where(eq(offerings.userId, user.id))
    .groupBy(offerings.id, offerings.name)
    .orderBy(count(outreachMessages.id));

  return rows;
}

export async function getConversationsByDay(days: number = 30) {
  const user = await requireAuth();

  const rows = await db
    .select({
      date: sql<string>`DATE(${conversationMessages.createdAt})`.as('date'),
      count: count().as('count'),
    })
    .from(conversationMessages)
    .innerJoin(outreachMessages, eq(conversationMessages.outreachMessageId, outreachMessages.id))
    .where(
      and(
        eq(outreachMessages.userId, user.id),
        sql`${conversationMessages.createdAt} >= NOW() - INTERVAL '${sql.raw(String(days))} days'`,
      ),
    )
    .groupBy(sql`DATE(${conversationMessages.createdAt})`)
    .orderBy(sql`DATE(${conversationMessages.createdAt})`);

  return fillDateGaps(rows, days);
}

function fillDateGaps(
  rows: { date: string; count: number }[],
  days: number,
): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const map = new Map(rows.map((r) => [r.date, r.count]));

  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    result.push({ date: key, count: map.get(key) ?? 0 });
  }

  return result;
}