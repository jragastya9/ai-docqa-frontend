'use client';

const STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = 1;

export interface CookieConsent {
  version: number;
  essential: true;      // always true
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
}

export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent({
  analytics,
  marketing,
}: {
  analytics: boolean;
  marketing: boolean;
}) {
  if (typeof window === 'undefined') return;
  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    essential: true,
    analytics,
    marketing,
    acceptedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  // Notify listeners
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
}

export function clearConsent() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: null }));
}

export function hasConsented(): boolean {
  return getConsent() !== null;
}
