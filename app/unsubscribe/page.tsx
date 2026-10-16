'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, Loader2, MailX, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

function UnsubscribeContent() {
  const params = useSearchParams();
  const userId = params.get('u');
  const type = params.get('t') || 'marketing';

  const [prefs, setPrefs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('Invalid link');
      setLoading(false);
      return;
    }
    api
      .get(`/api/marketing/preferences/${userId}`)
      .then((res) => setPrefs(res.data))
      .catch(() => setError('Could not load preferences'))
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleUnsubscribe() {
    if (!userId) return;
    setSaving(true);
    try {
      await api.post('/api/marketing/unsubscribe', { userId, type });
      setDone(true);
      toast.success('You have been unsubscribed');
    } catch {
      toast.error('Failed to unsubscribe');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-5">
          {error ? (
            <>
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
              <h1 className="text-xl font-bold">Invalid link</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
            </>
          ) : done ? (
            <>
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <h1 className="text-xl font-bold">You're unsubscribed</h1>
              <p className="text-sm text-muted-foreground">
                You won't receive these emails anymore. You'll still get
                important account emails (password resets, receipts).
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                <MailX className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Unsubscribe</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Stop receiving marketing emails at{' '}
                  <strong>{prefs?.email}</strong>?
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button onClick={handleUnsubscribe} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Unsubscribe
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
