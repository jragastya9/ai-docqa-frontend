import api from './api';

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  description: string;
  active: boolean;
  secret: string;
  lastTriggeredAt?: string;
  failureCount: number;
  createdAt: string;
}

export interface WebhookDelivery {
  id: string;
  event: string;
  responseStatus: number | null;
  responseBody: string;
  duration: number;
  success: boolean;
  error: string | null;
  createdAt: string;
}

export interface WebhookListResponse {
  webhooks: Webhook[];
  availableEvents: string[];
}

export const webhookApi = {
  async list(): Promise<WebhookListResponse> {
    const { data } = await api.get('/api/webhooks');
    return data;
  },

  async create(payload: {
    url: string;
    events: string[];
    description?: string;
  }) {
    const { data } = await api.post('/api/webhooks', payload);
    return data;
  },

  async update(id: string, payload: Partial<Webhook>) {
    const { data } = await api.patch(`/api/webhooks/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/api/webhooks/${id}`);
    return data;
  },

  async test(id: string) {
    const { data } = await api.post(`/api/webhooks/${id}/test`);
    return data;
  },

  async deliveries(id: string): Promise<{ deliveries: WebhookDelivery[] }> {
    const { data } = await api.get(`/api/webhooks/${id}/deliveries`);
    return data;
  },

  async regenerateSecret(id: string): Promise<{ secret: string }> {
    const { data } = await api.post(`/api/webhooks/${id}/regenerate-secret`);
    return data;
  },
};
