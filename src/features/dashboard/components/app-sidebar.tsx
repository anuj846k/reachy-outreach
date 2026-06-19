'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { navItems } from './nav-items';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';

interface AppSidebarProps {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible='icon' className='border-r border-sidebar-border'>
      <SidebarHeader className='pb-2 pt-3'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
              className='hover:bg-transparent data-active:bg-transparent group/logo'
            >
              <Link href='/dashboard' className='flex items-center gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 shadow-2xs group-hover/logo:scale-105 transition-all duration-300'>
                  <Image
                    src='/logos/logo.svg'
                    alt='Reachy'
                    className='h-5 w-5 transition-transform duration-500 group-hover/logo:rotate-6'
                    height={40}
                    width={40}
                  />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <span className='font-bold text-sm tracking-tight text-sidebar-foreground group-hover/logo:text-primary transition-colors duration-200'>
                    Reachy
                  </span>
                  <span className='text-[10px] text-sidebar-foreground/50 font-medium tracking-wide uppercase leading-none'>
                    Pro
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className='py-2'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40 px-3 pb-1'>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent className='px-1'>
            <SidebarMenu className='gap-1'>
              {navItems.map((item) => {
                const isActive =
                  item.url === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname === item.url ||
                      pathname?.startsWith(item.url + '/');

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        'h-9 px-3 transition-all duration-200 relative group/btn',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-2xs'
                          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      )}
                    >
                      <Link
                        href={item.url}
                        className='flex items-center gap-3 w-full'
                      >
                        {isActive && (
                          <span className='absolute left-0 top-[20%] h-[60%] w-1 rounded-r-full bg-sidebar-primary transition-all duration-200' />
                        )}
                        <item.icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover/btn:scale-105',
                            isActive
                              ? 'text-sidebar-primary'
                              : 'text-sidebar-foreground/45 group-hover/btn:text-sidebar-foreground',
                          )}
                        />
                        <span className='transition-transform duration-200 group-hover/btn:translate-x-0.5'>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className='p-3'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='w-full cursor-pointer hover:bg-sidebar-accent/65 active:bg-sidebar-accent/80 transition-all duration-200 border border-transparent hover:border-sidebar-border/30 rounded-xl px-2'
                >
                  <Avatar className='h-8 w-8 border border-primary/20 shadow-2xs shrink-0'>
                    <AvatarImage
                      src={user?.image || ''}
                      alt={user?.name || ''}
                    />
                    <AvatarFallback className=' bg-gradient-to-tr from-primary/20 to-primary/5 text-primary font-bold text-xs'>
                      {user?.name?.slice(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col flex-1 text-left min-w-0 leading-tight gap-0.5'>
                    <span className='truncate font-semibold text-xs text-sidebar-foreground'>
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                    <span className='truncate text-[10px] text-sidebar-foreground/50 font-medium'>
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto h-3.5 w-3.5 text-sidebar-foreground/40' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl p-1.5 shadow-lg border border-sidebar-border/50 bg-sidebar backdrop-blur-md'
                align='start'
              >
                <div className='flex items-center gap-2.5 p-2 rounded-lg bg-sidebar-accent/40 mb-1 border border-sidebar-border/20'>
                  <Avatar className='h-9 w-9  border border-primary/20'>
                    <AvatarImage
                      src={user?.image || ''}
                      alt={user?.name || ''}
                    />
                    <AvatarFallback className=' bg-primary/10 text-primary font-bold text-sm'>
                      {user?.name?.slice(0, 2).toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col text-left min-w-0 leading-tight gap-0.5'>
                    <span className='truncate font-semibold text-xs text-sidebar-foreground'>
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                    <span className='truncate text-[10px] text-sidebar-foreground/50'>
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className='bg-sidebar-border/50 my-1' />
                <DropdownMenuItem
                  className='gap-2.5 cursor-pointer rounded-lg text-xs py-2 px-2.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-150'
                  asChild
                >
                  <Link href='/dashboard'>
                    <span>Dashboard Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='gap-2.5 cursor-pointer rounded-lg text-xs py-2 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors duration-150'
                  onClick={async () => {
                    await authClient.signOut();
                    router.push('/login');
                  }}
                >
                  <LogOut className='h-4 w-4' />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
