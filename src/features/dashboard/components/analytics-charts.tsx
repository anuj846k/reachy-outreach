'use client';

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

interface StatusBreakdownProps {
  data: { status: string; count: number }[];
}

const PIE_COLORS = [
  'hsl(252, 56%, 57%)',
  'hsl(160, 60%, 45%)',
  'hsl(25, 95%, 53%)',
  'hsl(47, 96%, 53%)',
  'hsl(340, 75%, 55%)',
];

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  archived: 'Archived',
};

export function StatusDonutChart({ data }: StatusBreakdownProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const chartData = data.map((d, i) => ({
    name: statusLabels[d.status] ?? d.status,
    value: d.count,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const pieConfig = data.reduce<Record<string, { label: string; color: string }>>(
    (acc, d, i) => {
      acc[d.status] = {
        label: statusLabels[d.status] ?? d.status,
        color: PIE_COLORS[i % PIE_COLORS.length],
      };
      return acc;
    },
    {},
  );

  if (total === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold">Message Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Distribution of outreach states</p>
        </div>
        <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
          No messages yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold">Message Status</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Distribution of outreach states</p>
      </div>
      <ChartContainer config={pieConfig} className="h-[280px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            strokeWidth={2}
            stroke="hsl(var(--card))"
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}

export function StatusBarChart({ data }: StatusBreakdownProps) {
  const chartData = data.map((d, i) => ({
    status: statusLabels[d.status] ?? d.status,
    count: d.count,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const barConfig = data.reduce<Record<string, { label: string; color: string }>>(
    (acc, d, i) => {
      acc[d.status] = {
        label: statusLabels[d.status] ?? d.status,
        color: PIE_COLORS[i % PIE_COLORS.length],
      };
      return acc;
    },
    {},
  );

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold">Messages by Status</h3>
        <p className="text-xs text-muted-foreground mt-0.5">How your outreach is distributed</p>
      </div>
      <ChartContainer config={barConfig} className="h-[280px] w-full">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis dataKey="status" tickLine={false} axisLine={false} fontSize={12} className="text-muted-foreground" />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={11} width={32} className="text-muted-foreground" />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

interface ConversationsTrendProps {
  data: { date: string; count: number }[];
}

const conversationsConfig = {
  count: {
    label: 'Replies',
    color: 'hsl(160, 60%, 45%)',
  },
} satisfies ChartConfig;

export function ConversationsTrendChart({ data }: ConversationsTrendProps) {
  const formatted = data.map((d) => ({
    date: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    count: d.count,
  }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold">Conversation Replies</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
      </div>
      <ChartContainer config={conversationsConfig} className="h-[320px] w-full">
        <LineChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillConversations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            interval="preserveStartEnd"
            fontSize={11}
            className="text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            allowDecimals={false}
            fontSize={11}
            width={32}
            className="text-muted-foreground"
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Line
            dataKey="count"
            type="monotone"
            stroke="var(--color-count)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-count)', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

interface TopOfferingsProps {
  data: { name: string; messageCount: number }[];
}

const BAR_COLORS = [
  'hsl(252, 56%, 57%)',
  'hsl(160, 60%, 45%)',
  'hsl(25, 95%, 53%)',
  'hsl(47, 96%, 53%)',
  'hsl(340, 75%, 55%)',
];

export function TopOfferingsTable({ data }: TopOfferingsProps) {
  const maxCount = Math.max(...data.map((d) => d.messageCount), 1);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold">Top Offerings</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Which offerings generate the most outreach</p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
          No offerings yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold">Top Offerings</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Which offerings generate the most outreach</p>
      </div>
      <div className="space-y-4">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{item.name}</span>
              <span className="text-sm text-muted-foreground shrink-0 ml-4">
                {item.messageCount} {item.messageCount === 1 ? 'message' : 'messages'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.messageCount / maxCount) * 100}%`,
                  backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}