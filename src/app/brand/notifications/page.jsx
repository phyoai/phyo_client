'use client'
import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { notificationApi } from '@/api/notification-api';

const TABS = ['All', 'Invitation Requests', 'New Campaigns Announcement'];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, [activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const filter = activeTab === 'All' ? {} : { type: activeTab };
      const res = await notificationApi.getNotifications({ ...filter, page: 1, limit: 50 });
      setNotifications(res.notifications || res.data || []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-[#000201] min-h-full px-10 py-6">
      <div className="max-w-[920px]">
        <div className="bg-[#181818] rounded-[24px] px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-normal text-white leading-[120%]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              Notifications
            </h2>
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm text-[#16A34A] hover:text-green-400 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-white/[0.08] text-[#9B9B9B] hover:bg-white/[0.14]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex flex-col gap-2">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-[88px] bg-[#262626] rounded-xl animate-pulse" />
              ))
            ) : notifications.length > 0 ? notifications.map(n => {
              const id = n._id || n.id;
              const name = n.senderName || n.title || 'Notification';
              const initials = name.charAt(0).toUpperCase();
              return (
                <div
                  key={id}
                  onClick={() => !n.isRead && markRead(id)}
                  className={`min-h-[88px] bg-[#262626] rounded-xl flex items-center px-4 gap-4 cursor-pointer hover:bg-[#2e2e2e] transition-colors ${
                    !n.isRead ? 'border-l-2 border-[#16A34A]' : ''
                  }`}
                >
                  <div className="w-12 h-12 shrink-0 bg-[#16A34A] rounded-full flex items-center justify-center text-white font-medium text-base">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-base truncate">{n.title || name}</p>
                    <p className="text-[#9B9B9B] text-xs line-clamp-2 mt-0.5">{n.message || n.body || ''}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[#808080] text-xs">{timeAgo(n.createdAt)}</span>
                    {n.isRead && <CheckCheck className="w-4 h-4 text-[#16A34A]" />}
                  </div>
                </div>
              );
            }) : (
              <div className="py-16 text-center">
                <Bell className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white text-base font-medium mb-1">No notifications</p>
                <p className="text-[#9B9B9B] text-sm">You are all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
