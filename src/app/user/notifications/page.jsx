'use client'
import React, { useState } from 'react';
import { ArrowLeft, Bell, MoreVertical, Check, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

function NotificationsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    'All',
    'Invitation Requests',
    'New Campaigns Announcement',
    'Applications'
  ];

  const notifications = [
    {
      id: 1,
      type: 'request',
      avatar: '/dummyAvatar.jpg',
      avatarBg: '#ff4f6d',
      label: 'Campaign Invitation',
      paragraph: 'You have been invited to join a new campaign',
      hasActions: true
    },
    {
      id: 2,
      type: 'unread',
      avatar: '/dummyAvatar1.jpg',
      avatarBg: '#02b523',
      label: 'New Message',
      paragraph: 'You have a new message from Brand Team',
      hasActions: false,
      hasNotificationDot: true
    },
    {
      id: 3,
      type: 'normal',
      avatar: '/dummyAvatar.jpg',
      avatarBg: '#0b4fd9',
      label: 'Campaign Update',
      paragraph: 'Your campaign status has been updated',
      hasActions: false,
      hasChevron: true
    },
    {
      id: 4,
      type: 'action',
      avatar: '/dummyAvatar1.jpg',
      avatarBg: '#2375f0',
      label: 'Action Required',
      hasActions: false,
      hasButton: true
    },
    {
      id: 5,
      type: 'detail',
      avatar: '/dummyAvatar.jpg',
      avatarBg: '#f4c10f',
      label: 'Payment Processed',
      paragraph: 'Your payment has been successfully processed',
      trailingLabel: 'Rs 5,000',
      trailingParagraph: 'Today',
      hasChevron: true
    }
  ];

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
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-[#242527]" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="h-6 w-6 text-[#242527]" />
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
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                  {notification.hasActions && (
                    <>
                      <button className="p-3 hover:bg-green-50 rounded-full transition-colors">
                        <Check className="h-6 w-6 text-[#08a64a]" />
                      </button>
                      <button className="p-3 hover:bg-red-50 rounded-full transition-colors">
                        <X className="h-6 w-6 text-[#bf3709]" />
                      </button>
                    </>
                  )}
                  
                  {notification.hasNotificationDot && (
                    <div className="w-2 h-2 bg-[#0b4fd9] rounded-full"></div>
                  )}
                  
                  {notification.hasButton && (
                    <button 
                      className="px-4 py-2 bg-[#dae3d1] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#c5d1bb] transition-colors"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                      Button
                    </button>
                  )}
                  
                  {notification.trailingLabel && (
                    <div className="text-right mr-2">
                      <p 
                        className="text-base font-semibold text-[#242527]"
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                      >
                        {notification.trailingLabel}
                      </p>
                      {notification.trailingParagraph && (
                        <p 
                          className="text-sm text-[#808080]"
                          style={{ fontFamily: 'Work Sans, sans-serif' }}
                        >
                          {notification.trailingParagraph}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {notification.hasChevron && (
                    <ChevronRight className="h-6 w-6 text-[#6c6d6e]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;

