'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, X, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/api/admin-api';

const ApprovalSkeleton = () => (
  <div className="p-6 border-b border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-40"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export default function InfluencerRequestsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');
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

        const response = await adminApi.getApprovals({
          type: 'influencer',
          status: statusFilter,
          page,
          limit: 20
        });

        setApprovals(response.approvals || []);
        setPagination(response.pagination || {});
      } catch (err) {
        setError(err?.message || 'Failed to load influencer requests');
        console.error('Error fetching influencer requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [statusFilter, page]);

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      await adminApi.approveInfluencer(requestId);
      setApprovals(approvals.filter(a => a.id !== requestId));
    } catch (err) {
      setError(err?.message || 'Failed to approve influencer');
      console.error('Error approving influencer:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(true);
      await adminApi.rejectInfluencer(requestId, reason);
      setApprovals(approvals.filter(a => a.id !== requestId));
    } catch (err) {
      setError(err?.message || 'Failed to reject influencer');
      console.error('Error rejecting influencer:', err);
    } finally {
      setActionLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Influencer Requests</h1>
          <p className="text-gray-600">Review and manage pending influencer approval requests</p>
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

        <div className="mb-6 flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">$
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {statusFilter === 'pending' ? 'Pending' : statusFilter === 'approved' ? 'Approved' : statusFilter === 'rejected' ? 'Rejected' : 'All'} Requests
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Showing {approvals.length} of {pagination.total || 0} requests
            </p>
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
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {statusFilter === 'pending' ? 'No pending requests' : `No ${statusFilter} requests`}
                  </p>
                </div>
              ) : (
                approvals.map((approval) => {
                  const data = approval.requestData;

                  return (
                    <div
                      key={approval.id}
                      className="p-6 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{data?.influencerName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                              {approval.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{data?.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Niche</p>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{data?.niche || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Followers</p>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{(data?.followers || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Engagement Rate</p>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{((data?.engagementRate || 0) * 100).toFixed(2)}%</p>
                            </div>
                          </div>

                          {approval.status === 'rejected' && approval.requestData?.rejectionReason && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700">
                              <strong>Rejection Reason:</strong> {approval.requestData.rejectionReason}
                            </div>
                          )}

                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                            Submitted: {new Date(data?.submittedAt).toLocaleDateString()}
                          </div>
                        </div>

                        {approval.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleApprove(approval.id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(approval.id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-sm rounded-lg hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}

                        {approval.status === 'approved' && (
                          <div className="ml-4">
                            <span className="inline-flex items-center gap-2 text-green-700 dark:text-green-200 font-medium">
                              <Check className="w-5 h-5" />
                              Approved
                            </span>
                          </div>
                        )}

                        {approval.status === 'rejected' && (
                          <div className="ml-4">
                            <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-200 font-medium">
                              <X className="w-5 h-5" />
                              Rejected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

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
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === p
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
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
