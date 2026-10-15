'use client';

export type Tenant = {
  name: string;
  plan: string;
  brandName?: string;
  logo?: string;
  primaryColor?: string;
  subdomain?: string;
};

type Listener = (tenant: Tenant | null) => void;

const listeners = new Set<Listener>();

function readFromStorage(): Tenant | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('tenant');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

let current: Tenant | null =
  typeof window !== 'undefined' ? readFromStorage() : null;

export const tenantStore = {
  get(): Tenant | null {
    return current;
  },

  set(tenant: Tenant) {
    current = tenant;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenant', JSON.stringify(tenant));
    }
    listeners.forEach((l) => l(current));
  },

  patch(partial: Partial<Tenant>) {
    if (!current) return;
    this.set({ ...current, ...partial });
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(current);
    return () => {
      listeners.delete(listener);
    };
  },
};
