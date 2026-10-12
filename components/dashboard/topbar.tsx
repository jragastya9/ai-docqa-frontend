'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from './sidebar';
import { ThemeToggle } from '@/components/marketing/theme-toggle';

interface TopbarProps {
  user: { name: string; email: string } | null;
}

export function Topbar({ user }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tenant, setTenant] = useState<{ name: string; plan: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('tenant');
    if (stored) {
      try {
        setTenant(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  function logout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition">
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documents, chats..."
          className="w-full h-9 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            import('sonner').then(({ toast }) =>
              toast.info('No new notifications')
            );
          }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User avatar with dropdown */}
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-3 pl-3 border-l border-border group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md cursor-pointer"
              aria-label="User menu"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {user?.email || ''}
                </p>
              </div>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold transition-all duration-200 group-hover:scale-110 group-hover:ring-2 group-hover:ring-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 p-2 mt-2 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            >
              {/* Tenant header */}
              {tenant && (
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Workspace
                  </p>
                  <p className="text-sm font-semibold truncate">{tenant.name}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">
                    {tenant.plan} plan
                  </p>
                </div>
              )}

              {/* User header */}
              <div className="p-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border my-1" />

              <DropdownMenuItem
                onClick={() => router.push('/settings')}
                className="cursor-pointer gap-3 py-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push('/team')}
                className="cursor-pointer gap-3 py-2"
              >
                <Settings className="w-4 h-4" />
                <span>Team & Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  import('sonner').then(({ toast }) =>
                    toast.info('Billing coming soon')
                  );
                }}
                className="cursor-pointer gap-3 py-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Billing</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  import('sonner').then(({ toast }) =>
                    toast.info('Help center coming soon')
                  );
                }}
                className="cursor-pointer gap-3 py-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>

              <div className="h-px bg-border my-1" />

              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer gap-3 py-2 text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}