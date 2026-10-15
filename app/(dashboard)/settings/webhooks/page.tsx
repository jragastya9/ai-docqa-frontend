'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Webhook as WebhookIcon,
  Plus,
  Loader2,
  Trash2,
  Play,
  Copy,
  Check,
  RefreshCw,
  ChevronLeft,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  webhookApi,
  type Webhook,
  type WebhookDelivery,
} from '@/lib/webhook-api';

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [availableEvents, setAvailableEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedHook, setSelectedHook] = useState<Webhook | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await webhookApi.list();
      setWebhooks(data.webhooks);
      setAvailableEvents(data.availableEvents);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this webhook? Deliveries will stop immediately.')) return;
    try {
      await webhookApi.remove(id);
      toast.success('Webhook deleted');
      await load();
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function handleTest(id: string) {
    try {
      await webhookApi.test(id);
      toast.success('Test event sent — check delivery logs');
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Test failed');
    }
  }

  if (selectedHook) {
    return (
      <DeliveryLogsView
        webhook={selectedHook}
        onBack={() => setSelectedHook(null)}
      />
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/settings"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Settings
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground mt-1">
            Get real-time notifications when events happen in your workspace
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add webhook
        </Button>
      </div>

      {showCreate && (
        <CreateWebhookForm
          availableEvents={availableEvents}
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false);
            await load();
          }}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <WebhookIcon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold">No webhooks yet</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-sm mx-auto">
              Add a webhook URL to receive POST requests whenever events happen
              in your workspace — integrate with Zapier, Slack, or your own
              systems.
            </p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((hook) => (
            <WebhookCard
              key={hook.id}
              webhook={hook}
              onDelete={() => handleDelete(hook.id)}
              onTest={() => handleTest(hook.id)}
              onViewLogs={() => setSelectedHook(hook)}
              onUpdated={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WebhookCard({
  webhook,
  onDelete,
  onTest,
  onViewLogs,
  onUpdated,
}: {
  webhook: Webhook;
  onDelete: () => void;
  onTest: () => void;
  onViewLogs: () => void;
  onUpdated: () => void;
}) {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  async function copySecret() {
    navigator.clipboard.writeText(webhook.secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  }

  async function handleTest() {
    setTesting(true);
    try {
      await onTest();
    } finally {
      setTesting(false);
    }
  }

  async function regenerate() {
    if (!confirm('Regenerate secret? Your existing integrations will break until you update them.')) return;
    setRegenLoading(true);
    try {
      await webhookApi.regenerateSecret(webhook.id);
      toast.success('Secret regenerated');
      await onUpdated();
    } catch {
      toast.error('Failed to regenerate');
    } finally {
      setRegenLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  webhook.active ? 'bg-green-500' : 'bg-muted-foreground'
                )}
              />
              <p className="font-mono text-sm truncate">{webhook.url}</p>
            </div>
            {webhook.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {webhook.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {webhook.events.map((e) => (
                <span
                  key={e}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Secret */}
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-1.5">
            Signing secret
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono truncate">
              {showSecret ? webhook.secret : '•'.repeat(32)}
            </code>
            <button
              onClick={() => setShowSecret((v) => !v)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showSecret ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={copySecret}
              className="text-muted-foreground hover:text-foreground"
            >
              {copiedSecret ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={regenerate}
              disabled={regenLoading}
              className="text-muted-foreground hover:text-foreground"
              title="Regenerate secret"
            >
              <RefreshCw
                className={cn(
                  'w-3.5 h-3.5',
                  regenLoading && 'animate-spin'
                )}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}>
            {testing ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 mr-1.5" />
            )}
            Send test
          </Button>
          <Button size="sm" variant="outline" onClick={onViewLogs}>
            View deliveries
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="text-destructive hover:text-destructive ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateWebhookForm({
  availableEvents,
  onClose,
  onCreated,
}: {
  availableEvents: string[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>([
    'document.uploaded',
  ]);
  const [saving, setSaving] = useState(false);

  function toggleEvent(e: string) {
    setSelected((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || selected.length === 0) return;
    setSaving(true);
    try {
      await webhookApi.create({
        url: url.trim(),
        events: selected,
        description: description.trim(),
      });
      toast.success('Webhook created');
      onCreated();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New webhook</CardTitle>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Endpoint URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-app.com/webhooks/localbiz"
              required
              className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Notify Slack on new uploads"
              className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Events to subscribe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableEvents.map((evt) => (
                <label
                  key={evt}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm',
                    selected.includes(evt)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(evt)}
                    onChange={() => toggleEvent(evt)}
                    className="rounded"
                  />
                  <span className="font-mono text-xs">{evt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !url.trim() || selected.length === 0}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create webhook'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DeliveryLogsView({
  webhook,
  onBack,
}: {
  webhook: Webhook;
  onBack: () => void;
}) {
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    webhookApi
      .deliveries(webhook.id)
      .then((d) => setDeliveries(d.deliveries))
      .catch(() => toast.error('Failed to load deliveries'))
      .finally(() => setLoading(false));
  }, [webhook.id]);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ChevronLeft className="w-3 h-3" /> Back to webhooks
      </button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery logs</h1>
        <p className="text-muted-foreground mt-1 font-mono text-sm truncate">
          {webhook.url}
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No deliveries yet. Trigger an event or click Send test.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {deliveries.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        d.success ? 'bg-green-500' : 'bg-destructive'
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-mono truncate">{d.event}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(d.createdAt).toLocaleString()} · {d.duration}ms
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-mono px-2 py-0.5 rounded shrink-0',
                      d.success
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {d.responseStatus || d.error || 'failed'}
                  </span>
                </div>
                {d.responseBody && (
                  <pre className="mt-3 text-xs p-2 bg-muted rounded overflow-x-auto max-h-32">
                    {d.responseBody}
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
