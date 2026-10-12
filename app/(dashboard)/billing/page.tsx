'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Loader2,
  Zap,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { billingApi, Plan, CurrentBilling } from '@/lib/billing-api';
import { tenantStore } from '@/lib/tenant-store';

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [current, setCurrent] = useState<CurrentBilling | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [p, c] = await Promise.all([
        billingApi.listPlans(),
        billingApi.current(),
      ]);
      setPlans(p);
      setCurrent(c);

      // Sync tenant store so the sidebar badge updates live
      tenantStore.set({
        name: c.tenant.name,
        plan: c.tenant.plan,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load billing');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(planId: string) {
    setUpgrading(planId);
    try {
      const { order } = await billingApi.subscribe(planId);

      // Mock payment flow — auto-verify immediately
      await billingApi.verify({
        razorpay_order_id: order.id,
        razorpay_payment_id: `mock_pay_${Date.now()}`,
        plan: planId,
      });

      toast.success(`Upgraded to ${planId}!`);
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error || 'Upgrade failed');
    } finally {
      setUpgrading(null);
    }
  }

  async function handleCancel() {
    if (!confirm('Downgrade to Free plan? You will lose Pro features.')) return;
    try {
      await billingApi.cancel();
      toast.success('Downgraded to Free');
      await load();
    } catch {
      toast.error('Cancel failed');
    }
  }

  if (loading || !current) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPlan = current.tenant.plan;
  const usage = current.usage;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing &amp; Plans</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and usage
        </p>
      </div>

      {/* Current plan + usage */}
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{currentPlan}</p>
              <p className="text-sm text-muted-foreground">
                {current.plan.name} plan
              </p>
            </div>
            {currentPlan !== 'free' && (
              <Button variant="outline" onClick={handleCancel}>
                Downgrade to Free
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
            <UsageStat
              label="Documents"
              used={usage.documentCount}
              limit={current.plan.limits.documents}
            />
            <UsageStat
              label="Messages this month"
              used={usage.messageCount}
              limit={current.plan.limits.messagesPerMonth}
            />
            <UsageStat
              label="AI tokens used"
              used={usage.aiTokensUsed}
              limit={-1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans
            .filter((p) => p.id !== 'free')
            .map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={currentPlan === plan.id}
                onUpgrade={() => handleUpgrade(plan.id)}
                loading={upgrading === plan.id}
              />
            ))}
        </div>
      </div>

      {/* Mock notice */}
      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Demo mode:</strong> Payments are simulated. When you connect real
        Razorpay keys, this flow upgrades real subscriptions.
      </div>
    </div>
  );
}

function UsageStat({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const unlimited = limit === -1;
  const pct = unlimited ? 0 : Math.min((used / limit) * 100, 100);

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-1">
        {used}
        {!unlimited && ` / ${limit}`}
      </p>
      {!unlimited && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
          <div
            className={`h-full transition-all ${
              pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-orange-500' : 'bg-primary'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {unlimited && (
        <p className="text-xs text-muted-foreground mt-1">Unlimited</p>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  isCurrent,
  onUpgrade,
  loading,
}: {
  plan: Plan;
  isCurrent: boolean;
  onUpgrade: () => void;
  loading: boolean;
}) {
  const isPro = plan.id === 'pro';
  const Icon = isPro ? Zap : Crown;

  return (
    <Card
      className={`relative ${
        isPro
          ? 'border-primary shadow-xl ring-2 ring-primary/20 md:scale-105'
          : ''
      }`}
    >
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
      )}

      <CardContent className="p-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-primary" />
        </div>

        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isPro ? 'For growing teams' : 'For large organizations'}
        </p>

        <div className="mt-6 mb-6">
          <span className="text-4xl font-bold">
            ₹{(plan.price / 100).toLocaleString('en-IN')}
          </span>
          <span className="text-muted-foreground">/month</span>
        </div>

        <Button
          className="w-full mb-6"
          variant={isCurrent ? 'outline' : isPro ? 'default' : 'outline'}
          disabled={isCurrent || loading}
          onClick={onUpgrade}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isCurrent ? (
            'Current Plan'
          ) : (
            <>
              Upgrade <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}