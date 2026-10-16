export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using LocalBiz AI.',
};

export default function TermsPage() {
  const lastUpdated = '15 October 2026';
  const contactEmail = 'legal@localbizai.com';

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          These Terms of Service ("Terms") govern your use of LocalBiz AI
          (the "Service"). By creating an account, you agree to these Terms.
          If you don't agree, don't use the Service.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">1. Your Account</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>You must be 18+ to use the Service.</li>
          <li>You're responsible for keeping your password secure.</li>
          <li>You're responsible for all activity under your account.</li>
          <li>One person = one account. Don't share credentials.</li>
          <li>Provide accurate information — fake accounts will be suspended.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">2. Acceptable Use</h2>
        <p>You agree NOT to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Upload illegal, harmful, or infringing content</li>
          <li>Use the Service to generate spam, malware, or phishing content</li>
          <li>Attempt to reverse-engineer or bypass our security</li>
          <li>Resell the Service without a written agreement</li>
          <li>Use the Service to harass, threaten, or defame others</li>
          <li>Upload content you don't have the right to share</li>
          <li>Circumvent usage limits or plan restrictions</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these rules.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">3. Your Content</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>You own your content.</strong> Documents, chats, and other data you upload remain yours.</li>
          <li>You grant us a limited license to process your content solely to provide the Service.</li>
          <li>We do <strong>not</strong> train AI models on your content.</li>
          <li>You're responsible for ensuring you have the rights to upload your documents.</li>
          <li>You can delete your content at any time.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">4. AI-Generated Content</h2>
        <p>
          Our Service uses third-party AI models to generate answers. Important:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>AI can be wrong.</strong> Verify important information before acting on it.</li>
          <li>We don't guarantee the accuracy, completeness, or suitability of AI-generated answers.</li>
          <li>You're responsible for how you use AI-generated content.</li>
          <li>Don't rely on AI output for legal, medical, financial, or safety-critical decisions.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">5. Plans and Billing</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Free plan:</strong> limited features, no payment required.</li>
          <li><strong>Paid plans:</strong> billed monthly or annually in advance.</li>
          <li><strong>Auto-renewal:</strong> subscriptions renew automatically unless you cancel.</li>
          <li><strong>Cancellation:</strong> you can cancel anytime from your billing page. Access continues until the end of the paid period.</li>
          <li><strong>Price changes:</strong> we'll notify you 30 days before any price increase.</li>
          <li><strong>Taxes:</strong> prices are exclusive of GST and other applicable taxes.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">6. Refunds</h2>
        <p>
          See our <a href="/legal/refund" className="text-primary underline">Refund Policy</a>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">7. Service Availability</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>We aim for 99.5% uptime but don't guarantee uninterrupted service.</li>
          <li>Scheduled maintenance will be announced in advance.</li>
          <li>We're not liable for outages caused by third-party providers (AI, hosting, payment).</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">8. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Service, including its code, design, and branding, is owned by us.</li>
          <li>You may not copy, modify, or redistribute it without permission.</li>
          <li>You retain ownership of your own content.</li>
          <li>Feedback and feature requests become our property (we can use them freely).</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">9. Termination</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>You can delete your account anytime.</li>
          <li>We can suspend or terminate accounts for violations.</li>
          <li>After termination, your data is deleted per our Privacy Policy.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">10. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
          OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
          NON-INFRINGEMENT.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          INCLUDING LOST PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY WILL
          NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes will be
          resolved in the courts of [Your City], India.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">13. Changes to These Terms</h2>
        <p>
          We may update these Terms. We'll notify you of material changes via
          email at least 30 days before they take effect. Continued use after
          that means you accept the new Terms.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">14. Contact</h2>
        <p>
          Questions? Email{' '}
          <a href={`mailto:${contactEmail}`} className="text-primary underline">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </>
  );
}
