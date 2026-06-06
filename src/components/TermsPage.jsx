'use client';

const SECTIONS = [
  {
    title: 'Introduction',
    body: 'Welcome to Phyo. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered influencer search platform and payment processing services through Razorpay.\n\nYour Personal Data shall be processed in accordance with this Privacy Policy, the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and any applicable rules and regulations thereunder.\n\nBy using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.',
  },
  {
    title: 'How We Use Your Information',
    subtitle: 'We use the collected information for the following purposes:',
    items: [
      'Personal Identifiers: Name, email address, contact information, date of birth, demographic information such as age and gender',
      'Account Information: Profile information for brands and influencers, communication preferences',
      'Payment Information: Payment details processed securely through Razorpay including transaction data, billing information',
      'Transaction Data: Items purchased, payment amounts, transaction history',
      'User-Generated Content: Campaign descriptions, search queries, feedback and reviews',
      'Platform Analytics: Usage data, interaction metrics, performance data',
      'Device Information: IP address, browser type, operating system, device identifiers',
      'KYC Documents: As required by RBI regulations and applicable laws',
    ],
  },
  {
    title: 'Data Sharing and Disclosure',
    subtitle: 'We may share your information in the following circumstances:',
    items: [
      'Service Providers: Third-party vendors who assist in operating our platform, including Razorpay for payment processing',
      'Business Partners: Brands and influencers on the platform as necessary to facilitate campaigns',
      'Legal Requirements: When required by law, court order, or governmental authority',
      'Business Transfers: In connection with a merger, acquisition, or sale of assets',
      'Protection of Rights: To protect the rights, property, or safety of Phyo, our users, or others',
    ],
  },
  {
    title: 'User Rights',
    subtitle: 'You have the following rights regarding your personal data:',
    items: [
      'Access: Request a copy of the personal data we hold about you',
      'Correction: Request correction of inaccurate or incomplete data',
      'Deletion: Request deletion of your personal data, subject to legal obligations',
      'Portability: Receive your data in a structured, machine-readable format',
      'Objection: Object to processing of your data for certain purposes',
      'Withdrawal: Withdraw consent at any time where processing is based on consent',
    ],
  },
  {
    title: 'Payments & Subscriptions',
    body: 'All payment transactions are processed securely through Razorpay, a PCI-DSS compliant payment gateway. Phyo does not store your full card details on its servers. Subscription fees are billed in advance on a recurring basis. You may pause or cancel your subscription at any time from the Account settings. Refunds are subject to our refund policy.',
  },
  {
    title: 'Contact Us',
    body: 'If you have any questions, concerns, or requests regarding this Terms & Conditions or our privacy practices, please contact us at support@phyo.ai. We will respond to your inquiry within 30 business days.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#000201] text-white p-5">
      <div className="rounded-[24px] bg-[#181818] p-[20px] flex flex-col gap-[20px]">

        {/* Header */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Terms & Conditions
          </h1>
          <p className="text-[16px] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Last updated: 4 May 2026
          </p>
        </div>

        <div className="h-px bg-white/10" />

        {/* Sections */}
        <div className="flex flex-col gap-[40px]">
          {SECTIONS.map((section, i) => (
            <div key={i} className="flex flex-col gap-[8px]">
              <h2 className="text-[20px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-[16px] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {section.subtitle}
                </p>
              )}
              {section.body && (
                <p className="text-[16px] leading-[1.7] text-[#9a9a9a] whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {section.body}
                </p>
              )}
              {section.items && (
                <div className="flex flex-col gap-[16px] mt-[12px]">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-[12px]">
                      <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#16a34a]" />
                      <p className="text-[14px] leading-[1.6] text-[#9a9a9a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
