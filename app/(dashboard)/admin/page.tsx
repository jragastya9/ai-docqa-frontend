'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import { adminApi, type AdminOverview } from '@/lib/admin-api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .overview()
      .then(setData)
      .catch((err) => {
        if (err.response?.status === 403) {
          toast.error('Super admin access required');
        } else {
          toast.error('Failed to load overview');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const mrrRupees = (data?.totals.mrr ?? 0) / 100;
  const arrRupees = (data?.totals.arr ?? 0) / 100;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin</h1>
        <p className="text-muted-foreground mt-1">
          Global view across all tenants
        </p>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total tenants"
          value={data?.totals.tenants ?? 0}
          icon={Building2}
          loading={loading}
          accent="primary"
          hint={`${data?.signups.month ?? 0} this month`}
        />
        <StatCard
          label="Total users"
          value={data?.totals.users ?? 0}
          icon={Users}
          loading={loading}
          accent="primary"
        />
        <StatCard
          label="MRR"
          value={`₹${mrrRupees.toLocaleString('en-IN')}`}
          icon={DollarSign}
          loading={loading}
          accent="green"
          hint={`ARR ₹${arrRupees.toLocaleString('en-IN')}`}
        />
        <StatCard
          label="Messages"
          value={data?.totals.messages ?? 0}
          icon={MessageSquare}
          loading={loading}
          accent="orange"
          hint={`${data?.totals.documents ?? 0} documents`}
        />
      </div>

            {/* Signups today/week */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Signups today</div>
            <div className="text-3xl font-bold mt-1">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                data?.signups.today ?? 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">This week</div>
            <div className="text-3xl font-bold mt-1">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                data?.signups.week ?? 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">This month</div>
            <div className="text-3xl font-bold mt-1">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                data?.signups.month ?? 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signup trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            New tenants · last 30 days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.signupTrend || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan distribution + recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              (data?.planDistribution || []).map((p) => {
                const total = data?.totals.tenants || 1;
                const pct = Math.round((p.count / total) * 100);
                return (
                  <div key={p.plan} className="flex items-center gap-3">
                    <span className="text-sm capitalize w-20">{p.plan}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full',
                          p.plan === 'free'
                            ? 'bg-muted-foreground'
                            : p.plan === 'pro'
                            ? 'bg-primary'
                            : 'bg-purple-500'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular-nums w-16 text-right">
                      {p.count} ({pct}%)
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent tenants</CardTitle>
            <Link
              href="/admin/tenants"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(data?.recentTenants || []).map((t) => (
                  <Link
                    key={t.id}
                    href={`/admin/tenants/${t.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.subdomain || t.slug} · {t.plan}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
