import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top header with logo */}
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>LocalBiz AI</span>
        </Link>
      </header>

      {/* Centered form */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-muted-foreground">
        © 2026 LocalBiz AI. All rights reserved.
      </footer>
    </div>
  );
}