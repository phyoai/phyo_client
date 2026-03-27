'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Link2, Trash2, RefreshCw, Settings, ArrowLeft, Facebook } from 'lucide-react';
import { metaApi } from '@/api/meta-api';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const AccountSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
  </div>
);

export default function FacebookConnect() {
  const { isMobile } = useMobileOptimization();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const [accountsResponse, dashboardResponse] = await Promise.all([
          metaApi.getConnectedAccounts(),
          metaApi.getMetaDashboard()
        ]);

        setAccounts(accountsResponse || []);
        setDashboard(dashboardResponse || {});
      } catch (err) {
        setError(err?.message || 'Failed to load Facebook accounts');
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleConnectFacebook = () => {
    // In a real app, this would redirect to Facebook OAuth flow
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'YOUR_APP_ID';
    const redirectUri = `${window.location.origin}/integrations/facebook/callback`;

    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_read_engagement,pages_read_user_content,pages_manage_metadata,ads_read`;

    window.location.href = facebookAuthUrl;
  };

  const handleDisconnect = async (accountId) => {
    if (!confirm('Are you sure you want to disconnect this Facebook account?')) return;

    try {
      setActionLoading(accountId);
      await metaApi.disconnectFacebook(accountId);
      setAccounts(accounts.filter(a => a.id !== accountId));
    } catch (err) {
      setError(err?.message || 'Failed to disconnect account');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSync = async (campaignId, accountId) => {
    try {
      setActionLoading(`sync_${campaignId}`);
      await metaApi.syncFacebookMetrics(campaignId, accountId);
      // Refresh accounts to show updated sync time
      const updated = await metaApi.getConnectedAccounts();
      setAccounts(updated || []);
    } catch (err) {
      setError(err?.message || 'Failed to sync metrics');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <a href="/integrations" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Integrations</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <Facebook className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Facebook Connection</h1>
          </div>
          <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">Connect and manage your Facebook business accounts for campaign analytics</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Overview */}
        {dashboard && (
          <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Connected Accounts</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{dashboard.connectedAccounts || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total Impressions</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
                {dashboard.totalImpressions >= 1000000
                  ? (dashboard.totalImpressions / 1000000).toFixed(1) + 'M'
                  : dashboard.totalImpressions >= 1000
                  ? (dashboard.totalImpressions / 1000).toFixed(1) + 'K'
                  : dashboard.totalImpressions}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spend</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${(dashboard.totalSpend || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboard.totalPurchases || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average ROAS</p>
              <p className={`text-2xl font-bold ${(dashboard.averageROAS || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {(dashboard.averageROAS || 0).toFixed(2)}x
              </p>
            </div>
          </div>
        )}

        {/* Connect Account Button */}
        {!loading && accounts.length === 0 && (
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
            <Link2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Facebook Accounts Connected</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Connect your Facebook business account to automatically sync campaign metrics and performance data.
            </p>
            <button
              onClick={handleConnectFacebook}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 font-medium transition-colors"
            >
              Connect Facebook Account
            </button>
          </div>
        )}

        {/* Connected Accounts */}
        {accounts.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Connected Accounts</h2>
              <button
                onClick={handleConnectFacebook}
                className="h-11 px-4 min-h-[44px] bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <Link2 className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Connect Another Account</span>
                <span className="sm:hidden">Connect</span>
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  <AccountSkeleton />
                  <AccountSkeleton />
                </>
              ) : (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{account.accountName}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{account.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Connected: {new Date(account.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.isConnected && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pages */}
                    {account.pages && account.pages.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connected Pages:</p>
                        <div className="flex flex-wrap gap-2">
                          {account.pages.map((page) => (
                            <div key={page.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              {page.name} ({page.followers.toLocaleString()})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                      <button
                        onClick={() => handleSync('all', account.id)}
                        disabled={actionLoading === `sync_${account.id}`}
                        className="flex-1 h-11 px-3 min-h-[44px] bg-green-600 dark:bg-green-700 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors font-medium"
                      >
                        <RefreshCw className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Sync Metrics</span>
                        <span className="sm:hidden">Sync</span>
                      </button>
                      <button
                        className="flex-1 h-11 px-3 min-h-[44px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors font-medium"
                      >
                        <Settings className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Settings</span>
                      </button>
                      <button
                        onClick={() => handleDisconnect(account.id)}
                        disabled={actionLoading === account.id}
                        className="flex-1 h-11 px-3 min-h-[44px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors font-medium"
                      >
                        <Trash2 className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Disconnect</span>
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">What data is synced?</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <li>✓ Campaign impressions and clicks</li>
            <li>✓ Spend and cost metrics</li>
            <li>✓ Conversions and conversion value</li>
            <li>✓ Daily performance insights</li>
            <li>✓ Return on Ad Spend (ROAS)</li>
            <li>✓ Engagement and reach data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
