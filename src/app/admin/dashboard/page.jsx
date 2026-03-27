'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Users, CheckCircle, Clock, BarChart3, Shield, FileText, Activity } from 'lucide-react';
import { adminApi } from '@/api/admin-api';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const StatSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const ApprovalSkeleton = () => (
  <div className="p-6 border-b border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-40"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { isMobile } = useMobileOptimization();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBrands: 0,
    totalInfluencers: 0,
    totalServiceProviders: 0,
    blockedUsers: 0,
    pendingApprovals: 0,
    activeProjects: 0,
    totalRevenue: 0,
  });
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsResponse, approvalsResponse] = await Promise.all([
          adminApi.getSystemStats(),
          adminApi.getApprovals({ status: 'pending', limit: 5 })
        ]);

        setStats(statsResponse);
        setApprovals(approvalsResponse.approvals || []);
      } catch (err) {
        setError(err?.message || 'Failed to load admin dashboard');
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleApprove = async (requestId, type) => {
    try {
      setActionLoading(true);
      if (type === 'brand') {
        await adminApi.approveBrand(requestId);
      } else {
        await adminApi.approveInfluencer(requestId);
      }
      setApprovals(approvals.filter(a => a.id !== requestId));
    } catch (err) {
      setError(err?.message || 'Failed to approve request');
      console.error('Error approving request:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId, type) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(true);
      if (type === 'brand') {
        await adminApi.rejectBrand(requestId, reason);
      } else {
        await adminApi.rejectInfluencer(requestId, reason);
      }
      setApprovals(approvals.filter(a => a.id !== requestId));
    } catch (err) {
      setError(err?.message || 'Failed to reject request');
      console.error('Error rejecting request:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: <Users className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Brands',
      value: stats.totalBrands.toString(),
      icon: <FileText className="w-6 h-6 text-purple-600" />
    },
    {
      title: 'Influencers',
      value: stats.totalInfluencers.toString(),
      icon: <Activity className="w-6 h-6 text-pink-600" />
    },
    {
      title: 'Service Providers',
      value: stats.totalServiceProviders.toString(),
      icon: <Shield className="w-6 h-6 text-green-600" />
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      icon: <Clock className="w-6 h-6 text-yellow-600" />
    },
    {
      title: 'Blocked Users',
      value: stats.blockedUsers.toString(),
      icon: <AlertCircle className="w-6 h-6 text-red-600" />
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <CheckCircle className="w-6 h-6 text-indigo-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome to the system administration panel</p>
        </div>

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

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">System Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              statCards.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">{stat.title}</p>
                      <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      {React.cloneElement(stat.icon, { className: 'w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Pending Approvals</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">Review and manage pending brand and influencer requests</p>
          </div>

          <div className="overflow-x-auto">
            <div className="space-y-0">
              {loading ? (
                <>
                  <ApprovalSkeleton />
                  <ApprovalSkeleton />
                  <ApprovalSkeleton />
                </>
              ) : approvals.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-12 h-12 text-green-300 dark:text-green-600 mx-auto mb-2" />
                  <p>No pending approvals. All requests have been reviewed!</p>
                </div>
              ) : (
                approvals.map((approval) => {
                  const isBrand = approval.requestType === 'brand';
                  const data = approval.requestData;

                  return (
                    <div
                      key={approval.id}
                      className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:border-b-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                              {data?.brandName || data?.influencerName || 'Unknown'}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                              isBrand
                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200'
                                : 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-200'
                            }`}>
                              {isBrand ? 'Brand' : 'Influencer'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 truncate">{data?.email}</p>
                          {!isBrand && data?.niche && (
                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                              Niche: {data.niche} • Followers: {(data.followers || 0).toLocaleString()}
                            </p>
                          )}
                          {data?.website && (
                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">Website: {data.website}</p>
                          )}
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                          <button
                            onClick={() => handleApprove(approval.id, approval.requestType)}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none h-11 px-4 min-h-[44px] min-w-[44px] bg-green-600 dark:bg-green-700 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 transition-colors font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(approval.id, approval.requestType)}
                            disabled={actionLoading}
                            className="flex-1 sm:flex-none h-11 px-4 min-h-[44px] min-w-[44px] bg-red-600 dark:bg-red-700 text-white text-sm rounded-lg hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 transition-colors font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {approvals.length > 0 && (
          <div className="mt-4 text-center">
            <a href="/admin/approvals" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View all approvals →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
