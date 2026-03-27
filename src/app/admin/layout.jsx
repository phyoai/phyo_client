'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, Users, CheckCircle, Shield } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';

export default function AdminLayout({ children }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Admin Navigation */}
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
              </div>
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                ← Back to Platform
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </div>
              </Link>

              <Link
                href="/admin/brand-requests"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Brand Requests
              </Link>

              <Link
                href="/admin/influencer-requests"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Influencer Requests
              </Link>

              <Link
                href="/admin/approvals"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approvals
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="py-8">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
