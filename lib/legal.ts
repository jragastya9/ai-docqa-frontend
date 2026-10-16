export const COMPANY = {
  name: 'LocalBiz AI',
  legalName: 'LocalBiz AI',
  email: 'legal@localbizai.com',
  supportEmail: 'support@localbizai.com',
  privacyEmail: 'privacy@localbizai.com',
  address: 'Bhubaneswar, Odisha, India',
  jurisdiction: 'Bhubaneswar, Odisha, India',
  lastUpdated: '15 October 2026',
};

export const PRIVACY_SECTIONS = [
  {
    title: '1. Introduction',
    body: `Welcome to ${COMPANY.name} ("we", "us", "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, applications, and services (the "Service"). We are committed to protecting your privacy and complying with applicable laws, including the Digital Personal Data Protection Act, 2023 (India) and, where applicable, the General Data Protection Regulation (GDPR) of the European Union.`,
  },
  {
    title: '2. Information We Collect',
    body: `We collect information you provide directly to us, information we collect automatically as you use the Service, and information from third-party services.

**Information you provide:**
• Account information (name, email address, business name, password)
• Documents you upload to chat with (PDFs and other supported files)
• Content of conversations with our AI assistant
• Team member details you add to your workspace
• Payment information processed by our payment provider (we do not store full card details)

**Information collected automatically:**
• IP address, browser type, operating system, device type
• Pages viewed, features used, time spent
• Session tokens and cookies for authentication

**Information from third parties:**
• If you sign in with Google, we receive your basic profile (name, email, profile picture)`,
  },
  {
    title: '3. How We Use Your Information',
    body: `We use the information we collect to:

• Provide, operate, and maintain the Service
• Process your requests, questions, and AI chat queries
• Send transactional emails (verification, password reset, invoices)
• Send marketing emails (only if you opted in)
• Monitor usage for billing and plan limits
• Detect, prevent, and address technical issues or abuse
• Comply with legal obligations

We do NOT sell your personal information to third parties. We do not use your uploaded documents to train our own AI models.`,
  },
  {
    title: '4. Data Sharing',
    body: `We share your information only with:

• **Service providers** that help us run the Service:
  – MongoDB Atlas (data hosting)
  – Vercel (frontend hosting)
  – Render (backend hosting)
  – Resend (email delivery)
  – Razorpay / Stripe (payments)
  – Groq, Cohere, Google, OpenAI (AI processing)

• **Legal authorities** when required by law
• **Successor entities** in case of merger or acquisition

Each provider is bound by strict data processing agreements.`,
  },
  {
    title: '5. AI Processing Disclosure',
    body: `When you chat with your documents, the following happens:

• Your question and relevant excerpts from your documents are sent to a large language model provider (Groq, Cohere, Google, or OpenAI) to generate an answer
• Your question and the AI answer are stored in our database to provide conversation history
• Your data is transmitted over encrypted HTTPS
• The AI provider does NOT use your data to train their models (all supported providers have zero-retention policies for API traffic)

You can disable response caching in your workspace settings. You can delete documents and conversations at any time.`,
  },
  {
    title: '6. Data Retention',
    body: `We retain your data for as long as your account is active. When you delete your account:

• Personal data is deleted within 30 days
• Some data may be retained up to 90 days in encrypted backups
• Legal/financial records (invoices) are retained as required by tax law (typically 7 years in India)

You can export all your data at any time from Settings → Security → Download all my data.`,
  },
  {
    title: '7. Your Rights',
    body: `Depending on your location, you have the following rights:

**Under India DPDP Act:**
• Right to access your personal data
• Right to correction of inaccurate data
• Right to erasure (delete your data)
• Right to grievance redressal
• Right to nominate a representative

**Under GDPR (EU users):**
• Right to access, rectify, or erase data
• Right to restrict or object to processing
• Right to data portability
• Right to withdraw consent
• Right to lodge a complaint with a supervisory authority

**To exercise any right:** email ${COMPANY.privacyEmail} or use Settings → Security.

We respond to all requests within 30 days.`,
  },
  {
    title: '8. Cookies',
    body: `We use the following cookies:

• **Essential cookies** (required): session token, theme preference, cookie consent
• **Analytics cookies** (optional): we currently use no third-party analytics

See our Cookie Policy for details. You can manage cookie preferences via the banner that appears on your first visit.`,
  },
  {
    title: '9. Security',
    body: `We implement industry-standard security measures:

• All traffic encrypted with HTTPS (TLS 1.3)
• Passwords hashed with bcrypt (12 rounds)
• JWT tokens with versioning for revocation
• Optional two-factor authentication (TOTP)
• Session tracking with device/IP logging
• Rate limiting and abuse prevention
• Regular security audits

No method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    title: '10. Children',
    body: `The Service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us.`,
  },
  {
    title: '11. International Transfers',
    body: `Your data may be transferred to and processed in countries outside your own. We ensure appropriate safeguards are in place, including standard contractual clauses and encrypted transmission.`,
  },
  {
    title: '12. Changes',
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or through the Service. The "Last updated" date at the top indicates when the policy was last revised.`,
  },
  {
    title: '13. Contact Us',
    body: `For privacy-related questions or requests:

Email: ${COMPANY.privacyEmail}
Address: ${COMPANY.address}

Data Protection Officer: The founder of ${COMPANY.legalName} acts as the DPO.`,
  },
];

export const TERMS_SECTIONS = [
  {
    title: '1. Agreement to Terms',
    body: `By accessing or using ${COMPANY.name} (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. If you are using the Service on behalf of a business, you represent that you have authority to bind that business to these Terms.`,
  },
  {
    title: '2. Accounts',
    body: `You must be at least 18 years old to use the Service. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activity that occurs under your account
• Ensuring all information you provide is accurate

You must notify us immediately of any unauthorized use. We are not liable for losses caused by unauthorized account access that was not reported.`,
  },
  {
    title: '3. Subscription and Billing',
    body: `**Plans:**
• Free plan: 1 document, 100 messages/month, 1 team member
• Pro plan: ₹499/month — 10 documents, 5,000 messages/month, 5 team members
• Business plan: ₹1,999/month — unlimited documents, messages, team members

**Payment:** All payments are processed by Razorpay (India) or Stripe (international). Prices are in Indian Rupees (INR) unless specified otherwise.

**Auto-renewal:** Subscriptions renew automatically. You can cancel anytime from the Billing page.

**Price changes:** We will notify you at least 30 days before any price change.`,
  },
  {
    title: '4. Refunds',
    body: `See our separate Refund Policy. In summary:

• First-time Pro or Business subscribers: full refund within 7 days
• Mid-cycle cancellations: no refund for the current period
• Service discontinuation by us: pro-rated refund

For refund requests, contact ${COMPANY.supportEmail}.`,
  },
  {
    title: '5. Acceptable Use',
    body: `You agree NOT to:

• Upload illegal, harmful, or infringing content
• Use the Service to send spam or unsolicited messages
• Attempt to gain unauthorized access to other accounts or systems
• Reverse engineer, decompile, or copy the Service
• Use the Service for illegal purposes
• Interfere with or disrupt the Service
• Use the Service to build a competing product
• Resell the Service without a written agreement

We may suspend or terminate accounts that violate these rules.`,
  },
  {
    title: '6. Your Content',
    body: `You retain ownership of all content you upload ("Your Content"). By using the Service, you grant us a limited, worldwide, royalty-free license to:

• Store, process, and display Your Content
• Send it to AI providers (as described in the Privacy Policy)
• Create technical copies for backups and security

We do NOT use Your Content to train our AI models or sell it to third parties.

You are responsible for ensuring you have the right to upload Your Content.`,
  },
  {
    title: '7. Our Content and IP',
    body: `The Service, including all software, design, text, graphics, and code, is owned by ${COMPANY.legalName} and protected by copyright and other laws. You may not copy, modify, or distribute our Service without written permission.

"${COMPANY.name}" and our logo are trademarks of ${COMPANY.legalName}.`,
  },
  {
    title: '8. AI Disclaimer',
    body: `The Service uses artificial intelligence to generate responses. AI models can:

• Make mistakes (hallucinate)
• Miss nuance
• Provide outdated information

You are responsible for verifying AI-generated content before relying on it for important decisions. We are not liable for decisions made based on AI responses.`,
  },
  {
    title: '9. Disclaimers',
    body: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or secure.`,
  },
  {
    title: '10. Limitation of Liability',
    body: `To the maximum extent permitted by law, we are not liable for:

• Indirect, incidental, or consequential damages
• Loss of profits, revenue, data, or business opportunities
• Damages exceeding the amount you paid us in the 12 months before the claim

This limitation applies regardless of the legal theory (contract, tort, etc.).`,
  },
  {
    title: '11. Termination',
    body: `You can terminate your account anytime from Settings → Security → Delete account.

We may terminate or suspend accounts for violations of these Terms, non-payment, or legal requirements. Upon termination, your right to use the Service ends immediately.`,
  },
  {
    title: '12. Governing Law',
    body: `These Terms are governed by the laws of India. Any disputes will be resolved in the courts of ${COMPANY.jurisdiction}, except where prohibited by local consumer protection laws.`,
  },
  {
    title: '13. Changes to Terms',
    body: `We may update these Terms from time to time. Material changes will be notified by email at least 30 days before they take effect. Continued use of the Service after changes means you accept the new Terms.`,
  },
  {
    title: '14. Contact',
    body: `Questions about these Terms? Contact ${COMPANY.email}.`,
  },
];

export const REFUND_SECTIONS = [
  {
    title: '1. Free Plan',
    body: `The Free plan is completely free. No payment is required, so no refund applies.`,
  },
  {
    title: '2. Pro and Business Plans — First-Time Purchase',
    body: `If you are subscribing to Pro or Business for the first time and are not satisfied, you may request a full refund within 7 days of your initial payment.

To request a refund:
• Email ${COMPANY.supportEmail} with your account email
• Subject: "Refund request — [your email]"
• Include a brief reason (optional, helps us improve)

Refunds are processed within 5–7 business days to your original payment method.`,
  },
  {
    title: '3. Renewal Payments',
    body: `Renewal payments (every 30 days) are NOT refundable. We send a reminder email before each renewal so you can cancel in advance.

If you cancel mid-cycle, you retain access until the end of your current billing period but do not receive a prorated refund.`,
  },
  {
    title: '4. Downgrade',
    body: `If you downgrade from Pro or Business to Free, your plan changes immediately. Refunds are not provided for the unused portion of the current period.`,
  },
  {
    title: '5. Service Issues',
    body: `If the Service has been unavailable for more than 72 consecutive hours due to our fault, you may request a prorated refund for the affected period.`,
  },
  {
    title: '6. Exceptions',
    body: `Refunds are NOT provided for:

• Accounts suspended or terminated for violating our Terms of Service
• Requests made after the 7-day window (for first-time purchases)
• Renewal payments, regardless of usage
• Customers who have previously received a refund for the same plan`,
  },
  {
    title: '7. Currency',
    body: `All prices are in Indian Rupees (INR). If you pay in another currency through Stripe, your refund will be in the same currency at the exchange rate on the refund date.`,
  },
  {
    title: '8. Contact',
    body: `For refund questions: ${COMPANY.supportEmail}`,
  },
];

export const DPA_SECTIONS = [
  {
    title: '1. Purpose',
    body: `This Data Processing Agreement ("DPA") forms part of the Terms of Service between you (the "Controller") and ${COMPANY.legalName} (the "Processor"). It governs our processing of personal data on your behalf when you use the Service.`,
  },
  {
    title: '2. Scope of Processing',
    body: `We process personal data only to:

• Provide, maintain, and improve the Service
• Follow your documented instructions
• Comply with legal obligations

We do NOT process data for our own marketing, analytics (beyond usage metering), or resale.`,
  },
  {
    title: '3. Your Responsibilities',
    body: `As Controller, you are responsible for:

• Ensuring you have legal basis to process the data
• Providing privacy notices to your end users
• Responding to your end users' privacy requests
• Not uploading data you don't have rights to`,
  },
  {
    title: '4. Our Obligations',
    body: `As Processor, we agree to:

• Process data only per your instructions
• Ensure personnel with access are bound by confidentiality
• Implement appropriate technical and organizational security measures
• Assist you with privacy impact assessments
• Notify you within 72 hours of any data breach
• Delete or return data upon termination`,
  },
  {
    title: '5. Sub-Processors',
    body: `You authorize us to engage sub-processors. Current list:

• MongoDB Atlas (data hosting)
• Vercel (frontend hosting)
• Render (backend hosting)
• Resend (email delivery)
• Razorpay/Stripe (payments)
• Groq, Cohere, Google, OpenAI (AI)

We will notify you at least 30 days before adding a new sub-processor.`,
  },
  {
    title: '6. Data Transfers',
    body: `Where data is transferred outside your jurisdiction, we rely on:

• EU Standard Contractual Clauses (for GDPR transfers)
• Appropriate safeguards for other regions
• Encrypted transmission in all cases`,
  },
  {
    title: '7. Security Measures',
    body: `See the Privacy Policy section on Security. In summary: encryption in transit, hashed passwords, JWT versioning, 2FA support, session tracking, and rate limiting.`,
  },
  {
    title: '8. Audit Rights',
    body: `You may request documentation of our security measures once per year. On-site audits require 30 days' notice and mutual agreement on scope and confidentiality.`,
  },
  {
    title: '9. Term and Termination',
    body: `This DPA is effective when you accept the Terms of Service and continues until you delete your account. Upon termination, we will delete or return your data within 30 days.`,
  },
  {
    title: '10. Contact',
    body: `For DPA-related questions: ${COMPANY.privacyEmail}`,
  },
];

export const COOKIE_SECTIONS = [
  {
    title: '1. What Are Cookies',
    body: `Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.`,
  },
  {
    title: '2. Cookies We Use',
    body: `**Essential cookies (required):**
• \`token\` — your session JWT for authentication (7 days)
• \`theme\` — light/dark mode preference
• \`cookie_consent\` — remembers your cookie choice
• \`user\`, \`tenant\` — cached user/tenant data for faster page loads

These are required for the Service to function. They do NOT track you across sites.

**Analytics cookies:**
Currently we do NOT use any third-party analytics cookies.`,
  },
  {
    title: '3. Managing Cookies',
    body: `You can control cookies via:

• The cookie banner on your first visit
• Your browser settings (block or delete cookies)
• Clearing site data in your browser

Note: Blocking essential cookies will prevent you from logging in.`,
  },
  {
    title: '4. Third-Party Cookies',
    body: `We do not set third-party cookies. Google Sign-In may set cookies during the OAuth flow — see Google's Privacy Policy.`,
  },
  {
    title: '5. Contact',
    body: `Cookie questions? Email ${COMPANY.privacyEmail}.`,
  },
];
