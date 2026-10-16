import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              LocalBiz AI
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered document Q&amp;A for small businesses. Upload. Ask. Get
              answers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/launch" className="hover:text-foreground">
                  Launch
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-foreground">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground">
                  Roadmap
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@localbizai.com"
                  className="hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <div>© 2026 LocalBiz AI. All rights reserved.</div>
          <div>Built with MERN + RAG + open-source AI</div>
        </div>
      </div>
    </footer>
  );
}