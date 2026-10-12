'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  MessageSquare,
  Zap,
  Shield,
  Globe,
  Users,
  Sparkles,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: FileText,
    title: 'Upload any PDF',
    desc: 'Menus, price lists, policies, FAQs — anything. Our AI understands it all.',
  },
  {
    icon: MessageSquare,
    title: 'Chat naturally',
    desc: 'Ask questions in plain language. Get answers with source citations.',
  },
  {
    icon: Zap,
    title: 'Instant answers',
    desc: 'Semantic search finds the right context in milliseconds, not hours.',
  },
  {
    icon: Shield,
    title: 'Grounded in truth',
    desc: 'Every answer cites its source. No hallucinations. Ever.',
  },
  {
    icon: Globe,
    title: 'Share anywhere',
    desc: 'Public chat links, QR codes, WhatsApp — share your knowledge.',
  },
  {
    icon: Users,
    title: 'Team ready',
    desc: 'Invite staff, manage roles, track usage. Built for real businesses.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}