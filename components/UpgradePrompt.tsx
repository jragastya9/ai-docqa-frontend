'use client';

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function UpgradePrompt({
  title = 'Plan limit reached',
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/50">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100">
            {title}
          </h3>
          <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
            {message}
          </p>
        </div>
        <Link href="/billing">
          <Button size="sm" className="shrink-0">
            Upgrade <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
