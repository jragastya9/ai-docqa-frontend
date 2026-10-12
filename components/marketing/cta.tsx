'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
              Stop losing customers to slow replies
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Set up in 10 minutes. Free forever for your first document.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-background text-foreground rounded-md font-medium hover:bg-background/90 transition"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-8 text-primary-foreground rounded-md font-medium hover:bg-primary-foreground/10 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}