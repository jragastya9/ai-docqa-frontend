import api from './api';

export interface Plan {
  id: 'free' | 'pro' | 'business';
  name: string;
  price: number;
  currency: string;
  limits: {
    documents: number;
    messagesPerMonth: number;
    teamMembers: number;
  };
  features: string[];
}

export interface Usage {
  documentCount: number;
  messageCount: number;
  aiTokensUsed: number;
  month: string;
}

export interface CurrentBilling {
  tenant: { plan: string; name: string };
  subscription: any;
  usage: Usage;
  plan: Plan;
}

export const billingApi = {
  async listPlans(): Promise<Plan[]> {
    const { data } = await api.get('/api/billing/plans');
    return data.plans;
  },

  async current(): Promise<CurrentBilling> {
    const { data } = await api.get('/api/billing/current');
    return data;
  },

  async subscribe(plan: string): Promise<{
    order: { id: string; amount: number; currency: string };
    key: string;
    mock?: boolean;
  }> {
    const { data } = await api.post('/api/billing/subscribe', { plan });
    return data;
  },

  async verify(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    plan: string;
  }): Promise<any> {
    const { data } = await api.post('/api/billing/verify', payload);
    return data;
  },

  async cancel(): Promise<any> {
    const { data } = await api.post('/api/billing/cancel');
    return data;
  },
};