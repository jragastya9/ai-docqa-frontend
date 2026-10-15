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
  Download,
  Trash2,
  LogOut,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  tenantApi,
  type TenantInfo,
  type TenantSettings,
} from '@/lib/tenant-api';
import { securityApi, type SessionInfo } from '@/lib/security-api';
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

// ═══════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════
function ProfileTab({ user }: { user: UserInfo | null }) {
  const [name, setName] = useState(user?.name || '');

  function handleSave() {
    if (user) {
      const updated = { ...user, name };
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile saved');
    }
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
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════
// AI
// ═══════════════════════════════════════════
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
    Promise.all([tenantApi.me(), tenantApi.getAIStats()])
      .then(([t, statsRes]) => {
        setTenant(t);
        setAiProvider(t.settings?.aiProvider || 'groq');
        setCustomPrompt(t.settings?.customPrompt || '');
        setCachingEnabled(t.settings?.cachingEnabled !== false);
        setStats(statsRes.cache);
      })
      .catch(() => toast.error('Failed to load AI settings'))
      .finally(() => setLoading(false));

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
    if (
      !confirm(
        'Clear all cached responses? Repeat questions will hit the API again.'
      )
    )
      return;
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
            Choose which AI answers your users&apos; questions.
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
            Extra instructions the AI should follow. E.g. &quot;Always answer
            in Hindi.&quot;
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
              Save instructions
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
              Save caching
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

// ═══════════════════════════════════════════
// BRANDING
// ═══════════════════════════════════════════
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
            onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
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

// ═══════════════════════════════════════════
// DOMAIN
// ═══════════════════════════════════════════
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

// ═══════════════════════════════════════════
// SECURITY (Day 22)
// ═══════════════════════════════════════════
function SecurityTab() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(true);

  const [setupModal, setSetupModal] = useState<{
    qrCode: string;
    secret: string;
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const [disableModal, setDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState('');

  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSessions();
    load2FAStatus();
  }, []);

  async function loadSessions() {
    try {
      const data = await securityApi.listSessions();
      setSessions(data.sessions);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  }

  async function load2FAStatus() {
    try {
      const data = await securityApi.get2FAStatus();
      setTwoFAEnabled(data.enabled);
    } catch {
      // silent
    } finally {
      setTwoFALoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPw.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setChangingPassword(true);
    try {
      const res = await securityApi.changePassword(currentPw, newPw);
      toast.success(res.message || 'Password changed');
      localStorage.clear();
      setTimeout(() => (window.location.href = '/login'), 800);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleLogoutAll() {
    if (!confirm('Log out of all devices? You will need to log in again.'))
      return;
    try {
      await securityApi.logoutAll();
      localStorage.clear();
      window.location.href = '/login';
    } catch {
      toast.error('Failed');
    }
  }

  async function handleRevoke(sessionId: string, isCurrent: boolean) {
    if (!confirm(isCurrent ? 'Log out of this device?' : 'Revoke this session?'))
      return;
    try {
      const res = await securityApi.revokeSession(sessionId);
      toast.success(res.message || 'Session revoked');
      if (res.loggedOut) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        await loadSessions();
      }
    } catch {
      toast.error('Failed to revoke');
    }
  }

  async function handleSetup2FA() {
    try {
      const data = await securityApi.setup2FA();
      setSetupModal({ qrCode: data.qrCode, secret: data.secret });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to start 2FA setup');
    }
  }

  async function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await securityApi.verify2FA(verifyCode);
      setBackupCodes(res.backupCodes);
      setTwoFAEnabled(true);
      toast.success('2FA enabled');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid code');
    } finally {
      setVerifying(false);
    }
  }

  async function handleDisable2FA(e: React.FormEvent) {
    e.preventDefault();
    try {
      await securityApi.disable2FA(disableCode);
      setTwoFAEnabled(false);
      setDisableModal(false);
      setDisableCode('');
      toast.success('2FA disabled');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid code');
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      await securityApi.exportData();
      toast.success('Export downloaded');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    const confirmText = prompt(
      'Type DELETE to permanently delete your account and all data:'
    );
    if (confirmText !== 'DELETE') return;

    const pw = prompt('Enter your password to confirm:');
    if (!pw) return;

    setDeleting(true);
    try {
      await securityApi.deleteAccount(pw, 'DELETE');
      toast.success('Account deleted');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Current password
              </label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
                className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                New password (min 8 chars)
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Two-factor authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {twoFALoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : twoFAEnabled ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium">Enabled</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your account is protected with an authenticator app.
              </p>
              <Button variant="outline" onClick={() => setDisableModal(true)}>
                Disable 2FA
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security. After enabling, you&apos;ll need a
                code from your authenticator app (Google Authenticator, Authy,
                1Password) to sign in.
              </p>
              <Button onClick={handleSetup2FA}>Set up 2FA</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Devices currently logged into your account.
          </p>

          {sessionsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {s.device.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {s.browser} · {s.os}
                      {s.isCurrent && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.city ? `${s.city}, ` : ''}
                      {s.country || 'Unknown'} · IP {s.ipAddress || 'unknown'} ·{' '}
                      {new Date(s.lastActiveAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRevoke(s.id, s.isCurrent)}
                >
                  Revoke
                </Button>
              </div>
            ))
          )}

          {sessions.length > 1 && (
            <Button variant="outline" onClick={handleLogoutAll}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out of all devices
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download all my data (JSON)
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Delete account
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Permanently deletes your account, all documents, chats, and
              workspace data. Cannot be undone.
            </p>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete my account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Setup Modal */}
      {setupModal && !backupCodes && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-xl border border-border max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">Set up 2FA</h3>
            <p className="text-sm text-muted-foreground">
              1. Scan this QR code with your authenticator app
            </p>
            <img
              src={setupModal.qrCode}
              alt="2FA QR code"
              className="mx-auto rounded-lg border border-border bg-white p-2"
            />
            <p className="text-xs text-muted-foreground">
              Or enter this code manually:
              <br />
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1 inline-block break-all">
                {setupModal.secret}
              </code>
            </p>
            <form onSubmit={handleVerify2FA} className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  2. Enter the 6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-widest font-mono"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSetupModal(null);
                    setVerifyCode('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={verifying || verifyCode.length !== 6}
                >
                  {verifying ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Verify & enable
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backup codes modal */}
      {backupCodes && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-xl border border-border max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">Save your backup codes</h3>
            <p className="text-sm text-muted-foreground">
              Store these somewhere safe. Each code can be used once if you
              lose access to your authenticator app.
            </p>
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
              {backupCodes.map((code) => (
                <div key={code} className="text-center py-1">
                  {code}
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(backupCodes.join('\n'));
                toast.success('Copied to clipboard');
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy all codes
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setBackupCodes(null);
                setSetupModal(null);
                setVerifyCode('');
              }}
            >
              I&apos;ve saved them — close
            </Button>
          </div>
        </div>
      )}

      {/* Disable 2FA modal */}
      {disableModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-xl border border-border max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">Disable 2FA</h3>
            <p className="text-sm text-muted-foreground">
              Enter a code from your authenticator app or one of your backup
              codes.
            </p>
            <form onSubmit={handleDisable2FA} className="space-y-3">
              <input
                type="text"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                placeholder="123456"
                required
                className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-lg tracking-widest font-mono"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDisableModal(false);
                    setDisableCode('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  Disable 2FA
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
