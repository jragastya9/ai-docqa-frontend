'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  Users,
  Link2,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { tenantStore } from '@/lib/tenant-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/share', label: 'Share links', icon: Link2 },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [tenant, setTenant] = useState<{ name: string; plan: string } | null>(
    null
  );

  useEffect(() => {
    // Subscribe to the tenant store so plan/name updates live
    // (e.g. immediately after upgrading on the billing page)
    return tenantStore.subscribe(setTenant);
  }, []);

  function logout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-full">
      {/* Logo + Tenant */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 h-16 border-b border-border hover:bg-accent/50 transition"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="block font-bold truncate leading-tight">
            {tenant?.name || 'LocalBiz AI'}
          </span>
          {tenant?.plan && (
            <span className="block text-[10px] font-normal text-muted-foreground uppercase tracking-wide leading-tight">
              {tenant.plan} plan
            </span>
          )}
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}