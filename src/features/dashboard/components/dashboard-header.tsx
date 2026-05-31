'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { navItems } from '@/features/dashboard/components/nav-items';

function getPageTitle(pathname: string) {
  if (pathname === '/dashboard') return 'Dashboard';
  
  const item = navItems.find(
    (item) => pathname === item.url || pathname.startsWith(item.url + '/')
  );
  
  return item?.title || 'Dashboard';
}

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-30">
      <SidebarTrigger className="-ml-1" />
      <div className="h-4 w-px bg-border" />
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
    </header>
  );
}
