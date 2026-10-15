'use client';

import { useEffect, useState } from 'react';

export type OS = 'mac' | 'windows' | 'linux' | 'unknown';

export function useOS(): OS {
  const [os, setOS] = useState<OS>('unknown');

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent.toLowerCase();
    const platform = (navigator.platform || '').toLowerCase();

    if (platform.includes('mac') || ua.includes('mac os')) {
      setOS('mac');
    } else if (platform.includes('win') || ua.includes('windows')) {
      setOS('windows');
    } else if (platform.includes('linux') || ua.includes('linux')) {
      setOS('linux');
    } else {
      setOS('unknown');
    }
  }, []);

  return os;
}

/**
 * Returns the modifier key label for the current OS.
 * - macOS: '⌘'
 * - Windows/Linux: 'Ctrl'
 */
export function useModifierKey(): string {
  const os = useOS();
  return os === 'mac' ? '⌘' : 'Ctrl';
}

/**
 * Returns the full shortcut display, e.g. "⌘K" or "Ctrl K"
 */
export function useShortcutLabel(key: string): string {
  const os = useOS();
  if (os === 'mac') return `⌘${key.toUpperCase()}`;
  if (os === 'unknown') return `Ctrl ${key.toUpperCase()}`;
  return `Ctrl ${key.toUpperCase()}`;
}
