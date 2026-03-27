'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Facebook, Activity } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';

export default function IntegrationsLayout({ children }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Integrations Navigation */}
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
              </div>
              <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                ← Back to Platform
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <Link
                href="/integrations"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Overview
              </Link>

              <Link
                href="/integrations/facebook"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </div>
              </Link>

              <Link
                href="/integrations/campaign-insights"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Campaign Insights
              </Link>

              <Link
                href="/integrations/analytics-metrics"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Analytics
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
