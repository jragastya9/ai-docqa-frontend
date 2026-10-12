'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  MessagesSquare,
  Sparkles,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import { dashboardApi, DashboardSummary } from '@/lib/dashboard-api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const summary = await dashboardApi.summary();
      setData(summary);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  const greeting = getGreeting();
  const firstName = data?.tenant.name?.split(' ')[0] || 'there';

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your workspace
          </p>
        </div>
        <Link href="/documents">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload document
          </Button>
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Documents"
          value={data?.counts.documents ?? 0}
          icon={FileText}
          loading={loading}
          accent="primary"
          hint={
            data && data.limits.documents !== -1
              ? `${data.usage.documentCount} / ${data.limits.documents} used`
              : 'Unlimited'
          }
        />
        <StatCard
          label="Conversations"
          value={data?.counts.conversations ?? 0}
          icon={MessagesSquare}
          loading={loading}
          accent="primary"
        />
        <StatCard
          label="Messages this month"
          value={data?.counts.messagesThisMonth ?? 0}
          icon={MessageSquare}
          loading={loading}
          accent="orange"
          hint={
            data && data.limits.messagesPerMonth !== -1
              ? `${data.usage.messageCount} / ${data.limits.messagesPerMonth} used`
              : 'Unlimited'
          }
        />
        <StatCard
          label="Current plan"
          value={data?.tenant.planName ?? '—'}
          icon={Sparkles}
          loading={loading}
          accent="green"
          hint={
            data?.tenant.plan === 'free'
              ? 'Upgrade for more'
              : 'All features unlocked'
          }
        />
      </div>

      {/* Quick actions + Recent documents */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent documents */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent documents</CardTitle>
            <Link
              href="/documents"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !data || data.recentDocuments.length === 0 ? (
              <EmptyDocuments />
            ) : (
              <div className="space-y-2">
                {data.recentDocuments.map((doc) => (
                  <Link
                    key={doc._id}
                    href="/documents"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.pageCount} pages · {doc.chunkCount} chunks
                      </p>
                    </div>
                    <StatusPill status={doc.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickAction
              href="/documents"
              icon={Upload}
              title="Upload a PDF"
              subtitle="Add a new document"
            />
            <QuickAction
              href="/chat"
              icon={MessageSquare}
              title="Start a chat"
              subtitle="Ask your documents"
            />
            <QuickAction
              href="/billing"
              icon={Sparkles}
              title="Manage plan"
              subtitle="View usage & upgrade"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === 'completed'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : status === 'failed'
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>{status}</span>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition group"
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
    </Link>
  );
}

function EmptyDocuments() {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="font-medium">No documents yet</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Upload your first PDF to get started
      </p>
      <Link href="/documents">
        <Button size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload now
        </Button>
      </Link>
    </div>
  );
}