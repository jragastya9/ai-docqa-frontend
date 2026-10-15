'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/components/notifications-context';
import { cn } from '@/lib/utils';

export function NotificationsPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-96 max-w-[calc(100vw-2rem)] z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-3 hover:bg-accent/50 transition-colors flex gap-3',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      {n.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-muted-foreground">
                          {formatRelative(n.createdAt)}
                        </p>
                        {n.href && (
                          <Link
                            href={n.href}
                            onClick={() => {
                              if (!n.read) markAsRead(n.id);
                              setOpen(false);
                            }}
                            className="text-[10px] text-primary hover:underline"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        aria-label="Mark as read"
                        className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0 hover:scale-150 transition"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}
