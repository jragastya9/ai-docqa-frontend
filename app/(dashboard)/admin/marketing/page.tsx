'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  Loader2,
  Play,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminMarketingPage() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [sRes, lRes] = await Promise.all([
        api.get('/api/marketing/stats?days=30'),
        api.get('/api/marketing/logs?limit=50'),
      ]);
      setStats(sRes.data);
      setLogs(lRes.data.logs);
    } catch {
      toast.error('Failed to load marketing data');
    } finally {
      setLoading(false);
    }
  }

  async function runJob(job: 'daily' | 'weekly') {
    setRunning(job);
    try {
      const { data } = await api.post('/api/marketing/run', { job });
      toast.success(`Job run: ${JSON.stringify(data.result)}`);
      await load();
    } catch {
      toast.error('Failed to run job');
    } finally {
      setRunning(null);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to admin
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-3">
            Marketing Emails
          </h1>
          <p className="text-muted-foreground mt-1">
            Email automation · last 30 days
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => runJob('daily')}
            disabled={running === 'daily'}
          >
            {running === 'daily' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run daily
          </Button>
          <Button
            variant="outline"
            onClick={() => runJob('weekly')}
            disabled={running === 'weekly'}
          >
            {running === 'weekly' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run weekly
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <Send className="w-8 h-8 text-primary/60" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loading ? '—' : stats?.totals?.sent || 0}
              </p>
              <p className="text-xs text-muted-foreground">Emails sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-destructive/60" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loading ? '—' : stats?.totals?.failed || 0}
              </p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500/60" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {loading
                  ? '—'
                  : stats?.totals?.total
                  ? Math.round(
                      (stats.totals.sent / stats.totals.total) * 100
                    ) + '%'
                  : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Delivery rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By type */}
      <Card>
        <CardHeader>
          <CardTitle>Emails by type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (stats?.byType || []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No emails sent yet
            </p>
          ) : (
            stats.byType.map((t: any) => (
              <div
                key={t.type}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <span className="text-sm font-mono">{t.type}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-600">{t.sent} sent</span>
                  {t.failed > 0 && (
                    <span className="text-destructive">
                      {t.failed} failed
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent sends</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No sends yet
            </p>
          ) : (
            <div className="space-y-1">
              {logs.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/30"
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      l.status === 'sent' ? 'bg-green-500' : 'bg-destructive'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{l.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {l.email} · {l.type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(l.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
