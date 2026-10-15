import api from './api';

export interface AdminOverview {
  totals: {
    tenants: number;
    users: number;
    documents: number;
    messages: number;
    mrr: number;
    arr: number;
  };
  signups: { today: number; week: number; month: number };
  planDistribution: Array<{ plan: string; count: number }>;
  signupTrend: Array<{ date: string; label: string; count: number }>;
  recentTenants: Array<{
    id: string;
    name: string;
    slug: string;
    plan: string;
    subdomain?: string;
    createdAt: string;
  }>;
}

export interface AdminTenant {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  userCount: number;
  docCount: number;
  mrr: number;
  brandName?: string;
}

export const adminApi = {
  async overview(): Promise<AdminOverview> {
    const { data } = await api.get('/api/admin/overview');
    return data;
  },

  async tenants(params?: { search?: string; plan?: string }) {
    const q = new URLSearchParams(params as any).toString();
    const { data } = await api.get(`/api/admin/tenants?${q}`);
    return data;
  },

  async tenantDetail(id: string) {
    const { data } = await api.get(`/api/admin/tenants/${id}`);
    return data;
  },

  async impersonate(id: string, reason = '') {
    const { data } = await api.post(
      `/api/admin/tenants/${id}/impersonate`,
      { reason }
    );
    return data;
  },

  async changePlan(id: string, plan: string) {
    const { data } = await api.patch(`/api/admin/tenants/${id}/plan`, {
      plan,
    });
    return data;
  },

  async toggleActive(id: string, isActive: boolean) {
    const { data } = await api.patch(`/api/admin/tenants/${id}/active`, {
      isActive,
    });
    return data;
  },

  async updateFeatures(id: string, featureFlags: Record<string, boolean>) {
    const { data } = await api.patch(`/api/admin/tenants/${id}/features`, {
      featureFlags,
    });
    return data;
  },

  async impersonations() {
    const { data } = await api.get('/api/admin/impersonations');
    return data;
  },
};
