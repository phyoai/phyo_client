import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";

const lastUpdated = "4 May 2026";

const contentSections = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "These Terms & Conditions govern your access to and use of Phyo, including our website, AI-powered influencer discovery tools, campaign workflows, subscription features, and related services.",
      "By accessing or using the platform, you agree to be bound by these Terms & Conditions. If you do not agree, you must not use the platform.",
    ],
  },
  {
    title: "Eligibility and Account Registration",
    paragraphs: [
      "You must be legally capable of entering into a binding contract under applicable law to use our services.",
    ],
    items: [
      {
        label: "Accurate Information",
        text: "You agree to provide accurate, current, and complete information during registration.",
      },
      {
        label: "Account Security",
        text: "You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        label: "Account Activity",
        text: "You are responsible for all activity conducted through your account.",
      },
      {
        label: "Account Integrity",
        text: "We may suspend or terminate accounts containing false, misleading, or unauthorized information.",
      },
    ],
  },
  {
    title: "Scope of Services",
    paragraphs: [
      "Phyo provides technology tools to help brands, agencies, and other users discover influencers, review publicly available creator information, manage outreach workflows, and access related analytics or subscription-based features.",
      "We may modify, improve, restrict, or discontinue any part of the platform at any time, with or without notice, to the extent permitted by law.",
    ],
  },
  {
    title: "Acceptable Use",
    paragraphs: [
      "You agree to use the platform only for lawful business and professional purposes. You must not:",
    ],
    items: [
      {
        label: "Legal Compliance",
        text: "Use the platform in violation of any law, regulation, or third-party right.",
      },
      {
        label: "Unauthorized Extraction",
        text: "Scrape, copy, harvest, or redistribute platform data except as expressly permitted by us.",
      },
      {
        label: "Security Interference",
        text: "Attempt to reverse engineer, disrupt, overload, or compromise the platform or its security.",
      },
      {
        label: "Abusive Automation",
        text: "Use automated tools, bots, or scripts in a manner that harms the service or other users.",
      },
      {
        label: "Malicious Content",
        text: "Upload, transmit, or distribute malicious code, spam, deceptive content, or unlawful material.",
      },
      {
        label: "Misrepresentation",
        text: "Misrepresent your identity, affiliation, campaign intent, or authority.",
      },
    ],
  },
  {
    title: "Influencer and Platform Data",
    paragraphs: [
      "Certain creator and influencer information displayed on the platform may be derived from publicly available sources, third-party services, user submissions, or automated analysis.",
    ],
    items: [
      {
        label: "No Accuracy Warranty",
        text: "We do not guarantee the completeness, accuracy, or ongoing availability of third-party or public data.",
      },
      {
        label: "Independent Evaluation",
        text: "You are responsible for independently evaluating creators before entering any commercial arrangement.",
      },
      {
        label: "Restricted Use",
        text: "You must not use platform data for unlawful surveillance, discrimination, harassment, or spam.",
      },
    ],
  },
  {
    title: "Payments, Billing, and Subscriptions",
    paragraphs: [
      "Certain features of the platform may require payment. Payments may be processed through Razorpay or other authorized payment partners.",
    ],
    items: [
      {
        label: "Authorization",
        text: "You authorize us and our payment partners to charge applicable fees, taxes, and related charges.",
      },
      {
        label: "Plan Terms",
        text: "Subscription plans, credits, usage limits, and feature access may vary by the plan selected.",
      },
      {
        label: "Refund Policy",
        text: "Unless otherwise stated, fees are non-refundable once paid.",
      },
      {
        label: "Billing Details",
        text: "You are responsible for providing valid billing details and keeping payment information current.",
      },
      {
        label: "Suspension for Non-Payment",
        text: "We may suspend paid access for failed, disputed, reversed, or overdue payments.",
      },
    ],
  },
  {
    title: "Refunds and Cancellations",
    paragraphs: [
      "Refund eligibility, if any, will be governed by the specific plan, offer, or written commercial agreement applicable to your account.",
    ],
    items: [
      {
        label: "Future Renewals",
        text: "You may cancel future renewals in accordance with your subscription settings or written agreement.",
      },
      {
        label: "Current Billing Period",
        text: "Cancellation does not automatically entitle you to a refund for the current billing period.",
      },
      {
        label: "Payment Disputes",
        text: "Chargebacks or payment disputes raised without a valid basis may result in account suspension or termination.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "The platform, including its design, software, workflows, trademarks, branding, text, graphics, and proprietary features, is owned by or licensed to Phyo and protected under applicable intellectual property laws.",
    ],
    items: [
      {
        label: "Limited License",
        text: "We grant you a limited, non-exclusive, non-transferable, revocable right to use the platform for its intended purpose.",
      },
      {
        label: "Restricted Exploitation",
        text: "You may not reproduce, distribute, modify, create derivative works from, or commercially exploit platform materials without written permission.",
      },
      {
        label: "User Content Ownership",
        text: "You retain ownership of content you lawfully submit, but grant us the rights necessary to host, process, and display it for platform operations.",
      },
    ],
  },
  {
    title: "User Content and Conduct",
    paragraphs: [
      "You are solely responsible for content, campaign briefs, communications, files, and other materials you upload, submit, or transmit through the platform.",
    ],
    items: [
      {
        label: "Rights and Permissions",
        text: "You represent that you have all rights and permissions necessary to submit such content.",
      },
      {
        label: "Prohibited Content",
        text: "You must not submit content that is unlawful, defamatory, infringing, abusive, obscene, or misleading.",
      },
      {
        label: "Moderation",
        text: "We may remove content or restrict access if we reasonably believe it violates these Terms & Conditions or applicable law.",
      },
    ],
  },
  {
    title: "Third-Party Services and Links",
    paragraphs: [
      "The platform may integrate with or contain links to third-party platforms, payment gateways, APIs, analytics providers, social networks, or cloud services.",
      "We are not responsible for the content, policies, availability, or practices of third-party services. Your use of those services is subject to their own terms and policies.",
    ],
  },
  {
    title: "Disclaimers",
    paragraphs: [
      'The platform is provided on an "as is" and "as available" basis to the fullest extent permitted by law.',
    ],
    items: [
      {
        label: "Availability",
        text: "We do not warrant uninterrupted, error-free, or secure operation at all times.",
      },
      {
        label: "Commercial Outcomes",
        text: "We do not guarantee any specific commercial outcome, campaign result, lead quality, conversion rate, or influencer performance.",
      },
      {
        label: "AI Outputs",
        text: "AI-generated suggestions, rankings, or insights are informational tools and should not be treated as sole decision-making inputs.",
      },
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, Phyo and its affiliates, officers, employees, licensors, and partners shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages arising out of or related to your use of the platform.",
      "Our aggregate liability for any claim relating to the platform shall not exceed the amount paid by you to us for the applicable service during the three months preceding the event giving rise to the claim, unless a different limit is required by applicable law.",
    ],
  },
  {
    title: "Indemnity",
    paragraphs: [
      "You agree to defend, indemnify, and hold harmless Phyo and its affiliates, officers, employees, and service providers from and against claims, losses, liabilities, damages, costs, and expenses arising out of your misuse of the platform, your content, your breach of these Terms & Conditions, or your violation of any law or third-party right.",
    ],
  },
  {
    title: "Suspension and Termination",
    paragraphs: [
      "We may suspend, restrict, or terminate your access to the platform at our discretion if:",
    ],
    items: [
      {
        label: "Breach",
        text: "You breach these Terms & Conditions.",
      },
      {
        label: "Risk",
        text: "Your use creates legal, regulatory, technical, or security risk.",
      },
      {
        label: "Payment Issues",
        text: "Payments are overdue, reversed, disputed, or suspected to be fraudulent.",
      },
      {
        label: "Legal Direction",
        text: "We are required to do so by law, court order, or regulatory direction.",
      },
    ],
  },
  {
    title: "Privacy",
    paragraphs: [
      "Your use of the platform is also subject to our Privacy Policy, which explains how we collect, use, and protect personal information. In the event of a conflict between these Terms & Conditions and the Privacy Policy regarding service usage, these Terms & Conditions will prevail to the extent of that conflict.",
    ],
  },
  {
    title: "Governing Law and Jurisdiction",
    paragraphs: [
      "These Terms & Conditions are governed by the laws of India. Any dispute arising out of or in connection with these Terms & Conditions shall be subject to the exclusive jurisdiction of the competent courts in India.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may revise these Terms & Conditions from time to time to reflect changes in our platform, legal obligations, or business practices. Updated terms will be posted on this page. Your continued use of the platform after any update becomes effective constitutes your acceptance of the revised Terms & Conditions.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      "For questions about these Terms & Conditions, please contact us using the details below.",
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
  return (
    <section className="space-y-6 border-b border-white/8 pb-9 last:border-b-0 last:pb-0 sm:space-y-7 sm:pb-11">
      <SectionTitle>{section.title}</SectionTitle>

      {section.paragraphs?.map((paragraph) => (
        <BodyText key={paragraph}>{paragraph}</BodyText>
      ))}

      {section.items ? <BulletList items={section.items} /> : null}
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

export default function TermsAndConditionsPage() {
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
            <h1
              className="inline-block w-fit bg-clip-text font-bricolage text-[40px] font-normal leading-[1.2] text-transparent capitalize sm:text-[48px] lg:text-[56px]"
              style={{
                fontVariationSettings: "'opsz' 14, 'wdth' 100",
                backgroundImage:
                  "linear-gradient(102.272deg, #16A34A 3.4%, #FFFFFF 58%, #16A34A 97.64%)",
              }}
            >
              Terms &amp; Conditions
            </h1>
            <p className="mt-4 text-[14px] leading-[1.6] text-[#9b9b9b] sm:text-[16px]">
              Last updated: {lastUpdated}
            </p>
          </section>

          <div className="mt-12 max-w-[1200px] space-y-9 sm:mt-14 sm:space-y-10">
            {contentSections.slice(0, 15).map((section) => (
              <ContentSection key={section.title} section={section} />
            ))}

            <section className="grid gap-8 border-b border-white/8 pb-9 sm:pb-11 lg:grid-cols-[minmax(0,1fr)_472px] lg:items-start lg:gap-[60px]">
              <div className="space-y-6 sm:space-y-7">
                <SectionTitle>Contact Us</SectionTitle>
                <BodyText>
                  For questions about these Terms &amp; Conditions, please
                  contact us using the details below.
                </BodyText>
              </div>

              <ContactCard />
            </section>

            {contentSections.slice(15, 17).map((section) => (
              <ContentSection key={section.title} section={section} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
