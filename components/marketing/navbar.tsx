'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>LocalBiz AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#how" className="text-muted-foreground hover:text-foreground transition">How it works</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md hover:bg-accent transition">
            Login
          </Link>
          <Link href="/signup" className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
            Get Started
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <a href="#features" className="text-lg">Features</a>
                <a href="#how" className="text-lg">How it works</a>
                <a href="#pricing" className="text-lg">Pricing</a>
                <a href="#faq" className="text-lg">FAQ</a>
                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  <Link href="/login" className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium border border-border rounded-md hover:bg-accent transition">
                    Login
                  </Link>
                  <Link href="/signup" className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
                    Get Started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}