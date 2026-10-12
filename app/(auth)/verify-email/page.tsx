'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    api
      .post('/api/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified successfully.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed');
      });
  }, [searchParams]);

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto">
        {status === 'loading' && (
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {status === 'success' && (
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        )}
        {status === 'error' && (
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email verified!'}
          {status === 'error' && 'Verification failed'}
        </h1>
        <p className="mt-2 text-muted-foreground">{message || 'Please wait...'}</p>
      </div>

      {status === 'success' && (
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-10 px-6 w-full bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
        >
          Continue to dashboard →
        </Link>
      )}

      {status === 'error' && (
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-10 px-6 w-full border border-border rounded-md font-medium hover:bg-accent transition"
        >
          Back to login
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}