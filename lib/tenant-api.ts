import api from './api';

export interface TenantSettings {
  brandName?: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  supportEmail?: string;
  footerText?: string;
  aiProvider?: string;
  customPrompt?: string;
  cachingEnabled?: boolean;
}

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  customDomain?: string | null;
  domainVerified?: boolean;
  plan: 'free' | 'pro' | 'business';
  settings: TenantSettings;
}

export interface PublicBranding {
  name: string;
  slug: string;
  subdomain?: string;
  brandName: string;
  tagline: string;
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  supportEmail: string | null;
  footerText: string | null;
}

export const tenantApi = {
  async me(): Promise<TenantInfo> {
    const { data } = await api.get('/api/tenant/me');
    return data.tenant;
  },

  async updateBranding(settings: TenantSettings) {
    const { data } = await api.patch('/api/tenant/branding', settings);
    return data;
  },

  async updateAISettings(settings: {
    aiProvider?: string;
    customPrompt?: string;
    cachingEnabled?: boolean;
  }) {
    const { data } = await api.patch('/api/tenant/ai', settings);
    return data;
  },

  async getAIStats() {
    const { data } = await api.get('/api/tenant/ai/stats');
    return data;
  },

  async clearAICache() {
    const { data } = await api.post('/api/tenant/ai/cache/clear');
    return data;
  },

  async updateSubdomain(subdomain: string) {
    const { data } = await api.post('/api/tenant/subdomain', { subdomain });
    return data;
  },

  async updateCustomDomain(customDomain: string) {
    const { data } = await api.post('/api/tenant/domain', { customDomain });
    return data;
  },

  async removeCustomDomain() {
    const { data } = await api.delete('/api/tenant/domain');
    return data;
  },

  async getPublicBranding(params: {
    subdomain?: string;
    domain?: string;
    slug?: string;
  }): Promise<PublicBranding> {
    const query = new URLSearchParams(params as any).toString();
    const { data } = await api.get(`/api/tenant/branding?${query}`);
    return data.branding;
  },
};
