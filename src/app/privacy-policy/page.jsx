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
     
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Welcome to Phyo ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered influencer search platform.
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
              We may collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed mb-4 space-y-2">
              <li>Name, email address, and contact information when you create an account</li>
              <li>Profile information for brands and influencers</li>
              <li>Payment information for premium services</li>
              <li>Communication preferences and marketing preferences</li>
              <li>User-generated content, such as campaign descriptions and search queries</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed mb-4 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, search queries)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location data (if you grant permission)</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
              2.3 Influencer Data
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Our platform aggregates and displays publicly available information about influencers, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li>Social media profiles and follower counts</li>
              <li>Content categories and engagement metrics</li>
              <li>Demographic information and audience insights</li>
              <li>Collaboration rates and availability</li>
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
              <li>Provide and maintain our AI-powered influencer search services</li>
              <li>Process and manage user accounts and subscriptions</li>
              <li>Match brands with relevant influencers based on search criteria</li>
              <li>Analyze platform usage to improve our services</li>
              <li>Send important updates, notifications, and marketing communications</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              <li><strong>Public Information:</strong> Influencer data that is publicly available may be displayed to all users</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage and backup procedures</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </div>

          {/* Cookies and Tracking */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements and content</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              You can control cookie settings through your browser preferences, though disabling certain cookies may affect platform functionality.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Our platform may integrate with third-party services, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li>Social media platforms (Instagram, YouTube, etc.) for influencer data</li>
              <li>Payment processors for subscription and transaction processing</li>
              <li>Analytics services to understand platform usage</li>
              <li>Cloud hosting and storage services</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              These third-party services have their own privacy policies, and we encourage you to review them.
            </p>
          </div>

          {/* User Rights */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              8. Your Rights and Choices
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Account Deletion:</strong> Delete your account and associated data</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              9. Data Retention
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. Specific retention periods include:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion</li>
              <li><strong>Usage Data:</strong> Retained for analytics and service improvement purposes</li>
              <li><strong>Payment Information:</strong> Retained as required by financial regulations</li>
              <li><strong>Marketing Data:</strong> Retained until you opt out or request deletion</li>
            </ul>
          </div>

          {/* International Transfers */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including standard contractual clauses and adequacy decisions where applicable.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              11. Children's Privacy
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </div>

          {/* Changes to Privacy Policy */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last updated" date. Your continued use of our platform after such changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              13. Contact Us
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
     
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-0">
                © {new Date().getFullYear()} Phyo. All rights reserved.
              </p>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy 