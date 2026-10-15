'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      setError('Sign-in session expired. Please try again.');
      return;
    }

    const backendToken = (session as any)?.backendToken;
    const backendUser = (session as any)?.backendUser;

    if (!backendToken || !backendUser) {
      setError('Could not complete sign-in. Please try again.');
      return;
    }

    try {
      localStorage.setItem('token', backendToken);
      localStorage.setItem('user', JSON.stringify(backendUser));
      toast.success('Welcome!');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save session.');
    }
  }, [session, status, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Sign-in failed</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link href="/login">
            <Button variant="outline">Back to login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
}

