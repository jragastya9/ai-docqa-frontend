import Link from 'next/link';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col p-6 md:p-12">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg mb-12 w-fit"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>LocalBiz AI</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          {children}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          © 2026 LocalBiz AI. All rights reserved.
        </p>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />

        <div className="relative max-w-lg mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-primary-foreground leading-tight">
              Ask AI questions about your documents
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Upload any PDF. Get instant answers with source citations.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Upload unlimited PDFs',
              'AI-powered semantic search',
              'Source citations on every answer',
              'Share with your team',
              'QR codes for your shop',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground flex-shrink-0" />
                <span className="text-primary-foreground/90">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-primary-foreground/20">
            <div className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold">
                    R
                  </span>
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/90 italic">
                    &ldquo;Before, I&apos;d wake up to 12 missed messages. Now I
                    wake up to 12 confirmed bookings.&rdquo;
                  </p>
                  <p className="text-xs text-primary-foreground/70 mt-2">
                    — Ravi S., Salon Owner, Bangalore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}