import api from './api';

export interface ShareLink {
  _id: string;
  token: string;
  tenantId: string;
  documentId: string;
  createdBy: string;
  title: string;
  description: string;
  expiresAt?: string;
  isActive: boolean;
  viewCount: number;
  chatCount: number;
  createdAt: string;
  updatedAt: string;
  documentId_display?: { fileName: string };
}

export interface PublicShare {
  token: string;
  title: string;
  description: string;
  documentName: string;
  businessName: string;
  businessColor: string;
}

export interface ShareAnalytics {
  viewCount: number;
  chatCount: number;
  totalQueries: number;
  topQuestions: { _id: string; count: number }[];
}

export const shareApi = {
  async create(payload: {
    documentId: string;
    title?: string;
    description?: string;
    expiresInDays?: number;
  }): Promise<ShareLink> {
    const { data } = await api.post('/api/share', payload);
    return data.shareLink;
  },

  async list(): Promise<ShareLink[]> {
    const { data } = await api.get('/api/share');
    return data.shareLinks;
  },

  async update(
    id: string,
    payload: { isActive?: boolean; expiresInDays?: number }
  ): Promise<ShareLink> {
    const { data } = await api.patch(`/api/share/${id}`, payload);
    return data.shareLink;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/api/share/${id}`);
  },

  async getAnalytics(id: string): Promise<ShareAnalytics> {
    const { data } = await api.get(`/api/share/${id}/analytics`);
    return data.analytics;
  },

  async getPublic(token: string): Promise<PublicShare> {
    const { data } = await api.get(`/api/share/public/${token}`);
    return data.share;
  },

  async publicChat(
    token: string,
    question: string
  ): Promise<{
    answer: string;
    sources: { sourceNumber: number; documentName: string; score: number }[];
    duration: string;
  }> {
    const { data } = await api.post(`/api/share/public/${token}/chat`, {
      question,
    });
    return data;
  },
};