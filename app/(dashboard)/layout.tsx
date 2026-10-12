'use client';

import { Suspense, useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { AuthGate } from '@/components/auth-gate';
import { NotificationsProvider } from '@/components/notifications-context';

function TopbarWrapper() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({ name: parsed.name, email: parsed.email });
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
            <aside className="hidden lg:flex w-64 flex-shrink-0">
              <Sidebar />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
              <TopbarWrapper />
              <main className="flex-1 overflow-auto bg-muted/30">
                {children}
              </main>
            </div>
          </div>
        </AuthGate>
      </Suspense>
    </NotificationsProvider>
  );
}