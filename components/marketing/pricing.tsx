'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/forever',
    desc: 'Perfect to try it out',
    features: [
      '1 document',
      '100 AI messages/month',
      'Basic source citations',
      'Public share link',
    ],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    desc: 'For growing businesses',
    features: [
      '10 documents',
      '5,000 AI messages/month',
      'Advanced citations + page numbers',
      'Custom branding',
      'QR code + embed widget',
      'Email support',
    ],
    cta: 'Start 14-day trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '₹1,999',
    period: '/month',
    desc: 'For teams and agencies',
    features: [
      'Unlimited documents',
      'Unlimited messages',
      'Team members + roles',
      'Custom domain',
      'API access',
      'Priority support',
    ],
    cta: 'Contact sales',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-primary font-medium mb-4">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.highlight
                    ? 'border-primary shadow-xl shadow-primary/10 md:scale-105'
                    : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>

                  <Link
                    href="/signup"
                    className={`w-full mb-6 inline-flex items-center justify-center h-11 px-6 rounded-md font-medium transition ${
                      plan.highlight
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-border bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}