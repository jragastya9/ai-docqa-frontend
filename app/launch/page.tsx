import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Zap,
  Share2,
  Brain,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Launch — LocalBiz AI is live',
  description:
    'LocalBiz AI is officially live. Upload PDFs, chat with cited answers, and share with your customers.',
};

const FEATURES = [
  {
    icon: Brain,
    title: 'Chat with documents',
    desc: 'Upload PDFs. Ask questions. Get cited answers.',
  },
  {
    icon: Zap,
    title: 'Multi-LLM',
    desc: 'Groq, Cohere, Gemini — pick the fastest or smartest.',
  },
  {
    icon: Share2,
    title: 'Public share links',
    desc: 'QR codes and embeds for your customers.',
  },
  {
    icon: Users,
    title: 'Team workspaces',
    desc: 'Invite teammates with role-based access.',
  },
  {
    icon: Shield,
    title: 'Enterprise security',
    desc: '2FA, sessions, GDPR data export.',
  },
  {
    icon: BarChart3,
    title: 'Analytics built-in',
    desc: 'See top questions and doc usage.',
  },
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <Rocket className="w-3 h-3" />
            Live now
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
            LocalBiz AI is
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {' '}
              officially live
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            Upload your business documents. Chat with them using AI. Get cited
            answers. Share with customers in one click.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link href="/signup">
              <Button size="lg">
                Start free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button size="lg" variant="outline">
                View pricing
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            No credit card. Free forever plan available.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Everything you need to launch AI support
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title}>
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Built in 30 days */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Built in 30 days, in public
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LocalBiz AI was built from scratch over 30 days. Every feature
              shipped, every bug fixed, in public. See the full journey on our
              changelog.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link href="/changelog">
                <Button variant="outline" size="sm">
                  View changelog
                </Button>
              </Link>
              <Link href="/roadmap">
                <Button variant="outline" size="sm">
                  See roadmap
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to try it?
        </h2>
        <p className="text-muted-foreground mb-8">
          Sign up free. Upload a document. Get your first answer in under 2 minutes.
        </p>
        <Link href="/signup">
          <Button size="lg">
            Get started free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Free forever plan
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Cancel anytime
          </span>
        </div>
      </section>
    </div>
  );
}