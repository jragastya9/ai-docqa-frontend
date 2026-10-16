export const metadata = {
  title: 'Privacy Policy',
  description: 'How LocalBiz AI collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  const lastUpdated = '15 October 2026';
  const contactEmail = 'privacy@localbizai.com';

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          This Privacy Policy describes how LocalBiz AI ("we", "us", or "our")
          collects, uses, and shares information about you when you use our
          website and services (collectively, the "Service").
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">1. Information We Collect</h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">1.1 Information you provide</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account information:</strong> name, email address, password (hashed), business name</li>
          <li><strong>Content:</strong> documents you upload, questions you ask, conversations you have with the AI</li>
          <li><strong>Payment information:</strong> processed by Razorpay/Stripe — we never store your card details</li>
          <li><strong>Communications:</strong> support tickets, feedback, and any messages you send us</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">1.2 Information collected automatically</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Usage data:</strong> pages visited, features used, IP address, browser type, device type</li>
          <li><strong>Session data:</strong> login timestamps, device information for security purposes</li>
          <li><strong>Cookies:</strong> see our <a href="/legal/cookies" className="text-primary underline">Cookie Policy</a></li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">1.3 Information from third parties</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google Sign-In: name, email, profile image (if you use Google to log in)</li>
          <li>Payment processors: transaction status, not full card details</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Provide the Service:</strong> process your documents, generate AI answers, manage your workspace</li>
          <li><strong>Improve the Service:</strong> analyze usage patterns to fix bugs and add features</li>
          <li><strong>Communicate:</strong> send transaction emails, security alerts, and (with consent) product updates</li>
          <li><strong>Comply with law:</strong> respond to legal requests and enforce our Terms</li>
          <li><strong>Prevent abuse:</strong> detect fraud, spam, and violations of our Terms</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">3. AI Processing and Your Documents</h2>
        <p>
          When you upload documents and ask questions:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your document is chunked and converted to numerical embeddings, stored in your private database</li>
          <li>Relevant chunks are sent to third-party AI providers (Groq, Cohere, OpenAI, Google) to generate answers</li>
          <li>These providers do <strong>not</strong> train models on your data — we use API tiers with explicit no-training policies</li>
          <li>Your documents are <strong>never</strong> shared with other tenants or used to train our AI</li>
          <li>You can delete your documents at any time, which permanently removes all associated data</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">4. How We Share Information</h2>
        <p>We do <strong>not</strong> sell your personal data. We share it only with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Service providers:</strong> AWS (hosting), MongoDB Atlas (database), Resend (email), Razorpay/Stripe (payments), AI providers (chat)</li>
          <li><strong>Legal requirements:</strong> when required by law, court order, or to protect our rights</li>
          <li><strong>Business transfers:</strong> if we're acquired or merge, your data may transfer to the successor</li>
          <li><strong>With your consent:</strong> for any other purpose, we'll ask first</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">5. Data Retention</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account data:</strong> while your account is active, plus 30 days after deletion (grace period)</li>
          <li><strong>Documents and chats:</strong> until you delete them or delete your account</li>
          <li><strong>Session logs:</strong> 90 days (for security investigation)</li>
          <li><strong>Billing records:</strong> 7 years (required by Indian tax law)</li>
          <li><strong>Marketing email logs:</strong> 24 months</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">6. Your Rights</h2>
        <p>Under GDPR and India DPDP, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Access:</strong> download all your data (Settings → Security → Download my data)</li>
          <li><strong>Correct:</strong> edit your profile at any time</li>
          <li><strong>Delete:</strong> delete your account (Settings → Security → Delete account)</li>
          <li><strong>Portability:</strong> receive your data in JSON format</li>
          <li><strong>Object:</strong> opt out of marketing emails (via unsubscribe link)</li>
          <li><strong>Withdraw consent:</strong> disable cookies via your browser settings</li>
        </ul>
        <p>
          To exercise these rights, email <a href={`mailto:${contactEmail}`} className="text-primary underline">{contactEmail}</a>.
          We respond within 30 days.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">7. Data Security</h2>
        <p>
          We use industry-standard security: HTTPS encryption in transit, bcrypt
          password hashing, JWT with token versioning, 2FA support, session tracking,
          and regular backups. However, no method is 100% secure — we can't
          guarantee absolute security.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">8. Children's Privacy</h2>
        <p>
          The Service is not intended for anyone under 13 (or under 16 in the EU).
          We do not knowingly collect data from children.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">9. International Transfers</h2>
        <p>
          Your data may be transferred to and processed in countries other than
          your own (including the US and EU) where our service providers operate.
          We ensure adequate safeguards (standard contractual clauses) for such transfers.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">10. Changes to This Policy</h2>
        <p>
          We may update this policy. We'll notify you of material changes via
          email or in-app notice at least 30 days before they take effect.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">11. Contact Us</h2>
        <p>
          Questions? Email <a href={`mailto:${contactEmail}`} className="text-primary underline">{contactEmail}</a>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">12. Grievance Officer (India)</h2>
        <p>
          In accordance with the Indian IT Rules, 2021:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name: [Your Name]</li>
          <li>Email: <a href={`mailto:${contactEmail}`} className="text-primary underline">{contactEmail}</a></li>
          <li>Response time: within 15 days</li>
        </ul>
      </section>
    </>
  );
}
