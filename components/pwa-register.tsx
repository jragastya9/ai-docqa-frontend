'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Only register in production — avoids dev cache confusion
    if (process.env.NODE_ENV !== 'production') return;

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.error('SW register failed:', err));
    });
  }, []);

  return null;
}
