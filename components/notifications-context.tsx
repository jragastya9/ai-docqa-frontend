'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  notificationApi,
  streamNotifications,
  type ServerNotification,
} from '@/lib/notification-api';

export type Notification = ServerNotification;

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await notificationApi.list();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('token')) return;

    refresh();

    const stop = streamNotifications((event) => {
      if (event.type === 'init') {
        setUnreadCount(event.data.unreadCount ?? 0);
      } else if (event.type === 'notification') {
        const n: Notification = {
          id: event.data.id,
          type: event.data.type,
          title: event.data.title,
          description: event.data.description,
          href: event.data.href,
          read: false,
          createdAt: event.data.createdAt,
        };
        setNotifications((prev) => [n, ...prev].slice(0, 50));
        setUnreadCount((c) => c + 1);
      } else if (event.type === 'read') {
        setNotifications((prev) =>
          prev.map((x) => (x.id === event.data.id ? { ...x, read: true } : x))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } else if (event.type === 'readAll') {
        setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
        setUnreadCount(0);
      }
    });

    return () => stop();
  }, [refresh]);

  async function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((x) => (x.id === id ? { ...x, read: true } : x))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationApi.markRead(id);
    } catch (err) {
      console.error('Mark read failed:', err);
      refresh();
    }
  }

  async function markAllAsRead() {
    setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnreadCount(0);
    try {
      await notificationApi.markAllRead();
    } catch (err) {
      console.error('Mark all read failed:', err);
      refresh();
    }
  }

  async function clearAll() {
    await markAllAsRead();
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearAll,
        refresh,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider'
    );
  }
  return ctx;
}
