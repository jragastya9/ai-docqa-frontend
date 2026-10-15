import api from './api';

export interface TicketReply {
  id: string;
  authorName: string;
  authorRole: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  userEmail?: string;
  replyCount?: number;
  lastReplyAt?: string;
  createdAt: string;
}

export interface TicketDetail extends Ticket {
  replies: TicketReply[];
}

export const supportApi = {
  async create(payload: {
    subject: string;
    description: string;
    category?: string;
    priority?: string;
  }) {
    const { data } = await api.post('/api/support', payload);
    return data;
  },

  async list(): Promise<{ tickets: Ticket[]; isAdmin: boolean }> {
    const { data } = await api.get('/api/support');
    return data;
  },

  async get(id: string): Promise<{ ticket: TicketDetail; isAdmin: boolean }> {
    const { data } = await api.get(`/api/support/${id}`);
    return data;
  },

  async reply(id: string, message: string) {
    const { data } = await api.post(`/api/support/${id}/reply`, { message });
    return data;
  },

  async update(id: string, update: { status?: string; priority?: string }) {
    const { data } = await api.patch(`/api/support/${id}`, update);
    return data;
  },
};
