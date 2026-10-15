'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Users,
  FileText,
  MessageSquare,
  Loader2,
  UserCheck,
  Ban,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/admin-api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FEATURE_FLAGS = [
  'ai_provider_picker',
  'webhooks',
  'custom_domain',
  '2fa',
  'team_invites',
  'analytics_export',
];

export default function AdminTenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [impersonating, setImpersonating] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [flagSaving, setFlagSaving] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [tenantId]);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.tenantDetail(tenantId);
      setData(res);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load');
      if (err.response?.status === 404) router.push('/admin/tenants');
    } finally {
      setLoading(false);
    }
  }

  async function handleImpersonate() {
    if (!confirm('Impersonate this tenant? You will be logged in as their owner.')) return;
    setImpersonating(true);
    try {
      const res = await adminApi.impersonate(tenantId, 'Admin review');
      // Store admin's current state so we can restore later
      localStorage.setItem('impersonation_admin_token', localStorage.getItem('token') || '');
      localStorage.setItem('impersonation_admin_user', localStorage.getItem('user') || '');
      localStorage.setItem('impersonation_admin_tenant', localStorage.getItem('tenant') || '');

      // Swap in the impersonated user
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('tenant', JSON.stringify(res.tenant));
      localStorage.setItem('is_impersonating', '1');

      toast.success(`Impersonating ${res.user.name}`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Impersonate failed');
    } finally {
      setImpersonating(false);
    }
  }

  async function handleChangePlan(plan: string) {
    if (!confirm(`Change plan to ${plan}?`)) return;
    setChangingPlan(true);
    try {
      await adminApi.changePlan(tenantId, plan);
      toast.success(`Plan set to ${plan}`);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setChangingPlan(false);
    }
  }

  async function handleToggleActive() {
    const next = !data.tenant.isActive;
    if (!confirm(next ? 'Reactivate this tenant?' : 'Suspend this tenant?')) return;
    try {
      await adminApi.toggleActive(tenantId, next);
      toast.success(next ? 'Activated' : 'Suspended');
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  }

  async function toggleFeature(flag: string) {
    if (!data) return;
    setFlagSaving(flag);
    const current = data.tenant.settings?.featureFlags || {};
    const updated = { ...current, [flag]: !current[flag] };
    try {
      await adminApi.updateFeatures(tenantId, updated);
      setData({
        ...data,
        tenant: {
          ...data.tenant,
          settings: { ...data.tenant.settings, featureFlags: updated },
        },
      });
      toast.success('Feature updated');
    } catch (err: any) {
      toast.error('Failed to update');
    } finally {
      setFlagSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data) return null;
  const { tenant, users, counts, usage, subscriptions, recentDocuments } = data;
  const flags = tenant.settings?.featureFlags || {};

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/tenants"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to tenants
        </Link>
        <div className="flex items-start justify-between gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {tenant.brandName || tenant.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {tenant.subdomain || tenant.slug} ·{' '}
                {new Date(tenant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleImpersonate}
              disabled={impersonating}
              size="sm"
            >
              {impersonating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              Impersonate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleActive}
              className={cn(
                tenant.isActive ? '' : 'text-green-500 hover:text-green-500'
              )}
            >
              {tenant.isActive ? (
                <>
                  <Ban className="w-4 h-4 mr-2" /> Suspend
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" /> Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Counts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary/60" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {users.length}
              </p>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <FileText className="w-8 h-8 text-orange-500/60" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {counts.documents}
              </p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-500/60" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {counts.messages}
              </p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          {['free', 'pro', 'business'].map((p) => (
            <Button
              key={p}
              variant={tenant.plan === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => tenant.plan !== p && handleChangePlan(p)}
              disabled={changingPlan}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Feature flags */}
      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {FEATURE_FLAGS.map((flag) => (
            <label
              key={flag}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer"
            >
              <span className="text-sm font-mono">{flag}</span>
              <div className="flex items-center gap-2">
                {flagSaving === flag && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <input
                  type="checkbox"
                  checked={!!flags[flag]}
                  onChange={() => toggleFeature(flag)}
                  disabled={flagSaving === flag}
                  className="rounded w-4 h-4"
                />
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((u: any) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full capitalize',
                  u.role === 'owner' ? 'bg-primary/10 text-primary' : 'bg-muted'
                )}
              >
                {u.role}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Usage */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage · {usage.month}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Documents</p>
              <p className="text-xl font-bold">{usage.documentCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Messages</p>
              <p className="text-xl font-bold">{usage.messageCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tokens</p>
              <p className="text-xl font-bold">
                {usage.aiTokensUsed.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {subscriptions.map((s: any) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div>
                  <p className="text-sm font-medium capitalize">{s.plan} plan</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{(s.amount / 100).toLocaleString('en-IN')} ·{' '}
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    s.status === 'active'
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-muted'
                  )}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
