import api from './api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ServerNotification {
  id: string;
  type: string;
  title: string;
  description: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export const notificationApi = {
  async list(): Promise<{
    notifications: ServerNotification[];
    unreadCount: number;
  }> {
    const { data } = await api.get('/api/notifications');
    return data;
  },

  async markRead(id: string) {
    const { data } = await api.patch(`/api/notifications/${id}/read`);
    return data;
  },

  async markAllRead() {
    const { data } = await api.post('/api/notifications/read-all');
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/api/notifications/${id}`);
    return data;
  },
};

export function streamNotifications(
  onEvent: (event: {
    type: 'init' | 'notification' | 'read' | 'readAll';
    data: any;
  }) => void
): () => void {
  const controller = new AbortController();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/stream`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: controller.signal,
      });

      if (!res.ok || !res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const lines = part.split('\n');
          let event = 'message';
          let dataLine = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) event = line.slice(7).trim();
            else if (line.startsWith('data: ')) dataLine = line.slice(6);
          }

          if (event === 'ping') continue;
          if (!dataLine && event !== 'readAll') continue;

          let data: any = {};
          try {
            data = dataLine ? JSON.parse(dataLine) : {};
          } catch {
            continue;
          }

          onEvent({ type: event as any, data });
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    }
  })();

  return () => controller.abort();
}
