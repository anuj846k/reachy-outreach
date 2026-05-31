import {
  LayoutDashboard,
  Briefcase,
  Users,
  Mail,
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
    title: 'Outreach',
    url: '/dashboard/outreach',
    icon: Mail,
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
];
