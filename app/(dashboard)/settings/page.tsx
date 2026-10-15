'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  Palette,
  Globe,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Webhook as WebhookIcon,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  tenantApi,
  type TenantInfo,
  type TenantSettings,
} from '@/lib/tenant-api';
import { tenantStore } from '@/lib/tenant-store';

type Tab = 'profile' | 'ai' | 'branding' | 'domain' | 'security';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace, branding, and account
        </p>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'ai', label: 'AI', icon: Sparkles },
          { id: 'branding', label: 'Branding', icon: Palette },
          { id: 'domain', label: 'Domain', icon: Globe },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
                tab === t.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'profile' && <ProfileTab user={user} />}
      {tab === 'ai' && <AITab />}
      {tab === 'branding' && <BrandingTab />}
      {tab === 'domain' && <DomainTab />}
      {tab === 'security' && <SecurityTab />}
    </div>
  );
}

function ProfileTab({ user }: { user: UserInfo | null }) {
  const [name, setName] = useState(user?.name || '');

  function handleSave() {
    if (user) {
      const updated = { ...user, name };
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile saved');
    }
  }

  function handleDelete() {
    if (
      !confirm(
        'Delete your account? This cannot be undone. All documents and chats will be permanently removed.'
      )
    )
      return;
    toast.error('Account deletion coming soon');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2.5 border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>

        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <WebhookIcon className="w-4 h-4" />
            Developer
          </h3>
          <Link
            href="/settings/webhooks"
            className="block p-4 rounded-lg border border-border hover:bg-accent transition"
          >
            <p className="font-medium text-sm">Webhooks</p>
            <p className="text-xs text-muted-foreground mt-1">
              Send real-time events to your own systems, Slack, or Zapier
            </p>
          </Link>
        </div>

        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger zone
          </h3>
          <Button variant="outline" onClick={handleDelete}>
            Delete account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── AI TAB ───
interface ProviderInfo {
  id: string;
  name: string;
  model: string;
  available: boolean;
  description: string;
}

interface AIStats {
  entries: number;
  totalHits: number;
  tokensSaved: number;
}

function AITab() {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [aiProvider, setAiProvider] = useState('groq');
  const [customPrompt, setCustomPrompt] = useState('');
  const [cachingEnabled, setCachingEnabled] = useState(true);

  useEffect(() => {
    Promise.all([
      tenantApi.me(),
      tenantApi.getAIStats(),
    ])
      .then(([t, statsRes]) => {
        setTenant(t);
        setAiProvider(t.settings?.aiProvider || 'groq');
        setCustomPrompt(t.settings?.customPrompt || '');
        setCachingEnabled(t.settings?.cachingEnabled !== false);
        setStats(statsRes.cache);
      })
      .catch(() => toast.error('Failed to load AI settings'))
      .finally(() => setLoading(false));

    // Fetch providers list separately
    import('@/lib/api').then(({ default: api }) => {
      api
        .get('/api/tenant/me')
        .then((res) => setProviders(res.data.providers || []))
        .catch(() => {});
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await tenantApi.updateAISettings({
        aiProvider,
        customPrompt,
        cachingEnabled,
      });
      toast.success('AI settings saved');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleClearCache() {
    if (!confirm('Clear all cached responses? Repeat questions will hit the API again.')) return;
    setClearing(true);
    try {
      await tenantApi.clearAICache();
      toast.success('Cache cleared');
      const res = await tenantApi.getAIStats();
      setStats(res.cache);
    } catch {
      toast.error('Failed to clear');
    } finally {
      setClearing(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose which AI answers your users' questions.
          </p>

          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => p.available && setAiProvider(p.id)}
              disabled={!p.available}
              className={cn(
                'w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-colors',
                aiProvider === p.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent',
                !p.available && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0',
                  aiProvider === p.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                )}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono">
                    {p.model}
                  </span>
                  {!p.available && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                      Not configured
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.description}
                </p>
              </div>
            </button>
          ))}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save AI settings'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Extra instructions the AI should follow for your workspace. E.g. "Always answer in Hindi."
          </p>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Always respond in a formal, professional tone."
            rows={5}
            maxLength={2000}
            className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {customPrompt.length} / 2000
          </p>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save instructions'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response caching</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cache identical questions for 1 hour to save API cost.
          </p>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cachingEnabled}
              onChange={(e) => setCachingEnabled(e.target.checked)}
              className="rounded w-4 h-4"
            />
            <span className="text-sm">Enable response caching</span>
          </label>

          {stats && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Cache entries</p>
                <p className="text-lg font-bold tabular-nums">
                  {stats.entries}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Total hits</p>
                <p className="text-lg font-bold tabular-nums">
                  {stats.totalHits}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Tokens saved</p>
                <p className="text-lg font-bold tabular-nums">
                  {stats.tokensSaved.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save caching'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={clearing}
            >
              {clearing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Clear cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── BRANDING ───
function BrandingTab() {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<TenantSettings>({
    brandName: '',
    tagline: '',
    logo: '',
    primaryColor: '#6366f1',
    supportEmail: '',
    footerText: '',
  });

  useEffect(() => {
    tenantApi
      .me()
      .then((t) => {
        setTenant(t);
        setForm({
          brandName: t.settings?.brandName || '',
          tagline: t.settings?.tagline || '',
          logo: t.settings?.logo || '',
          primaryColor: t.settings?.primaryColor || '#6366f1',
          supportEmail: t.settings?.supportEmail || '',
          footerText: t.settings?.footerText || '',
        });
      })
      .catch(() => toast.error('Failed to load tenant'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await tenantApi.updateBranding(form);
      const t = await tenantApi.me();
      const stored = localStorage.getItem('tenant');
      if (stored) {
        const parsed = JSON.parse(stored);
        tenantStore.set({
          ...parsed,
          brandName: t.settings?.brandName,
          logo: t.settings?.logo,
          primaryColor: t.settings?.primaryColor,
        });
      }
      toast.success('Branding saved');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Brand name
          </label>
          <input
            type="text"
            value={form.brandName || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, brandName: e.target.value }))
            }
            placeholder={tenant?.name || 'Your Business'}
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Tagline</label>
          <input
            type="text"
            value={form.tagline || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, tagline: e.target.value }))
            }
            placeholder="AI-powered answers for our customers"
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Logo URL</label>
          <input
            type="url"
            value={form.logo || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, logo: e.target.value }))
            }
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {form.logo && (
            <div className="mt-3 p-3 border border-border rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Preview</p>
              <img
                src={form.logo}
                alt="Logo preview"
                className="h-10 object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Primary color
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={form.primaryColor || '#6366f1'}
              onChange={(e) =>
                setForm((f) => ({ ...f, primaryColor: e.target.value }))
              }
              className="w-14 h-11 rounded-lg border border-border cursor-pointer"
            />
            <input
              type="text"
              value={form.primaryColor || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, primaryColor: e.target.value }))
              }
              placeholder="#6366f1"
              className="flex-1 px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Support email
          </label>
          <input
            type="email"
            value={form.supportEmail || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, supportEmail: e.target.value }))
            }
            placeholder="support@yourbusiness.com"
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Footer text
          </label>
          <input
            type="text"
            value={form.footerText || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, footerText: e.target.value }))
            }
            placeholder="© 2026 Your Business"
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save branding'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── DOMAIN ───
function DomainTab() {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [savingSub, setSavingSub] = useState(false);
  const [savingDomain, setSavingDomain] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    tenantApi
      .me()
      .then((t) => {
        setTenant(t);
        setSubdomain(t.subdomain || '');
        setCustomDomain(t.customDomain || '');
      })
      .catch(() => toast.error('Failed to load tenant'))
      .finally(() => setLoading(false));
  }, []);

  async function saveSubdomain() {
    setSavingSub(true);
    try {
      await tenantApi.updateSubdomain(subdomain);
      toast.success('Subdomain updated');
      const t = await tenantApi.me();
      setTenant(t);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSavingSub(false);
    }
  }

  async function saveCustomDomain() {
    setSavingDomain(true);
    try {
      await tenantApi.updateCustomDomain(customDomain);
      toast.success('Domain saved. Set up DNS to verify.');
      const t = await tenantApi.me();
      setTenant(t);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSavingDomain(false);
    }
  }

  function copyUrl() {
    if (!tenant?.subdomain) return;
    navigator.clipboard.writeText(
      `https://${tenant.subdomain}.localbizai.com`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace subdomain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={subdomain}
              onChange={(e) =>
                setSubdomain(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                )
              }
              placeholder="your-business"
              className="flex-1 px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
            />
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              .localbizai.com
            </span>
          </div>

          {tenant?.subdomain && (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
              <span className="text-sm font-mono flex-1 truncate">
                https://{tenant.subdomain}.localbizai.com
              </span>
              <Button size="sm" variant="ghost" onClick={copyUrl}>
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={saveSubdomain} disabled={savingSub}>
              {savingSub ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save subdomain'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Custom domain
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Business plan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Your domain
            </label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="app.yourbusiness.com"
              className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
            />
          </div>

          <Button onClick={saveCustomDomain} disabled={savingDomain}>
            {savingDomain ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save domain'
            )}
          </Button>

          {tenant?.customDomain && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">DNS Setup</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    tenant.domainVerified
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-600'
                  )}
                >
                  {tenant.domainVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Add this CNAME record to your DNS provider:
              </p>
              <div className="space-y-1 text-xs font-mono bg-background p-3 rounded border border-border">
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16">Type:</span>
                  <span>CNAME</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16">Name:</span>
                  <span>{tenant.customDomain.split('.')[0]}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16">Value:</span>
                  <span>cname.localbizai.com</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16">TTL:</span>
                  <span>Auto</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SECURITY ───
function SecurityTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Current password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">
            New password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast.info('Coming soon')}>
            Update password
          </Button>
        </div>

        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-semibold mb-2">
            Two-factor authentication
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add an extra layer of security to your account.
          </p>
          <Button
            variant="outline"
            onClick={() => toast.info('2FA coming soon')}
          >
            Enable 2FA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
