import api from './api';

export interface DashboardSummary {
  tenant: {
    name: string;
    plan: 'free' | 'pro' | 'business';
    planName: string;
  };
  counts: {
    documents: number;
    conversations: number;
    messagesThisMonth: number;
  };
  limits: {
    documents: number;
    messagesPerMonth: number;
    teamMembers: number;
  };
  usage: {
    documentCount: number;
    messageCount: number;
    aiTokensUsed: number;
    month: string;
  };
  recentDocuments: Array<{
    _id: string;
    fileName: string;
    pageCount: number;
    chunkCount: number;
    status: string;
    createdAt: string;
  }>;
}

export const dashboardApi = {
  async summary(): Promise<DashboardSummary> {
    const { data } = await api.get('/api/dashboard/summary');
    return data;
  },
};