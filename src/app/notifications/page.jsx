'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} from '@/store/slices/notificationSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Bell, Trash2, CheckAll } from 'lucide-react';

export default function NotificationsPage() {
  const dispatch = useDispatch();

  const { notifications, unreadCount, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId, isRead) => {
    if (!isRead) {
      dispatch(markNotificationAsRead(notificationId));
    }
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'campaign':
        return '📊';
      case 'message':
        return '💬';
      case 'application':
        return '📝';
      case 'offer':
        return '🎯';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'campaign':
        return 'bg-blue-50 border-blue-200';
      case 'message':
        return 'bg-green-50 border-green-200';
      case 'application':
        return 'bg-purple-50 border-purple-200';
      case 'offer':
        return 'bg-yellow-50 border-yellow-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              You have <span className="font-semibold">{unreadCount}</span> unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              icon={CheckAll}
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h2>
            <p className="text-gray-600">
              You're all caught up! We'll notify you when something important happens.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`
                  p-6 border-l-4 cursor-pointer transition-all
                  ${!notification.read ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${getNotificationColor(notification.type)}
                `}
                onClick={() => handleMarkAsRead(notification.id, notification.read)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {notification.description && (
                          <p className="text-gray-700 mt-1">{notification.description}</p>
                        )}
                      </div>

                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>

                    {/* Badge */}
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 bg-white bg-opacity-60 text-xs font-medium text-gray-700 rounded">
                        {notification.type}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
