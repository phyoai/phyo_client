'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Lock, Unlock, Search } from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/api/admin-api';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const UserSkeleton = () => (
  <div className="p-6 border-b border-gray-100 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-40"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
  </div>
);

export default function UsersManagementPage() {
  const { isMobile } = useMobileOptimization();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
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

        const response = await adminApi.getUsers({
          page,
          limit: 20
        });

        let filtered = response.users || [];
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(u => {
            const name = (u.name || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            return name.includes(query) || email.includes(query);
          });
        }

        setUsers(filtered);
        setPagination(response.pagination || {});
      } catch (err) {
        setError(err?.message || 'Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const handleBlockUser = async (userId, userName) => {
    const reason = prompt(`Enter reason for blocking ${userName}:`);
    if (!reason) return;

    try {
      setActionLoading(true);
      await adminApi.blockUser(userId, reason);
      // Refresh the list
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err?.message || 'Failed to block user');
      console.error('Error blocking user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      setActionLoading(true);
      await adminApi.unblockUser(userId);
      // Refresh the list by fetching again
      const response = await adminApi.getUsers({ page, limit: 20 });
      setUsers(response.users || []);
    } catch (err) {
      setError(err?.message || 'Failed to unblock user');
      console.error('Error unblocking user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Users Management</h1>
          <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">Manage system users and block suspicious accounts</p>
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

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Users ({users.length} of {pagination.total || 0})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div className="space-y-0">
              {loading ? (
                <>
                  <UserSkeleton />
                  <UserSkeleton />
                  <UserSkeleton />
                </>
              ) : users.length === 0 ? (
                <div className="p-12 text-center dark:text-center">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No users found</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:border-b-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-lg truncate">{user.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                          {!user.isActive && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 flex-shrink-0">
                              BLOCKED
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 text-xs sm:text-sm">
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Email</p>
                            <p className="text-gray-900 dark:text-white font-medium truncate">{user.email}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user.phone || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Created</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Last Login</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full sm:w-auto sm:flex-shrink-0">
                        {user.isActive ? (
                          <button
                            onClick={() => handleBlockUser(user.id, user.name)}
                            disabled={actionLoading}
                            className="w-full sm:w-auto h-11 px-4 min-h-[44px] bg-red-600 dark:bg-red-700 text-white text-sm rounded-lg hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors font-medium"
                          >
                            <Lock className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Block</span>
                            <span className="sm:hidden">Block User</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(user.id)}
                            disabled={actionLoading}
                            className="w-full sm:w-auto h-11 px-4 min-h-[44px] bg-green-600 dark:bg-green-700 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors font-medium"
                          >
                            <Unlock className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">Unblock</span>
                            <span className="sm:hidden">Unblock</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
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
