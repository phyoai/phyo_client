'use client'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import api from '@/utils/api';
import messageApi from '@/api/message-api';
import secureAuthStorage from '@/utils/secure-auth';
import { SendPlane2Fill } from '@phyoofficial/phyo-icon-library';

function SingleTick({ color = '#9b9b9b' }) {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path d="M1.5 5.5L5.5 9.5L14.5 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DoubleTick({ color = '#9b9b9b' }) {
  return (
    <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
      <path d="M1 5.5L5 9.5L14 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5.5L9 9.5L18 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageTicks({ isDelivered, isRead }) {
  if (isRead) return <DoubleTick color="#3b82f6" />;
  if (isDelivered) return <DoubleTick color="#9b9b9b" />;
  return <SingleTick color="#9b9b9b" />;
}

export default function StartNewChatPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = secureAuthStorage.getUserData()?._id;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/list', {
        params: { page: 1, limit: 50 },
      });
      const usersList =
        response.data?.users ||
        response.data?.data?.users ||
        response.data?.data ||
        response.data || [];
      const list = Array.isArray(usersList) ? usersList : [];
      setUsers(list);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setMessageInput('');
    try {
      const participantId = user._id || user.id;
      if (!participantId) {
        alert('Cannot start conversation: user data incomplete');
        return;
      }
      const conv = await messageApi.createConversationWithMessage(participantId);
      setConversation(conv);
    } catch (error) {
      console.error('Error creating conversation:', error);
      const errorMsg = error?.message || error?.data?.message || 'Failed to start conversation';
      alert(`Unable to start chat: ${errorMsg}`);
    }
  };

  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || !conversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const conversationId = conversation.id || conversation._id;
      if (!conversationId) return;

      const newMessage = {
        id: `tmp-${Date.now()}`,
        content,
        senderId: currentUserId,
        isRead: false,
        isDelivered: false,
        createdAt: new Date().toISOString(),
        _optimistic: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput('');
      const sent = await messageApi.sendMessage(conversationId, content);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id
            ? { ...sent, isDelivered: sent.isDelivered ?? true }
            : m
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div
      className="flex overflow-hidden bg-[#000201] text-white"
      style={{ height: 'calc(100vh - 80px)', gap: 20, paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 0 }}
    >
      {/* Left Panel — Users List */}
      <section
        className="hidden xl:flex flex-col overflow-hidden"
        style={{
          width: 360,
          flexShrink: 0,
          background: '#181818',
          borderRadius: 24,
        }}
      >
        {/* Title */}
        <p style={{
          color: '#FFFFFF',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: 24,
          fontWeight: 400,
          lineHeight: '120%',
          padding: '20px 20px 0 20px',
          margin: 0,
          flexShrink: 0,
        }}>
          Start New Chat
        </p>

        {/* User List */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]" />
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 16px 20px', marginTop: 8 }}>
            {users.map((user, index) => {
              return (
                <div key={user._id || user.id}>
                  <div
                    onClick={() => handleSelectUser(user)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 0,
                      paddingRight: 0,
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {(user.name || user.username || '?')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 400, margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Bricolage Grotesque, sans-serif', lineHeight: '120%' }}>
                        {user.name || user.username || 'Unknown'}
                      </p>
                      <p style={{ color: '#9B9B9B', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', lineHeight: '120%' }}>
                        {user.categories?.[0] || 'Creator'}
                      </p>
                    </div>
                  </div>
                  {index < users.length - 1 && (
                    <div style={{ height: 0.5, background: '#373737' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Right Panel — Chat Interface */}
      <section
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          minWidth: 0,
          background: '#181818',
          borderRadius: 24,
        }}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{ height: 80, background: '#181818', borderBottom: '1px solid #2F2F2F', display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
                    {(selectedUser.name || selectedUser.username || '?')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 400, margin: '0 0 4px 0', fontFamily: 'Bricolage Grotesque, sans-serif', lineHeight: '120%' }}>
                    {selectedUser.name || selectedUser.username}
                  </p>
                  <p style={{ color: '#9B9B9B', fontSize: 12, margin: 0, fontFamily: 'Inter, sans-serif', lineHeight: '120%' }}>
                    {selectedUser.categories?.[0] || 'Creator'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9B9B9B', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                  Start a conversation...
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUserId;
                  const timeLabel = new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div key={msg.id || idx} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '60%' }}>
                        <div style={{
                          borderRadius: 12,
                          borderBottomRightRadius: isMe ? 4 : 12,
                          borderBottomLeftRadius: isMe ? 12 : 4,
                          padding: '12px 16px',
                          background: isMe ? '#16a34a' : '#262626',
                          opacity: msg._optimistic ? 0.7 : 1,
                        }}>
                          <p style={{ color: '#FFFFFF', fontSize: 14, margin: 0, fontFamily: 'Inter, sans-serif' }}>{msg.content}</p>
                        </div>
                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, flexDirection: isMe ? 'row-reverse' : 'row', padding: '0 4px' }}>
                          <span style={{ fontSize: 11, color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>{timeLabel}</span>
                          {isMe && (
                            <MessageTicks
                              isDelivered={msg.isDelivered ?? !msg._optimistic}
                              isRead={msg.isRead ?? false}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ height: 80, background: '#181818', borderTop: '1px solid #2F2F2F', display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', flexShrink: 0 }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#262626',
                  border: '1px solid #333',
                  borderRadius: 12,
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageInput.trim()}
                style={{
                  width: 48,
                  height: 48,
                  background: '#16a34a',
                  borderRadius: '50%',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity: sendingMessage || !messageInput.trim() ? 0.5 : 1,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <SendPlane2Fill width={20} height={20} fill="white" />
              </button>
            </div>
          </>
        ) : (
          /* Empty state — Phyo logo centered */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Image
              src="/landing/phyo_logo.svg"
              alt="Phyo"
              width={200}
              height={52}
              style={{ opacity: 0.12 }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
