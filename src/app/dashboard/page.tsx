import { getDashboardStats, getMessagesByDay, getConversationsByDay, getStatusBreakdown, getTopOfferings } from '@/features/dashboard/actions';
import { StatsCards } from '@/features/dashboard/components/stats-cards';
import { MessagesChart } from '@/features/dashboard/components/messages-chart';
import { DateRangeFilter } from '@/features/dashboard/components/date-range-filter';
import { Suspense } from 'react';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = Number(daysParam) || 30;

  const [stats, messagesByDay] = await Promise.all([
    getDashboardStats(),
    getMessagesByDay(days),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your outreach activity
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

      <MessagesChart data={messagesByDay} />
    </div>
  );
}