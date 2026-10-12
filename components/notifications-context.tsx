'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

// Dummy notifications for now — swap for API later
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Welcome to LocalBiz AI! 🎉',
    description: 'Get started by uploading your first PDF.',
    time: 'Just now',
    read: false,
  },
  {
    id: '2',
    title: 'Tip: share your docs',
    description: 'Generate a QR code for your shop.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '3',
    title: 'New feature: Chat history',
    description: 'Your conversations are now saved.',
    time: '1 hour ago',
    read: false,
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
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