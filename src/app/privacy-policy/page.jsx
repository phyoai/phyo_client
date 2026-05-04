import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";

const lastUpdated = "4 May 2026";

const contentSections = [
  {
    title: "Introduction",
    paragraphs: [
      "Welcome to Phyo. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered influencer search platform and payment processing services through Razorpay.",
      "Your Personal Data shall be processed in accordance with this Privacy Policy, the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and any applicable rules and regulations thereunder.",
      "By using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.",
    ],
  },
  {
    title: "Information We Collect",
    groups: [
      {
        title: "Personal Information",
        intro: "We collect the following personal information:",
        items: [
          {
            label: "Personal Identifiers",
            text: "Name, email address, contact information, date of birth, demographic information such as age and gender.",
          },
          {
            label: "Account Information",
            text: "Profile information for brands and influencers, communication preferences.",
          },
          {
            label: "Payment Information",
            text: "Payment details processed securely through Razorpay, including transaction data and billing information.",
          },
          {
            label: "Transaction Data",
            text: "Items purchased, payment amounts, and transaction history.",
          },
          {
            label: "User-Generated Content",
            text: "Campaign descriptions, search queries, feedback, and reviews.",
          },
          {
            label: "KYC Documents",
            text: "As required by RBI regulations and applicable laws.",
          },
        ],
      },
      {
        title: "Device & Technical Data",
        intro: "We automatically collect certain technical information:",
        items: [
          {
            label: "Device Information",
            text: "IP address, browser type, operating system, and device identifiers.",
          },
          {
            label: "Usage Data",
            text: "Pages visited, time spent, search queries, and related activity data.",
          },
          {
            label: "Location Data",
            text: "Approximate device location if you grant permission.",
          },
          {
            label: "Cookies and Tracking",
            text: "Session cookies and persistent cookies for functionality, security, and analytics.",
          },
        ],
      },
      {
        title: "Influencer Data",
        intro:
          "Our platform aggregates publicly available information about influencers:",
        items: [
          {
            label: "Social Profiles",
            text: "Public social media profiles and follower counts.",
          },
          {
            label: "Engagement Metrics",
            text: "Content categories, engagement metrics, and profile activity signals.",
          },
          {
            label: "Audience Insights",
            text: "Demographic information and audience insights derived from available sources.",
          },
          {
            label: "Commercial Signals",
            text: "Collaboration rates and availability status where publicly accessible or submitted.",
          },
        ],
      },
    ],
  },
  {
    title: "How We Use Your Information",
    intro: "We use the collected information for the following purposes:",
    items: [
      {
        label: "Service Provision",
        text: "Provide and maintain our AI-powered influencer search services.",
      },
      {
        label: "Account Management",
        text: "Process and manage user accounts, subscriptions, and payment transactions.",
      },
      {
        label: "Matching Services",
        text: "Match brands with relevant influencers based on search criteria.",
      },
      {
        label: "Payment Processing",
        text: "Facilitate secure payments through Razorpay in compliance with RBI guidelines.",
      },
      {
        label: "KYC Compliance",
        text: "Conduct Know Your Customer checks as required by applicable laws.",
      },
      {
        label: "Platform Improvement",
        text: "Analyze usage patterns to enhance our services.",
      },
      {
        label: "Communications",
        text: "Send service updates, transaction confirmations, and promotional communications.",
      },
      {
        label: "Security & Fraud Prevention",
        text: "Detect and prevent fraud and ensure platform security.",
      },
      {
        label: "Legal Compliance",
        text: "Comply with applicable laws and enforce our terms of service.",
      },
    ],
  },
  {
    title: "Payment Processing & Security",
    intro:
      "We partner with Razorpay Software Limited for secure payment processing:",
    items: [
      {
        label: "PCI DSS Compliance",
        text: "All payment data is processed in compliance with Payment Card Industry Data Security Standards.",
      },
      {
        label: "Encryption",
        text: "We use industry-standard encryption for sensitive data transmission and storage safeguards.",
      },
      {
        label: "Secure Transmission",
        text: "All services are served over HTTPS using TLS.",
      },
      {
        label: "Tokenization",
        text: "Payment details are replaced with secure tokens to reduce exposure risk.",
      },
      {
        label: "RBI Compliance",
        text: "We adhere to Reserve Bank of India regulations for payment processing.",
      },
      {
        label: "Data Minimization",
        text: "We only collect payment information necessary for transaction processing.",
      },
    ],
    paragraphs: [
      "When you make payments through our platform, your payment information is directly processed by Razorpay and subject to their privacy policy available at razorpay.com/privacy.",
    ],
  },
  {
    title: "Information Sharing and Disclosure",
    intro:
      "We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:",
    items: [
      {
        label: "Payment Partners",
        text: "With Razorpay for secure payment processing and transaction facilitation.",
      },
      {
        label: "Financial Institutions",
        text: "With banks, RBI, or other regulatory agencies as required by law.",
      },
      {
        label: "Service Providers",
        text: "With trusted third-party providers assisting platform operations under confidentiality obligations.",
      },
      {
        label: "Legal Requirements",
        text: "When required by law, court orders, or to protect our rights and safety.",
      },
      {
        label: "Business Transfers",
        text: "In connection with a merger, acquisition, or sale of assets, subject to confidentiality obligations.",
      },
      {
        label: "Explicit Consent",
        text: "With your explicit consent for specific purposes.",
      },
      {
        label: "KYC & AML",
        text: "For Know Your Customer and Anti-Money Laundering compliance as mandated by law.",
      },
      {
        label: "Public Information",
        text: "Publicly available influencer data may be displayed to platform users.",
      },
    ],
  },
  {
    title: "Data Security",
    intro: "We implement comprehensive security measures to protect your data:",
    items: [
      {
        label: "Encryption",
        text: "Encryption safeguards for data in transit and at rest where applicable.",
      },
      {
        label: "Access Controls",
        text: "Role-based access controls and authentication protections.",
      },
      {
        label: "Regular Audits",
        text: "Periodic security assessments and vulnerability testing.",
      },
      {
        label: "Secure Infrastructure",
        text: "Use of managed infrastructure and monitored environments.",
      },
      {
        label: "Employee Training",
        text: "Internal awareness and handling practices for sensitive data.",
      },
      {
        label: "Incident Response",
        text: "Incident response procedures for suspected security events.",
      },
      {
        label: "Compliance Monitoring",
        text: "Ongoing review of security and regulatory obligations.",
      },
    ],
    paragraphs: [
      "Security incidents or breaches involving customer data will be addressed and reported in accordance with applicable legal and regulatory requirements.",
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    intro:
      "We use cookies and similar technologies to enhance your platform experience:",
    items: [
      {
        label: "Essential Cookies",
        text: "Required for core platform functionality and security.",
      },
      {
        label: "Analytics Cookies",
        text: "Help us understand user interactions and improve services.",
      },
      {
        label: "Preference Cookies",
        text: "Remember your settings and personalization choices.",
      },
      {
        label: "Marketing Cookies",
        text: "Support relevant content delivery and campaign measurement where applicable.",
      },
    ],
    paragraphs: [
      "You can control cookie settings through your browser preferences. Disabling certain cookies may affect platform functionality.",
    ],
  },
  {
    title: "Third-Party Services",
    intro: "Our platform integrates with the following third-party services:",
    items: [
      {
        label: "Razorpay",
        text: "Payment processing, transaction management, and compliance workflows.",
      },
      {
        label: "Social Media Platforms",
        text: "Platforms such as Instagram and YouTube for publicly available influencer data.",
      },
      {
        label: "Cloud Services",
        text: "Hosting and storage providers used for platform delivery.",
      },
      {
        label: "Analytics Providers",
        text: "Usage and performance analysis tools.",
      },
      {
        label: "Communication Services",
        text: "Email and messaging service providers for notifications.",
      },
    ],
    paragraphs: [
      "These third-party services have their own privacy policies. We encourage you to review their privacy practices before relying on those services.",
    ],
  },
  {
    title: "Your Rights Under DPDP Act 2023",
    intro:
      "Under the Digital Personal Data Protection Act, 2023, you may have the following rights:",
    items: [
      {
        label: "Right to Information",
        text: "Know what personal data we process and how we use it.",
      },
      {
        label: "Right to Access",
        text: "Request access to your personal information.",
      },
      {
        label: "Right to Correction",
        text: "Request correction of inaccurate or incomplete information.",
      },
      {
        label: "Right to Erasure",
        text: "Request deletion of personal information, subject to legal obligations.",
      },
      {
        label: "Right to Data Portability",
        text: "Request a copy of your data in a portable format where applicable.",
      },
      {
        label: "Right to Grievance Redressal",
        text: "Lodge complaints regarding the processing of personal data.",
      },
      {
        label: "Right to Nominate",
        text: "Nominate an individual to exercise your rights in case of death or incapacity.",
      },
      {
        label: "Right to Opt-out",
        text: "Unsubscribe from marketing communications.",
      },
    ],
    paragraphs: [
      "To exercise these rights, please contact us using the information provided below. We will respond within timelines required by applicable law.",
    ],
  },
  {
    title: "Data Retention",
    intro: "We retain your personal information only as long as necessary:",
    items: [
      {
        label: "Account Data",
        text: "While your account is active and for a limited period after deletion where legally required.",
      },
      {
        label: "Transaction Data",
        text: "As required by financial, tax, and payment regulations.",
      },
      {
        label: "KYC Documents",
        text: "As mandated by applicable AML and KYC requirements.",
      },
      {
        label: "Usage Analytics",
        text: "For a limited operational period and then in aggregated or anonymized form where feasible.",
      },
      {
        label: "Marketing Data",
        text: "Until you opt out or request deletion, subject to applicable law.",
      },
      {
        label: "Legal Compliance",
        text: "For as long as required to satisfy legal, regulatory, or dispute-resolution needs.",
      },
    ],
  },
  {
    title: "Cross-Border Data Transfers",
    paragraphs: [
      "Your personal data is primarily processed within India. If international transfers are necessary for service provision, we ensure appropriate safeguards including contractual, organizational, and legal measures required by applicable law.",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from individuals under 18. If you believe a child has provided personal data to us, please contact us so we can take appropriate action.",
    ],
  },
  {
    title: "Grievance Redressal Mechanism",
    intro:
      "We have established a grievance redressal mechanism in compliance with applicable laws:",
    items: [
      {
        label: "Acknowledgement",
        text: "We will acknowledge your complaint within a reasonable time after receipt.",
      },
      {
        label: "Resolution Timeline",
        text: "We aim to resolve valid complaints within a commercially reasonable timeframe.",
      },
      {
        label: "Escalation",
        text: "If unresolved, you may request further review through our designated contact channel.",
      },
      {
        label: "Regulatory Recourse",
        text: "You may also seek recourse through the appropriate authority where available under law.",
      },
    ],
  },
  {
    title: "Governing Law and Jurisdiction",
    paragraphs: [
      "This Privacy Policy is governed by the laws of India, including the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and applicable rules and regulations thereunder. Any disputes arising from this Privacy Policy shall be subject to the jurisdiction of competent courts in India.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. Updated versions will be posted on this page, and your continued use of the platform after any update becomes effective constitutes acceptance of the revised policy.",
    ],
  },
];

function GridBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundPosition: "center top",
          backgroundSize: "96px 96px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-80px] top-[-180px] h-[420px] w-[420px] rounded-full bg-[#16a34a]/20 blur-[120px] sm:right-[60px] sm:top-[-160px] sm:h-[520px] sm:w-[520px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[linear-gradient(180deg,rgba(5,5,5,0.75)_0%,rgba(5,5,5,0.25)_58%,rgba(5,5,5,0)_100%)]"
      />
    </>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-bricolage text-[24px] leading-[1.2] text-white sm:text-[28px]">
      {children}
    </h2>
  );
}

function BodyText({ children, className = "" }) {
  return (
    <p
      className={`text-[14px] leading-[1.85] text-[#9b9b9b] sm:text-[16px] ${className}`}
    >
      {children}
    </p>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={`${item.label}-${item.text}`} className="flex gap-3">
          <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#16a34a]" />
          <BodyText className="!leading-[1.75]">
            <span className="text-[#16a34a]">{item.label}:</span> {item.text}
          </BodyText>
        </li>
      ))}
    </ul>
  );
}

function ContentSection({ section }) {
  const hasStructuredContent = Boolean(
    section.intro || section.groups?.length || section.items?.length,
  );

  return (
    <section className="space-y-6 border-b border-white/8 pb-9 last:border-b-0 last:pb-0 sm:space-y-7 sm:pb-11">
      <SectionTitle>{section.title}</SectionTitle>

      {!hasStructuredContent
        ? section.paragraphs?.map((paragraph) => (
            <BodyText key={paragraph}>{paragraph}</BodyText>
          ))
        : null}

      {section.groups?.map((group) => (
        <div key={group.title} className="space-y-4 pt-1">
          <h3 className="font-bricolage text-[18px] leading-[1.2] text-white sm:text-[20px]">
            {group.title}
          </h3>
          {group.intro ? <BodyText>{group.intro}</BodyText> : null}
          <BulletList items={group.items} />
        </div>
      ))}

      {section.intro ? <BodyText>{section.intro}</BodyText> : null}
      {section.items ? <BulletList items={section.items} /> : null}

      {hasStructuredContent
        ? section.paragraphs?.map((paragraph) => (
            <BodyText key={paragraph}>{paragraph}</BodyText>
          ))
        : null}
    </section>
  );
}

function ContactCard() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
      <p className="text-[14px] leading-[1.2] text-[#9b9b9b]">
        Email &amp; Call us at:
      </p>

      <div className="mt-5 flex flex-col gap-4 text-[14px] text-white sm:flex-row sm:items-center sm:gap-8">
        <Link
          href="mailto:phyo.aiofficial@gmail.com"
          className="inline-flex items-center gap-3 transition-colors duration-200 hover:text-[#bde7c8]"
        >
          <Mail
            className="h-[18px] w-[18px] text-[#16a34a]"
            strokeWidth={1.8}
          />
          <span>phyo.aiofficial@gmail.com</span>
        </Link>

        <Link
          href="tel:+917249005806"
          className="inline-flex items-center gap-3 transition-colors duration-200 hover:text-[#bde7c8]"
        >
          <Phone
            className="h-[18px] w-[18px] text-[#16a34a]"
            strokeWidth={1.8}
          />
          <span>+91 7249005806</span>
        </Link>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main
      className="relative isolate overflow-hidden bg-[#050505] font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <GridBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-[120px] lg:pb-24 lg:pt-20">
          <section className="max-w-[1200px]">
<div className="inline-block">
  <p className="capitalize font-bricolage text-[56px] font-normal leading-[1.2]">
    <span className="text-[#16A34A]">Privacy </span>
    <span
      className="bg-clip-text text-transparent"
      style={{
        fontVariationSettings: "'opsz' 14, 'wdth' 100",
        backgroundImage:
          "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 55%, #16A34A 100%)",
      }}
    >
      Policy
    </span>
  </p>

            <p className="mt-4 text-[14px] leading-[1.6] text-[#9b9b9b] sm:text-[16px]">
              Last updated: {lastUpdated}
            </p>
</div>
          </section>

          <div className="mt-12 max-w-[1200px] space-y-9 sm:mt-14 sm:space-y-10">
            {contentSections.slice(0, 13).map((section) => (
              <ContentSection key={section.title} section={section} />
            ))}

            <section className="grid gap-8 border-b border-white/8 pb-9 sm:pb-11 lg:grid-cols-[minmax(0,1fr)_472px] lg:items-start lg:gap-[60px]">
              <div className="space-y-6 sm:space-y-7">
                <SectionTitle>Contact Us</SectionTitle>
                <BodyText>
                  For questions, concerns, or requests regarding this Privacy
                  Policy, you can contact us using the details below.
                </BodyText>
              </div>

              <ContactCard />
            </section>

            {contentSections.slice(13).map((section) => (
              <ContentSection key={section.title} section={section} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
