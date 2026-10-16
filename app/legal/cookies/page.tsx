export const metadata = {
  title: 'Cookie Policy',
  description: 'How LocalBiz AI uses cookies.',
};

export default function CookiesPage() {
  const contactEmail = 'privacy@localbizai.com';

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: 15 October 2026
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          This Cookie Policy explains how LocalBiz AI uses cookies and similar
          technologies.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-3">What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help websites remember your preferences and improve your
          experience.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-3">Cookies We Use</h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">Essential Cookies</h3>
        <p>Required for the Service to work:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Authentication token:</strong> keeps you logged in</li>
          <li><strong>Session tracking:</strong> security & device management</li>
          <li><strong>CSRF protection:</strong> prevents cross-site attacks</li>
        </ul>
        <p>These can't be disabled — the Service won't work without them.</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Functional Cookies</h3>
        <p>Remember your preferences:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Theme preference:</strong> light/dark mode</li>
          <li><strong>Language:</strong> your preferred language</li>
          <li><strong>Last visited page:</strong> for better UX</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Analytics Cookies (Optional)</h3>
        <p>Help us improve the Service:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Which pages you visit most</li>
          <li>How long you spend on each page</li>
          <li>Which features are used</li>
        </ul>
        <p>You can opt out via the cookie consent banner.</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Marketing Cookies (Optional)</h3>
        <p>Currently, we don't use any third-party marketing cookies.</p>

        <h2 className="text-2xl font-bold mt-6 mb-3">Managing Cookies</h2>
        <p>You can:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Accept or reject non-essential cookies via our banner</li>
          <li>Change your choice anytime via the footer link</li>
          <li>Delete cookies from your browser settings</li>
          <li>Block cookies entirely (will break the Service)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-3">Third-Party Cookies</h2>
        <p>We use these third-party services that may set cookies:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Razorpay/Stripe:</strong> payment processing</li>
          <li><strong>Resend:</strong> email delivery tracking (opens, clicks — only for marketing emails)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-3">Cookie Retention</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Session cookies: expire when you close your browser</li>
          <li>Auth token: 7 days (or until you log out)</li>
          <li>Preferences: 1 year</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-3">Contact</h2>
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
