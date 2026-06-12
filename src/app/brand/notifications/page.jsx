'use client'
import { useState, useEffect } from 'react';
import { CheckCheck } from 'lucide-react';
import { notificationApi } from '@/api/notification-api';

const TABS = ['All', 'Invitation Requests', 'New Campaigns Announcement'];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── Avatar ─── */
function Avatar({ name }) {
  const initials = (name || 'N').charAt(0).toUpperCase();
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
      background: '#16A34A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 500,
    }}>
      {initials}
    </div>
  );
}

/* ─── Skeleton ─── */
function SkeletonCard({ index }) {
  return (
    <div style={{
      height: 88, background: '#262626', borderRadius: 12,
      borderBottom: '0.5px solid #373737', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        animation: `shimmer 1.6s ease-in-out ${index * 0.15}s infinite`,
      }} />
      <div style={{ position: 'absolute', top: 20, left: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#323232', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 13, width: 100, background: '#323232', borderRadius: 6 }} />
          <div style={{ height: 11, width: 220, background: '#2c2c2c', borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 8, right: 14, width: 40, height: 10, background: '#2c2c2c', borderRadius: 4 }} />
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ width: 160, height: 160, flexShrink: 0 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="80" fill="#262626"/>
          <path d="M80 36C80 36 55 48 55 72V92L47 100H113L105 92V72C105 48 80 36 80 36Z" fill="#323232" stroke="#373737" strokeWidth="1"/>
          <path d="M72 100C72 104.418 75.582 108 80 108C84.418 108 88 104.418 88 100H72Z" fill="#373737"/>
          <circle cx="80" cy="34" r="5" fill="#373737"/>
          <path d="M55 72C55 56 65 44 80 40" stroke="#404040" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{
        fontFamily: 'Bricolage Grotesque, sans-serif',
        fontSize: 44, fontWeight: 400, lineHeight: '120%',
        textTransform: 'capitalize', textAlign: 'center', color: '#FFFFFF', margin: 0,
      }}>
        No Notification Yet
      </p>
    </div>
  );
}

/* ─── Unread Card (88px fixed, #262626 bg, rounded) ─── */
function UnreadCard({ n, onMarkRead, isLast }) {
  const name = n.title || 'Notification';
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onMarkRead(n.id || n._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 88, background: hovered ? '#2e2e2e' : '#262626',
        borderRadius: 12,
        borderBottom: isLast ? 'none' : '0.5px solid #373737',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Unread indicator bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#16A34A', borderRadius: '12px 0 0 12px' }} />

      {/* Avatar + text — x:10, y:20 */}
      <div style={{ position: 'absolute', top: 20, left: 10, right: 70, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={name} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: 16, fontWeight: 400, lineHeight: '120%',
            textTransform: 'capitalize', color: '#FFFFFF', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{name}</p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12, fontWeight: 400, lineHeight: '120%',
            textTransform: 'capitalize', color: '#9B9B9B', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{n.message || ''}</p>
        </div>
      </div>

      {/* Time — absolute bottom-right, y:64 from card top */}
      <div style={{
        position: 'absolute', top: 64, right: 10,
        display: 'flex', alignItems: 'flex-end', gap: 4, padding: 4,
      }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '16px', letterSpacing: '0.16px', color: '#808080' }}>
          {timeAgo(n.createdAt)}
        </span>
      </div>
    </div>
  );
}

/* ─── Read Card (flat, no bg, line separator, ~58px) ─── */
function ReadCard({ n, isLast }) {
  const name = n.title || 'Notification';
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', opacity: hovered ? 0.8 : 1, transition: 'opacity 0.15s ease', cursor: 'default' }}
    >
      {/* Avatar + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 80 }}>
        <Avatar name={name} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: 16, fontWeight: 400, lineHeight: '120%',
            textTransform: 'capitalize', color: '#FFFFFF', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{name}</p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12, fontWeight: 400, lineHeight: '120%',
            textTransform: 'capitalize', color: '#9B9B9B', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{n.message || ''}</p>
        </div>
      </div>

      {/* Time — y:34 from group top, right-aligned */}
      <div style={{
        position: 'absolute', top: 34, right: 10,
        display: 'flex', alignItems: 'flex-end', gap: 4, padding: 4,
      }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '16px', letterSpacing: '0.16px', color: '#808080' }}>
          {timeAgo(n.createdAt)}
        </span>
      </div>

      {/* Bottom separator line */}
      {!isLast && (
        <div style={{ height: 0.5, background: '#373737', marginTop: 10 }} />
      )}
    </div>
  );
}

/* ─── Page ─── */
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
      setNotifications(res.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  };

  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Full-width page with symmetric padding */}
      <div style={{ background: '#000201', minHeight: '100%', padding: '24px 24px 32px 0px' }}>
        <div style={{ background: '#181818', borderRadius: 24, padding: 20 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: 24, fontWeight: 400, lineHeight: '120%',
              textTransform: 'capitalize', color: '#FFFFFF', margin: 0,
            }}>
              Notifications
            </h2>
            <button
              onClick={markAllRead}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '120%',
                color: '#16A34A', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              <CheckCheck style={{ width: 16, height: 16 }} />
              Mark all as read
            </button>
          </div>

          {/* Filter Tabs — padding 4px 24px, radius 40px, gap 12px */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '4px 24px', borderRadius: 40, border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '120%',
                  color: '#FFFFFF',
                  background: activeTab === tab ? '#16A34A' : 'rgba(255,255,255,0.12)',
                  whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.15s ease',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} index={i} />)}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Unread section — card style, stacked, bottom border separators */}
              {unread.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {unread.map((n, idx) => (
                    <UnreadCard
                      key={n.id || n._id || idx}
                      n={n}
                      onMarkRead={markRead}
                      isLast={idx === unread.length - 1}
                    />
                  ))}
                </div>
              )}

              {/* Read section — flat style, 20px gap between items */}
              {read.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: unread.length > 0 ? 20 : 0 }}>
                  {read.map((n, idx) => (
                    <ReadCard
                      key={n.id || n._id || idx}
                      n={n}
                      isLast={idx === read.length - 1}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}
