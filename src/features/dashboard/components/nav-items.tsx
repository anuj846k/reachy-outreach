import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Offerings',
    url: '/dashboard/offerings',
    icon: Briefcase,
  },
  {
    title: 'Prospects',
    url: '/dashboard/prospects',
    icon: Users,
  },
  {
    title: 'Messages',
    url: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
];
