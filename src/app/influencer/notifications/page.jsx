'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, MoreVertical, Check, X, ChevronRight, AlertCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { notificationApi } from '@/api/notification-api';

// Notification Skeleton Loader
const NotificationSkeleton = () => (
  <div className="bg-white border-b border-gray-100 animate-pulse">
    <div className="flex items-center py-3 px-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full shrink-0 mr-4" />
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  </div>
);

function NotificationsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const notificationTypes = ['All', 'campaign', 'application', 'message', 'system', 'payment'];
  const filters = ['All', 'Campaign', 'Application', 'Message', 'System', 'Payment'];

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const filter = activeFilter === 'All' ? {} : { type: activeFilter.toLowerCase() };
        const response = await notificationApi.getNotifications({
          ...filter,
          page,
          limit: 20
        });
        setNotifications(response.notifications || []);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err?.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [activeFilter, page]);

  // Color mapping for notification types
  const getTypeColor = (type) => {
    const colors = {
      'campaign': '#ff4f6d',
      'application': '#02b523',
      'message': '#0b4fd9',
      'system': '#2375f0',
      'payment': '#f4c10f'
    };
    return colors[type] || '#9ba194';
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <div className="bg-white px-1 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left - Back Button */}
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#242527]" />
          </button>

          {/* Center - Title */}
          <div className="flex-1 px-2">
            <h1
              className="text-xl font-semibold text-[#242527]"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.14px' }}
            >
              Notifications
            </h1>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              title="Mark all as read"
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Check className="h-6 w-6 text-[#242527]" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="h-6 w-6 text-[#242527]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-9 pt-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-[#9ba194] text-white'
                  : 'bg-[#fbfcfa] text-[#242527] border border-[#f4f6f1] hover:bg-gray-100'
              }`}
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm">When you get notifications, they'll show up here</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 && (
          <>
            <div className="space-y-0">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center py-3 px-4">
                    {/* Avatar */}
                    <div className="shrink-0 mr-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: getTypeColor(notification.type) }}
                      >
                        {notification.isRead ? (
                          <span className="text-xl text-white">✓</span>
                        ) : (
                          <span className="text-xl text-white">•</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-4 min-w-0">
                      <p
                        className={`text-base font-semibold truncate ${
                          notification.isRead ? 'text-[#808080]' : 'text-[#242527]'
                        }`}
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                      >
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p
                          className="text-sm text-[#808080] truncate"
                          style={{ fontFamily: 'Work Sans, sans-serif' }}
                        >
                          {notification.message}
                        </p>
                      )}
                    </div>

                    {/* Trailing Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-5 w-5 text-[#0b4fd9]" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5 text-[#bf3709]" />
                      </button>
                      <p className="text-xs text-gray-500 min-w-max">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6 pb-4">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
