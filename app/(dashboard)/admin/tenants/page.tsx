'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Building2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi, type AdminTenant } from '@/lib/admin-api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PLANS = ['all', 'free', 'pro', 'business'];

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('all');

  useEffect(() => {
    const handle = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(handle);
  }, [search, plan]);

  async function load() {
    setLoading(true);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (plan !== 'all') params.plan = plan;
      const data = await adminApi.tenants(params);
      setTenants(data.tenants);
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error('Super admin access required');
      } else {
        toast.error('Failed to load tenants');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Back to admin
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">All tenants</h1>
          <p className="text-muted-foreground mt-1">
            Every workspace on the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, subdomain..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40">
          {PLANS.map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors capitalize',
                plan === p
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : tenants.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No tenants found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr className="text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3 text-right">Users</th>
                  <th className="px-4 py-3 text-right">Docs</th>
                  <th className="px-4 py-3 text-right">MRR</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border hover:bg-muted/30 transition"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/tenants/${t.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {t.brandName || t.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {t.subdomain || t.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full capitalize',
                          t.plan === 'free'
                            ? 'bg-muted text-muted-foreground'
                            : t.plan === 'pro'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-purple-500/10 text-purple-500'
                        )}
                      >
                        {t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {t.userCount}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {t.docCount}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      ₹{(t.mrr / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs',
                          t.isActive ? 'text-green-500' : 'text-destructive'
                        )}
                      >
                        ● {t.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
