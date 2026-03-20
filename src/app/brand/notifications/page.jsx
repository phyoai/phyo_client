'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftLine, BellLine, MoreLine, CheckLine, CloseLine, ArrowRightLine } from '@phyoofficial/phyo-icon-library';
import { useRouter } from 'next/navigation';
import { useGoBack } from '@/hooks/useGoBack';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/store/slices/notificationSlice';

function NotificationsPage() {
  const router = useRouter();
  const goBack = useGoBack();
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('All');

  // Redux selectors
  const { notifications = [], loading, unreadCount = 0 } = useSelector(state => state.notification || {});

  const filters = [
    'All',
    'Invitation Requests',
    'New Campaigns Announcement',
    'Applications'
  ];

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  // Filter notifications based on active filter
  const filteredNotifications = activeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.type === activeFilter || n.title?.includes(activeFilter));

  return (
    <div className='min-h-screen bg-neutral-base'>
      {/* Header */}
      <div className="bg-neutral-base px-1 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left - Back Button */}
          <button 
            onClick={() => router.back()}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftLine className="h-6 w-6 text-[#242527]" />
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
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <BellLine className="h-6 w-6 text-[#242527]" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <MoreLine className="h-6 w-6 text-[#242527]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-9 pt-4">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
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

        {/* Notifications List */}
        <div className="space-y-0">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No notifications</div>
          ) : (
            filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className="bg-neutral-base border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center py-3">
                {/* Avatar */}
                <div className="px-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: notification.avatarBg }}
                  >
                    <img 
                      src={notification.avatar} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pr-4 min-w-0">
                  <p 
                    className="text-base font-semibold text-[#242527] truncate"
                    style={{ fontFamily: 'Work Sans, sans-serif' }}
                  >
                    {notification.label}
                  </p>
                  {notification.paragraph && (
                    <p 
                      className="text-sm text-[#808080] truncate"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                      {notification.paragraph}
                    </p>
                  )}
                </div>

                {/* Trailing Actions */}
                <div className="flex items-center gap-2 px-4">
                  {!notification.isRead && (
                    <>
                      <button
                        onClick={() => dispatch(markAsRead(notification._id))}
                        className="p-3 hover:bg-green-50 rounded-full transition-colors"
                        title="Mark as read"
                      >
                        <CheckLine className="h-6 w-6 text-[#08a64a]" />
                      </button>
                      <button
                        onClick={() => dispatch(deleteNotification(notification._id))}
                        className="p-3 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <CloseLine className="h-6 w-6 text-[#bf3709]" />
                      </button>
                    </>
                  )}

                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-[#0b4fd9] rounded-full"></div>
                  )}
                  
                  {notification.createdAt && (
                    <div className="text-right mr-2">
                      <p
                        className="text-base font-semibold text-[#242527]"
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                      >
                        {notification.priority || 'Normal'}
                      </p>
                      {notification.createdAt && (
                        <p
                          className="text-sm text-[#808080]"
                          style={{ fontFamily: 'Work Sans, sans-serif' }}
                        >
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  <ArrowRightLine className="h-6 w-6 text-[#6c6d6e]" />
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
