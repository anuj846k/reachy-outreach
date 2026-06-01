'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface MessagesChartProps {
  data: { date: string; count: number }[];
}

const chartConfig = {
  count: {
    label: 'Messages',
    color: 'hsl(252, 56%, 57%)',
  },
} satisfies ChartConfig;

export function MessagesChart({ data }: MessagesChartProps) {
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
        <h3 className="text-base font-semibold">Messages Over Time</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
      </div>
      <ChartContainer config={chartConfig} className="h-[320px] w-full">
        <AreaChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(252, 56%, 57%)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(252, 56%, 57%)" stopOpacity={0} />
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
          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
          />
          <Area
            dataKey="count"
            type="monotone"
            fill="url(#fillMessages)"
            stroke="hsl(252, 56%, 57%)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}