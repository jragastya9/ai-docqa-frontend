'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/marketing/theme-toggle';
import { NotificationsPanel } from '@/components/notifications-panel';
import { useOS } from '@/lib/platform';
import { tenantStore } from '@/lib/tenant-store';

interface TopbarProps {
  user: { name: string; email: string } | null;
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const os = useOS();
  const [tenant, setTenant] = useState<{ name: string; plan: string } | null>(
    null
  );

  useEffect(() => {
    return tenantStore.subscribe(setTenant);
  }, []);

  function openPalette() {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: os === 'mac',
        ctrlKey: os !== 'mac',
        bubbles: true,
      })
    );
  }

  function logout() {
    localStorage.clear();
    router.push('/login');
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const shortcut = os === 'mac' ? '⌘K' : 'Ctrl K';
  const shortcutParts = os === 'mac' ? ['⌘', 'K'] : ['Ctrl', 'K'];

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={openPalette}
          className="w-full flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:bg-accent transition"
        >
          <Search className="w-4 h-4" />
          <span>Search documents, chats...</span>
          <kbd className="ml-auto flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground">
            {shortcutParts.map((part, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded border border-border bg-muted"
              >
                {part}
              </span>
            ))}
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <ThemeToggle />
        <NotificationsPanel />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-md hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email || ''}
                </span>
                {tenant && (
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
                    {tenant.name} · {tenant.plan}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/billing')}
              className="cursor-pointer"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
