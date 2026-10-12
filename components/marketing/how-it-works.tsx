'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    title: 'Upload your documents',
    desc: 'Drop a PDF. We extract the text, split it into chunks, and prepare it for AI search.',
  },
  {
    n: '02',
    title: 'AI learns your content',
    desc: 'Every chunk gets embedded into a vector. Semantic search finds meaning, not just keywords.',
  },
  {
    n: '03',
    title: 'Ask anything',
    desc: 'Type a question. Get an answer grounded in your documents, with exact source citations.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-primary font-medium mb-4">How it works</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Live in 10 minutes
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            No code. No training. Just upload and ask.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative"
            >
              <div className="text-6xl md:text-7xl font-bold text-primary/15 mb-4">
                {step.n}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}