'use client';

import { motion } from 'framer-motion';

export function TrustedBy() {
  const logos = [
    'SalonHub',
    'ClinicPro',
    'TutorConnect',
    'FitLife',
    'RealtyGenie',
    'CafeCentral',
  ];

  return (
    <section className="py-16 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by 340+ small businesses across India
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
          {logos.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="text-lg md:text-xl font-semibold tracking-tight text-muted-foreground"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}