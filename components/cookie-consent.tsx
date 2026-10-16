'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getConsent, saveConsent } from '@/lib/cookie-store';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
    }
  }, []);

  function handleAcceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setVisible(false);
  }

  function handleRejectAll() {
    saveConsent({ analytics: false, marketing: false });
    setVisible(false);
  }

  function handleSavePreferences() {
    saveConsent({ analytics, marketing });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-popover border border-border rounded-xl shadow-2xl pointer-events-auto">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">We use cookies</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Essential cookies keep you logged in. Optional cookies help us
                improve the Service. Read our{' '}
                <Link
                  href="/legal/cookies"
                  className="text-primary hover:underline"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <button
              onClick={handleRejectAll}
              aria-label="Reject all cookies"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {showDetails && (
            <div className="mb-4 space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">Essential</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Required to use the Service. Always on.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  Required
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 pt-3 border-t border-border">
                <div className="flex-1">
                  <p className="text-sm font-medium">Analytics</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Helps us understand how the Service is used.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>

              <div className="flex items-start justify-between gap-3 pt-3 border-t border-border">
                <div className="flex-1">
                  <p className="text-sm font-medium">Marketing</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    We currently don&apos;t use any.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline order-3 sm:order-1 sm:mr-auto"
              >
                Customize
              </button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={showDetails ? handleSavePreferences : handleRejectAll}
              className="order-2"
            >
              {showDetails ? 'Save preferences' : 'Reject non-essential'}
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="order-1 sm:order-3"
            >
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}