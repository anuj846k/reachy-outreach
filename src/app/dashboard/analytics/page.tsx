import {
  getDashboardStats,
  getStatusBreakdown,
  getTopOfferings,
  getConversationsByDay,
  getMessagesByDay,
} from '@/features/dashboard/actions';
import { StatsCards } from '@/features/dashboard/components/stats-cards';
import {
  StatusDonutChart,
  ConversationsTrendChart,
  TopOfferingsTable,
} from '@/features/dashboard/components/analytics-charts';
import { MessagesChart } from '@/features/dashboard/components/messages-chart';
import { DateRangeFilter } from '@/features/dashboard/components/date-range-filter';
import { Suspense } from 'react';

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = Number(daysParam) || 30;

  const [stats, statusBreakdown, topOfferings, conversationsByDay, messagesByDay] =
    await Promise.all([
      getDashboardStats(),
      getStatusBreakdown(),
      getTopOfferings(),
      getConversationsByDay(days),
      getMessagesByDay(days),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your outreach performance
          </p>
        </div>
        <Suspense>
          <DateRangeFilter />
        </Suspense>
      </div>

      <StatsCards
        totalMessages={stats.totalMessages}
        totalOfferings={stats.totalOfferings}
        totalProspects={stats.totalProspects}
        totalConversations={stats.totalConversations}
        todayMessages={stats.todayMessages}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <StatusDonutChart data={statusBreakdown} />
        <TopOfferingsTable data={topOfferings} />
      </div>

      <MessagesChart data={messagesByDay} />

      <ConversationsTrendChart data={conversationsByDay} />
    </div>
  );
}