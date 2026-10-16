export const metadata = {
  title: 'Refund Policy',
  description: 'LocalBiz AI refund policy for paid plans.',
};

export default function RefundPage() {
  const contactEmail = 'billing@localbizai.com';

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: 15 October 2026
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        <h2 className="text-2xl font-bold mt-6 mb-3">Free Plan</h2>
        <p>
          The Free plan is provided at no cost. No refunds apply.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-3">7-Day Money-Back Guarantee</h2>
        <p>
          For first-time purchases of paid plans (Pro or Business), we offer a
          <strong> 7-day money-back guarantee</strong> from the date of purchase.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-3">Eligibility</h2>
        <p>To be eligible for a refund:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>You must request within 7 days of your first payment</li>
          <li>You must not have previously received a refund from us</li>
          <li>The account must not have been suspended for Terms violations</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-3">What's Not Refundable</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Renewals (existing customers — first 7 days don't apply)</li>
          <li>Partial months (we don't prorate)</li>
          <li>Add-on services purchased separately</li>
          <li>Accounts terminated for Terms violations</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-3">How to Request a Refund</h2>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Email <a href={`mailto:${contactEmail}`} className="text-primary underline">{contactEmail}</a> with:
            <ul className="list-disc pl-6 mt-1">
              <li>Your account email</li>
              <li>Payment ID (from Razorpay/Stripe receipt)</li>
              <li>Reason for the refund (helps us improve)</li>
            </ul>
          </li>
          <li>We'll respond within 3 business days</li>
          <li>Approved refunds are processed within 5–7 business days</li>
          <li>Refunds go back to the original payment method</li>
        </ol>

        <h2 className="text-2xl font-bold mt-6 mb-3">Cancellation</h2>
        <p>
          You can cancel your subscription anytime from your billing page. After
          cancellation:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your paid features remain active until the end of the current billing period</li>
          <li>No further charges are made</li>
          <li>Your account automatically downgrades to the Free plan after the period ends</li>
        </ul>
        <p>
          <strong>Cancellation is not the same as a refund.</strong> If you want
          a refund, you must request it per the process above.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-3">Exceptions</h2>
        <p>
          In rare cases (billing errors, duplicate charges, extended outages),
          we may issue refunds outside this policy at our discretion.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-3">Contact</h2>
        <p>
          Billing questions? Email{' '}
          <a href={`mailto:${contactEmail}`} className="text-primary underline">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </>
  );
}
