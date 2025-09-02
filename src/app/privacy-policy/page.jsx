'use client'
import React from 'react'
import Link from 'next/link'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-sm">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Welcome to Phyo ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered influencer search platform and payment processing services through Razorpay.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Your Personal Data shall be processed in accordance with this Privacy Policy, the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and any applicable rules and regulations thereunder.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              By using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              2. Information We Collect
            </h2>
            
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              2.1 Personal Information
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed mb-4 space-y-2">
              <li><strong>Personal Identifiers:</strong> Name, email address, contact information, date of birth, demographic information such as age and gender</li>
              <li><strong>Account Information:</strong> Profile information for brands and influencers, communication preferences</li>
              <li><strong>Payment Information:</strong> Payment details processed securely through Razorpay including transaction data, billing information</li>
              <li><strong>Transaction Data:</strong> Items purchased, payment amounts, transaction history</li>
              <li><strong>User-Generated Content:</strong> Campaign descriptions, search queries, feedback and reviews</li>
              <li><strong>KYC Documents:</strong> As required by RBI regulations and applicable laws</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              2.2 Device & Technical Data
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We automatically collect certain technical information:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed mb-4 space-y-2">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, search queries, page view time</li>
              <li><strong>Location Data:</strong> Device location (if you grant permission)</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies and persistent cookies for functionality and analytics</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              2.3 Influencer Data
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Our platform aggregates publicly available information about influencers:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li>Social media profiles and follower counts</li>
              <li>Content categories and engagement metrics</li>
              <li>Demographic information and audience insights</li>
              <li>Collaboration rates and availability status</li>
            </ul>
          </div>

          {/* How We Use Information */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Service Provision:</strong> Provide and maintain our AI-powered influencer search services</li>
              <li><strong>Account Management:</strong> Process and manage user accounts, subscriptions, and payment transactions</li>
              <li><strong>Matching Services:</strong> Match brands with relevant influencers based on search criteria</li>
              <li><strong>Payment Processing:</strong> Facilitate secure payments through Razorpay in compliance with RBI guidelines</li>
              <li><strong>KYC Compliance:</strong> Conduct Know Your Customer checks as required by applicable laws</li>
              <li><strong>Platform Improvement:</strong> Analyze usage patterns to enhance our services</li>
              <li><strong>Communications:</strong> Send service updates, transaction confirmations, and promotional communications</li>
              <li><strong>Security & Fraud Prevention:</strong> Detect and prevent fraud, ensure platform security</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and enforce our terms of service</li>
            </ul>
          </div>

          {/* Payment Processing */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              4. Payment Processing & Security
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We partner with Razorpay Software Limited for secure payment processing:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>PCI DSS Compliance:</strong> All payment data is processed in compliance with Payment Card Industry Data Security Standards</li>
              <li><strong>Encryption:</strong> We use industry-standard AES-128-bit encryption for sensitive data</li>
              <li><strong>Secure Transmission:</strong> All services are served over HTTPS using TLS</li>
              <li><strong>Tokenization:</strong> Payment details are replaced with secure tokens to prevent data exposure</li>
              <li><strong>RBI Compliance:</strong> We adhere to Reserve Bank of India regulations for payment processing</li>
              <li><strong>Data Minimization:</strong> We only collect payment information necessary for transaction processing</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              When you make payments through our platform, your payment information is directly processed by Razorpay and subject to their privacy policy available at razorpay.com/privacy.
            </p>
          </div>

          {/* Information Sharing */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              5. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Payment Partners:</strong> With Razorpay for secure payment processing and transaction facilitation</li>
              <li><strong>Financial Institutions:</strong> With banks, RBI, or other regulatory agencies as required by law</li>
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in platform operations under strict confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law, court orders, or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, subject to confidentiality obligations</li>
              <li><strong>Explicit Consent:</strong> With your explicit consent for specific purposes</li>
              <li><strong>KYC & AML:</strong> For Know Your Customer and Anti-Money Laundering compliance as mandated by law</li>
              <li><strong>Public Information:</strong> Publicly available influencer data may be displayed to platform users</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We implement comprehensive security measures that exceed industry standards:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Encryption:</strong> End-to-end AES-128-bit encryption for data in transit and at rest</li>
              <li><strong>Access Controls:</strong> Role-based access controls and multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
              <li><strong>Secure Infrastructure:</strong> ISO 27001 certified security management systems</li>
              <li><strong>Employee Training:</strong> Regular training on data protection practices and security protocols</li>
              <li><strong>Incident Response:</strong> Comprehensive incident response procedures for data breaches</li>
              <li><strong>Compliance Monitoring:</strong> Continuous monitoring for regulatory compliance</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              Security incidents or breaches involving customer data will be promptly reported to relevant authorities and affected users as required by applicable laws.
            </p>
          </div>

          {/* Cookies and Tracking */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your platform experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand user interactions and improve services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and personalization choices</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant content and measure campaign effectiveness</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              You can control cookie settings through your browser preferences. Disabling certain cookies may affect platform functionality.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              8. Third-Party Services
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Our platform integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Razorpay:</strong> Payment processing, transaction management, and financial compliance</li>
              <li><strong>Social Media Platforms:</strong> Instagram, YouTube, etc. for publicly available influencer data</li>
              <li><strong>Cloud Services:</strong> AWS/Google Cloud for secure hosting and data storage</li>
              <li><strong>Analytics Providers:</strong> For platform usage analysis and performance monitoring</li>
              <li><strong>Communication Services:</strong> Email and SMS service providers for notifications</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              These third-party services have their own privacy policies. We encourage you to review their privacy practices, particularly Razorpay's privacy policy at razorpay.com/privacy.
            </p>
          </div>

          {/* User Rights under DPDP Act */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              9. Your Rights Under DPDP Act 2023
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Under the Digital Personal Data Protection Act, 2023, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Right to Information:</strong> Know what personal data we process and how we use it</li>
              <li><strong>Right to Access:</strong> Request access to your personal information</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Right to Data Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Right to Grievance Redressal:</strong> Lodge complaints regarding processing of personal data</li>
              <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your rights in case of death or incapacity</li>
              <li><strong>Right to Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided in Section 14. We will respond to your request within the timeframes specified by applicable law.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              10. Data Retention
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We retain your personal information only as long as necessary:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Account Data:</strong> While your account is active and for 3 years after account deletion (unless required by law)</li>
              <li><strong>Transaction Data:</strong> For 10 years as required by financial regulations and RBI guidelines</li>
              <li><strong>KYC Documents:</strong> As mandated by applicable AML/KYC regulations</li>
              <li><strong>Usage Analytics:</strong> Up to 24 months, thereafter stored in aggregated form</li>
              <li><strong>Marketing Data:</strong> Until you opt out or request deletion</li>
              <li><strong>Legal Compliance:</strong> As required by applicable laws and court orders</li>
            </ul>
          </div>

          {/* International Transfers */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              11. Cross-Border Data Transfers
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Your personal data is primarily processed within India. If international transfers are necessary for service provision, we ensure appropriate safeguards including adequacy decisions, standard contractual clauses, and binding corporate rules as required by the DPDP Act 2023 and applicable regulations.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              12. Children's Privacy
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from individuals under 18. If you are a parent or guardian and believe we have collected information from your child, please contact us immediately, and we will delete such information promptly.
            </p>
          </div>

          {/* Grievance Redressal */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              13. Grievance Redressal Mechanism
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We have established a grievance redressal mechanism in compliance with applicable laws:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li>We will acknowledge your complaint within 2 working days</li>
              <li>Resolution will be provided within 10 business days of complaint receipt</li>
              <li>If unresolved, you may escalate to our Data Protection Officer</li>
              <li>Final recourse is available through the Data Protection Board of India</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              For questions, concerns, or to exercise your rights regarding this Privacy Policy:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm sm:text-base font-medium mb-2">
                <strong>Data Protection Officer:</strong>
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Email: phyo.aiofficial@gmail.com<br/>
                
                Phone: 7249005806
              </p>
            </div>
           
          </div>

          {/* Governing Law */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              15. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              This Privacy Policy is governed by the laws of India, including the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and applicable rules thereunder. Any disputes arising from this Privacy Policy shall be subject to the exclusive jurisdiction of courts in [Your City], India.
            </p>
          </div>

          {/* Changes to Privacy Policy */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              16. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices, services, or applicable laws. Material changes will be notified through email, platform notifications, or prominent website notices. Your continued use of our platform after such changes constitutes acceptance of the updated policy. We recommend reviewing this policy regularly for updates.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-0">
                © {new Date().getFullYear()} Phyo. All rights reserved. | Compliant with DPDP Act 2023 & RBI Guidelines
              </p>
              <div className="flex space-x-4">
                <Link href="/terms" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                  Terms of Service
                </Link>
                <Link href="/support" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy