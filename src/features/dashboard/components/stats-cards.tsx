import { Mail, Briefcase, Users, MessageSquare, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalMessages: number;
  totalOfferings: number;
  totalProspects: number;
  totalConversations: number;
  todayMessages: number;
}

export function StatsCards({
  totalMessages,
  totalOfferings,
  totalProspects,
  totalConversations,
  todayMessages,
}: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Messages',
      value: totalMessages,
      icon: Mail,
      trend: todayMessages > 0 ? `+${todayMessages} today` : undefined,
    },
    {
      label: 'Offerings',
      value: totalOfferings,
      icon: Briefcase,
      trend: undefined,
    },
    {
      label: 'Prospects',
      value: totalProspects,
      icon: Users,
      trend: undefined,
    },
    {
      label: 'Conversations',
      value: totalConversations,
      icon: MessageSquare,
      trend: undefined,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              {card.label}
            </div>
            <card.icon className="size-4 text-muted-foreground/50" />
          </div>
          <div className="mt-2 text-3xl font-bold">{card.value}</div>
          {card.trend && (
            <div className="mt-1 flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="size-3" />
              {card.trend}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}