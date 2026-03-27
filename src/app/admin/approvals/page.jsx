'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/api/admin-api';

const ApprovalSkeleton = () => (
  <div className="p-6 border-b border-gray-100 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded mb-2 w-40"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export default function ApprovalsHistoryPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = { page, limit: 20 };
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;

        const response = await adminApi.getApprovals(params);

        let filtered = response.approvals || [];
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(a => {
            const data = a.requestData;
            const name = (data?.brandName || data?.influencerName || '').toLowerCase();
            const email = (data?.email || '').toLowerCase();
            return name.includes(query) || email.includes(query);
          });
        }

        setApprovals(filtered);
        setPagination(response.pagination || {});
      } catch (err) {
        setError(err?.message || 'Failed to load approvals history');
        console.error('Error fetching approvals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [typeFilter, statusFilter, page]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'brand' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Approvals History</h1>
          <p className="text-gray-600">View complete history of all brand and influencer approvals</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="brand">Brands</option>
              <option value="influencer">Influencers</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Approvals List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">$
            <h2 className="text-xl font-bold text-gray-900">
              Approvals ({approvals.length} of {pagination.total || 0})
            </h2>
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
                <div className="p-12 text-center dark:text-center">
                  <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No approvals found matching your filters</p>
                </div>
              ) : (
                approvals.map((approval) => {
                  const data = approval.requestData;
                  const isBrand = approval.requestType === 'brand';

                  return (
                    <div
                      key={approval.id}
                      className="p-6 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {isBrand ? data?.brandName : data?.influencerName}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(approval.requestType)}`}>
                              {isBrand ? 'Brand' : 'Influencer'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                              {approval.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                              <p className="text-gray-900 font-medium">{data?.email}</p>
                            </div>
                            {isBrand ? (
                              <>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Website</p>
                                  <p className="text-gray-900 font-medium">
                                    {data?.website ? (
                                      <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                        Link
                                      </a>
                                    ) : 'N/A'}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Niche</p>
                                  <p className="text-gray-900 font-medium">{data?.niche || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Followers</p>
                                  <p className="text-gray-900 font-medium">{(data?.followers || 0).toLocaleString()}</p>
                                </div>
                              </>
                            )}
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Submitted</p>
                              <p className="text-gray-900 font-medium">{new Date(data?.submittedAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {approval.status === 'approved' && data?.reviewedAt && (
                            <div className="text-xs text-green-700">
                              Approved on {new Date(data.reviewedAt).toLocaleDateString()}
                            </div>
                          )}

                          {approval.status === 'rejected' && data?.rejectionReason && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 mt-3">
                              <strong>Rejection Reason:</strong> {data.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!pagination.hasPreviousPage}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && (
                <span className="text-gray-600 px-2">...</span>
              )}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
