import Link from 'next/link';
import { Sparkles, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Changelog',
  description: 'Every update to LocalBiz AI — shipped in public.',
};

interface Entry {
  date: string;
  version: string;
  title: string;
  items: string[];
}

const ENTRIES: Entry[] = [
  {
    date: '16 Oct 2026',
    version: 'v1.0.0',
    title: 'Launch day 🚀',
    items: [
      'LocalBiz AI is live',
      'Multi-tenant SaaS with unlimited workspaces',
      'Free / Pro / Business plans available',
      'Public signup open',
    ],
  },
  {
    date: '15 Oct 2026',
    version: 'v0.28.0',
    title: 'Legal pages & cookie consent',
    items: [
      'Privacy Policy, Terms of Service, Refund Policy',
      'Cookie consent banner with granular control',
      'GDPR / India DPDP compliance',
    ],
  },
  {
    date: '14 Oct 2026',
    version: 'v0.27.0',
    title: 'Load testing',
    items: [
      'Verified 0% error rate under 100 concurrent users',
      'Average response: 1ms for health checks',
      'Added in-memory cache for hot reads',
      'Slow query logging',
    ],
  },
  {
    date: '13 Oct 2026',
    version: 'v0.26.0',
    title: 'Marketing automation',
    items: [
      'Onboarding email drip (day 0, 1, 3)',
      'Usage warnings at 80%',
      'Win-back emails after 14 days inactive',
      'Weekly digest',
      'Unsubscribe handling',
    ],
  },
  {
    date: '12 Oct 2026',
    version: 'v0.25.0',
    title: 'Customer support system',
    items: [
      'In-app support tickets',
      'Admin reply threads',
      'Status workflow (open → resolved)',
    ],
  },
  {
    date: '11 Oct 2026',
    version: 'v0.24.0',
    title: 'Backup & disaster recovery',
    items: [
      'One-click full backup export',
      'Database size stats',
      'Public health check endpoint',
    ],
  },
  {
    date: '10 Oct 2026',
    version: 'v0.23.0',
    title: 'Content moderation',
    items: [
      'AI-powered moderation on all user input',
      'Abuse report system',
      'Moderation logs',
    ],
  },
  {
    date: '09 Oct 2026',
    version: 'v0.22.0',
    title: 'Security hardening',
    items: [
      'Two-factor authentication (TOTP) with backup codes',
      'Session tracking + device management',
      'Token versioning for instant session revocation',
      'GDPR data export & account deletion',
    ],
  },
  {
    date: '08 Oct 2026',
    version: 'v0.21.0',
    title: 'Super admin panel',
    items: [
      'Global dashboard (MRR, ARR, signups)',
      'Impersonate tenants with audit log',
      'Feature flags per tenant',
      'Change plan / suspend tenants',
    ],
  },
  {
    date: '07 Oct 2026',
    version: 'v0.20.0',
    title: 'Multi-LLM + caching',
    items: [
      'Groq, Cohere, Gemini providers',
      'Per-workspace custom prompts',
      'Response caching (1-hour TTL)',
      'Thumbs up/down feedback',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">LocalBiz AI</span>
        </Link>

        <h1 className="text-4xl font-bold tracking-tight mb-3">Changelog</h1>
        <p className="text-muted-foreground mb-12">
          Every update, shipped in public. Built over 30 days.
        </p>

        <div className="space-y-12">
          {ENTRIES.map((entry) => (
            <div key={entry.version} className="relative pl-6 border-l-2 border-border">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />

              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm font-semibold text-primary">
                  {entry.version}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {entry.date}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-3">{entry.title}</h2>

              <ul className="space-y-1.5">
                {entry.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Want to see what&apos;s coming next?{' '}
            <Link href="/roadmap" className="text-primary hover:underline">
              View the roadmap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}