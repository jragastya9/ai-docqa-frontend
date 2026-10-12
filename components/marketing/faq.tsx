'use client';

import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'Is this just another ChatGPT wrapper?',
    a: 'No. LocalBiz AI uses Retrieval-Augmented Generation (RAG) — the same technique powering ChatGPT plugins and enterprise AI. Your questions search your specific documents, and answers cite exactly which page the information came from.',
  },
  {
    q: 'What file types can I upload?',
    a: 'PDFs are supported today. DOCX, URL imports, and Notion sync are coming soon. For best results, use text-based PDFs (not scanned images).',
  },
  {
    q: 'How long does setup take?',
    a: 'Under 10 minutes. Sign up, upload a PDF, ask your first question. The AI handles the rest.',
  },
  {
    q: 'Will it hallucinate answers?',
    a: "No. Every answer is grounded in your documents. If the answer isn't in your files, the AI says so — it doesn't make things up. Every response includes source citations.",
  },
  {
    q: 'Can I share the chat with my customers?',
    a: 'Yes. Every document gets a public share link and a QR code. Print it on your shop, share it on WhatsApp, embed it on your website.',
  },
  {
    q: 'Is my data safe?',
    a: "Yes. Documents are encrypted in transit and at rest. Each business's data is fully isolated. We comply with GDPR and India's DPDP Act.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="text-primary font-medium mb-4">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Questions, answered
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-border rounded-xl p-4 bg-card cursor-pointer transition-colors hover:border-primary/40"
            >
              <summary className="font-medium list-none flex items-center justify-between gap-4">
                <span>{faq.q}</span>
                <span className="text-muted-foreground group-open:rotate-45 transition-transform text-2xl leading-none flex-shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                {faq.a}
              </p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}