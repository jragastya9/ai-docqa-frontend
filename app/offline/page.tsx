'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">You're offline</h1>
          <p className="text-muted-foreground mt-2">
            It looks like you've lost your internet connection. Some features
            won't work until you're back online.
          </p>
        </div>

        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try again
        </Button>
      </div>
    </div>
  );
}
