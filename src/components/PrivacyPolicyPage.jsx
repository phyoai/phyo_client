'use client';

const SECTIONS = [
  {
    title: 'Introduction',
    body: 'Welcome to Phyo. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered influencer search platform and payment processing services through Razorpay.\n\nYour Personal Data shall be processed in accordance with this Privacy Policy, the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and any applicable rules and regulations thereunder.\n\nBy using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.',
  },
  {
    title: 'Information We Collect',
    subtitle: 'We collect the following types of personal information:',
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
    title: 'How We Use Your Information',
    subtitle: 'We use the collected information for the following purposes:',
    items: [
      'To provide, maintain and improve our platform services',
      'To process transactions and send related information including purchase confirmations',
      'To match brands with relevant influencers using our AI-powered search',
      'To send promotional communications, where you have opted in to receive them',
      'To monitor and analyze usage patterns and trends to improve user experience',
      'To detect, prevent and address technical issues and fraudulent activity',
      'To comply with legal obligations under applicable Indian laws and regulations',
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
    title: 'Data Security',
    body: 'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. We use SSL/TLS encryption for data transmission. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Your Rights',
    subtitle: 'Under applicable data protection laws, you have the right to:',
    items: [
      'Access the personal data we hold about you',
      'Request correction of inaccurate or incomplete personal data',
      'Request deletion of your personal data, subject to legal obligations',
      'Withdraw consent at any time where processing is based on consent',
      'Lodge a complaint with the relevant data protection authority',
      'Request restriction of processing of your personal data',
    ],
  },
  {
    title: 'Cookies and Tracking',
    body: 'We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, understand how you use our platform, and provide you with relevant content. You can control cookies through your browser settings, though disabling them may affect some features of our platform.',
  },
  {
    title: 'Contact Us',
    body: 'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at support@phyo.ai. We will respond to your inquiry within 30 business days.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#000201] text-white p-5">
      <div className="rounded-[24px] bg-[#181818] p-[20px] flex flex-col gap-[20px]">

        {/* Header */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Privacy Policy
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
