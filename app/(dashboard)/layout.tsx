'use client';

import { Suspense, useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { AuthGate } from '@/components/auth-gate';
import { NotificationsProvider } from '@/components/notifications-context';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { BottomNav } from '@/components/dashboard/bottom-nav';

function TopbarWrapper() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ name: parsed.name, email: parsed.email });
      } catch {}
    }
  }, []);

  if (!mounted) {
    return (
      <header className="h-16 border-b border-border bg-card flex-shrink-0" />
    );
  }

  return <Topbar user={user} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <AuthGate>
          <div className="min-h-screen flex">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-64 flex-shrink-0">
              <Sidebar />
            </aside>

            {/* Mobile hamburger + drawer */}
            <MobileNav />

            <div className="flex-1 flex flex-col min-w-0">
              {/* Topbar offset on mobile because hamburger is fixed */}
              <div className="hidden lg:block">
                <TopbarWrapper />
              </div>
              <div className="lg:hidden h-16 border-b border-border bg-card flex-shrink-0" />

              <main className="flex-1 overflow-auto bg-muted/30 pb-20 lg:pb-0">
                {children}
              </main>

              {/* Mobile bottom nav */}
              <BottomNav />
            </div>
          </div>
        </AuthGate>
      </Suspense>
    </NotificationsProvider>
  );
}