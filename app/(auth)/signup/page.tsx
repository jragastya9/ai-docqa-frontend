'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Building2,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    businessName: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Enter a valid email';
    if (!form.businessName.trim())
      errs.businessName = 'Business name is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signup', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        businessName: form.businessName.trim(),
        password: form.password,
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        if (data.tenant)
          localStorage.setItem('tenant', JSON.stringify(data.tenant));
        toast.success('Welcome to LocalBiz AI!');
        router.push('/dashboard');
      } else {
        toast.success(
          data.message || 'Account created. Please check your email.'
        );
        router.push('/login');
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/google-callback' });
    } catch (err) {
      console.error(err);
      toast.error('Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">LocalBiz AI</span>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              Create your workspace
            </h1>
            <p className="text-muted-foreground mt-2">
              Start chatting with your documents in minutes
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <GoogleIcon className="w-4 h-4 mr-2" />
                Sign up with Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Your name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Jane Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.name ? 'border-destructive' : ''
                  }`}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Business name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, businessName: e.target.value }))
                  }
                  placeholder="Acme Inc."
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.businessName ? 'border-destructive' : ''
                  }`}
                />
              </div>
              {errors.businessName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="you@company.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.email ? 'border-destructive' : ''
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {passwordStrength.label}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
        <div className="max-w-md space-y-6">
          <h2 className="text-2xl font-bold">
            Everything you need to chat with documents
          </h2>
          <ul className="space-y-3">
            {[
              'Upload unlimited PDFs',
              'Cited answers from AI',
              'Team workspaces with roles',
              'Share Q&A links & QR codes',
              'Multi-tenant architecture',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  score = Math.min(score, 4);

  const map = {
    0: { label: 'Too short', color: 'bg-muted' },
    1: { label: 'Weak', color: 'bg-red-500' },
    2: { label: 'Fair', color: 'bg-orange-500' },
    3: { label: 'Good', color: 'bg-yellow-500' },
    4: { label: 'Strong', color: 'bg-green-500' },
  };
  const entry = map[score as 0 | 1 | 2 | 3 | 4];
  return { score, label: entry.label, color: entry.color };
}
