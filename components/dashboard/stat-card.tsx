'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
  hint?: string;
  accent?: 'default' | 'primary' | 'orange' | 'green';
}

export function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  hint,
  accent = 'default',
}: StatCardProps) {
  const accentClasses: Record<string, string> = {
    default: 'bg-muted text-foreground',
    primary: 'bg-primary/10 text-primary',
    orange: 'bg-orange-500/10 text-orange-500',
    green: 'bg-green-500/10 text-green-500',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="h-9 w-20 mt-2" />
            ) : (
              <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
            )}
            {hint && !loading && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {hint}
              </p>
            )}
          </div>
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              accentClasses[accent]
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}