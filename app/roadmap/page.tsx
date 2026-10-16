import Link from 'next/link';
import { Sparkles, CheckCircle2, Circle, Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Roadmap',
  description: 'What we shipped and what we\'re building next.',
};

type Status = 'shipped' | 'in_progress' | 'planned';

interface Item {
  title: string;
  status: Status;
  quarter: string;
}

const ROADMAP: Record<string, Item[]> = {
  Shipped: [
    { title: 'Multi-tenant workspaces + roles', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'RAG chat with cited answers', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Multi-LLM (Groq, Cohere, Gemini)', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Share links + QR codes', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Billing (Free / Pro / Business)', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Team invites with role management', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Webhooks with HMAC signing', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Response caching', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Two-factor authentication', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'GDPR data export & account deletion', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Super admin panel', status: 'shipped', quarter: 'Q4 2026' },
    { title: 'Customer support tickets', status: 'shipped', quarter: 'Q4 2026' },
  ],
  'In Progress': [
    { title: 'Real Razorpay integration', status: 'in_progress', quarter: 'Q4 2026' },
    { title: 'Mobile app (iOS + Android)', status: 'in_progress', quarter: 'Q4 2026' },
    { title: 'Streaming AI with prompt caching', status: 'in_progress', quarter: 'Q4 2026' },
  ],
  Planned: [
    { title: 'Slack integration', status: 'planned', quarter: 'Q1 2027' },
    { title: 'WhatsApp Business API', status: 'planned', quarter: 'Q1 2027' },
    { title: 'Zapier + Make.com integration', status: 'planned', quarter: 'Q1 2027' },
    { title: 'Custom domains per workspace', status: 'planned', quarter: 'Q1 2027' },
    { title: 'Advanced analytics & BI export', status: 'planned', quarter: 'Q1 2027' },
    { title: 'Voice input (Whisper)', status: 'planned', quarter: 'Q1 2027' },
    { title: 'Multi-language support (Hindi, Tamil, etc.)', status: 'planned', quarter: 'Q2 2027' },
    { title: 'SOC 2 compliance', status: 'planned', quarter: 'Q2 2027' },
  ],
};

function StatusIcon({ status }: { status: Status }) {
  if (status === 'shipped')
    return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
  if (status === 'in_progress')
    return <Loader2 className="w-4 h-4 text-primary shrink-0" />;
  return <Circle className="w-4 h-4 text-muted-foreground shrink-0" />;
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">LocalBiz AI</span>
        </Link>

        <h1 className="text-4xl font-bold tracking-tight mb-3">Roadmap</h1>
        <p className="text-muted-foreground mb-12">
          What we&apos;ve shipped and what we&apos;re building next. Updated
          monthly.
        </p>

        <div className="space-y-12">
          {Object.entries(ROADMAP).map(([section, items]) => (
            <div key={section}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {section}
                <span className="text-sm font-normal text-muted-foreground">
                  ({items.length})
                </span>
              </h2>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition"
                  >
                    <StatusIcon status={item.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.quarter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Have a feature request? We build what customers actually need.
          </p>
          <a
            href="mailto:hello@localbizai.com?subject=Feature%20request"
            className="text-primary hover:underline text-sm font-medium"
          >
            hello@localbizai.com
          </a>
        </div>
      </div>
    </div>
  );
}