import api from './api';

export interface AnalyticsOverview {
  success: boolean;
  range: { days: number; since: string; until: string };
  totals: {
    conversations: number;
    messages: number;
    documents: number;
    citations: number;
  };
  period: {
    days: number;
    conversations: number;
    messages: number;
  };
  messagesByDay: Array<{ date: string; label: string; count: number }>;
  topQuestions: Array<{ question: string; count: number }>;
  popularDocuments: Array<{
    id: string;
    name: string;
    pages: number;
    citations: number;
    percentage: number;
  }>;
  deviceBreakdown: Array<{ name: string; value: number; color: string }>;
  usage: {
    documentCount: number;
    messageCount: number;
    aiTokensUsed: number;
  };
}

export const analyticsApi = {
  async overview(days = 30): Promise<AnalyticsOverview> {
    const { data } = await api.get(`/api/analytics/overview?days=${days}`);
    return data;
  },

  async exportCSV(days = 30) {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const base =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/analytics/export?days=${days}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${days}d.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
