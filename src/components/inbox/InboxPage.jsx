'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import { SendPlane2Fill, MicLine, Link, EmotionLine, Camera4Fill, MultiImageFill, FileTextFill, HeadphoneFill, Message3Line, UserAddLine } from '@phyoofficial/phyo-icon-library';
import messageApi from '@/api/message-api';
import secureAuthStorage from '@/utils/secure-auth';
import Button from '@/components/ui/Button';

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

const InboxPage = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUserId = secureAuthStorage.getUserData()?._id;

  const formatTime = (value) => {
    if (!value) return '';
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderId = (message) => {
    if (!message?.senderId) return null;
    if (typeof message.senderId === 'object') return message.senderId._id;
    return message.senderId;
  };

  const getOtherParticipant = (conversation) => {
    if (!Array.isArray(conversation.participants)) return null;
    const other = conversation.participants.find((p) => (p._id || p.id) !== currentUserId);
    return other || conversation.participants[0] || null;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const conversationPreview = useMemo(() => {
    return conversations.map((c) => {
      const other = getOtherParticipant(c);
      const lastMsg = c.lastMessage;
      return {
        raw: c,
        id: c.id || c._id,
        name: other?.name || 'Unknown',
        avatar: other?.profilePicture || other?.image || null,
        message: typeof lastMsg === 'string' ? lastMsg : lastMsg?.content || '',
        time: formatTime(c.lastMessageAt || c.lastMessageTime || c.updatedAt || c.createdAt),
        unreadCount: c.unreadCount ?? 0,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, currentUserId]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    setError('');
    try {
      const result = await messageApi.getConversations({ page: 1, limit: 50 });
      setConversations(result.conversations || []);
    } catch (e) {
      setError(e?.message || 'Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    setError('');
    try {
      const result = await messageApi.getMessages(conversationId, { page: 1, limit: 100 });
      setMessages(result.messages || []);
    } catch (e) {
      setError(e?.message || 'Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation || messages.length === 0) return;
    const unreadFromOther = messages.filter((m) => !m.isRead && getSenderId(m) !== currentUserId);
    unreadFromOther.forEach((m) => {
      const id = m.id || m._id;
      if (id) messageApi.markMessageAsRead(id).catch(() => {});
    });
    if (unreadFromOther.length > 0) {
      setMessages((prev) =>
        prev.map((m) =>
          !m.isRead && getSenderId(m) !== currentUserId ? { ...m, isRead: true } : m
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content || !selectedConversation || sendingMessage) return;

    (async () => {
      setSendingMessage(true);
      setError('');
      const optimistic = {
        id: `tmp-${Date.now()}`,
        content,
        senderId: currentUserId,
        isDelivered: false,
        isRead: false,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        _optimistic: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      setMessageInput('');
      try {
        const sent = await messageApi.sendMessage(selectedConversation.id, content);
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? { ...sent, isDelivered: sent.isDelivered ?? true } : m))
        );
        loadConversations();
      } catch (e) {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setError(e?.message || 'Failed to send message');
      } finally {
        setSendingMessage(false);
      }
    })();
  };

  const handleAttachmentClick = () => {
    if (!selectedConversation) {
      setShowAttachments(false);
      return;
    }
    fileInputRef.current?.click?.();
    setShowAttachments(false);
  };

  const onAttachmentSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !selectedConversation) return;
    setSendingMessage(true);
    try {
      const sent = await messageApi.sendMessageWithFile(selectedConversation.id, messageInput.trim(), file);
      setMessages((prev) => [...prev, sent]);
      setMessageInput('');
    } catch (e) {
      setError(e?.message || 'Failed to send attachment');
    } finally {
      setSendingMessage(false);
    }
  };

  const attachmentOptions = [
    { id: 'camera', label: 'Camera', icon: Camera4Fill },
    { id: 'gallery', label: 'Gallery', icon: MultiImageFill },
    { id: 'documents', label: 'Document', icon: FileTextFill },
    { id: 'audio', label: 'Audio', icon: HeadphoneFill },
  ];

  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastDate = null;
    messages.forEach((msg) => {
      const dt = new Date(msg.timestamp || msg.createdAt);
      const dateLabel = Number.isNaN(dt.getTime())
        ? null
        : dt.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
      if (dateLabel && dateLabel !== lastDate) {
        groups.push({ type: 'dateSep', label: dateLabel });
        lastDate = dateLabel;
      }
      groups.push({ type: 'message', data: msg });
    });
    return groups;
  }, [messages]);

  return (
    <div className="flex overflow-hidden bg-[#000201] text-white" style={{ height: 'calc(100vh - 80px)' }}>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden h-full">
        <div className="flex h-full min-h-0 flex-1 gap-6 overflow-hidden" style={{ paddingTop: '16px', paddingRight: '24px', paddingBottom: '24px', paddingLeft: 0 }}>
          <section className="hidden xl:flex h-full w-[360px] min-w-[360px] flex-col overflow-hidden rounded-[24px] bg-[#181818]">
            <div className="flex items-center justify-center gap-5 px-5 pt-5">
              <Button
                variant="chip"
                active={activeTab === 'messages'}
                className="w-[150px] flex items-center justify-center gap-2"
                onClick={() => setActiveTab('messages')}
              >
                <Message3Line width={18} height={18} />
                Messages
              </Button>
              <Button
                variant="chip"
                active={activeTab === 'invitations'}
                className="w-[150px] flex items-center justify-center gap-2"
                onClick={() => setActiveTab('invitations')}
              >
                <UserAddLine width={18} height={18} />
                Invitations
              </Button>
            </div>

            <div className="h-0 flex-1 overflow-y-auto px-5 py-4">
              {loadingConversations && (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse border-b border-white/5 pb-3">
                      <div className="h-12 w-12 rounded-full bg-[#262626]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 rounded bg-[#262626]" />
                        <div className="h-3 w-44 rounded bg-[#262626]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingConversations && activeTab === 'messages' && conversationPreview.length === 0 && (
                <p className="py-10 text-center text-sm text-[#9b9b9b]">No conversations yet.</p>
              )}

              {activeTab === 'messages' && conversationPreview.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => {
                    setSelectedConversation(convo);
                    loadMessages(convo.id);
                  }}
                  className={`flex w-full items-center gap-3 border-b border-white/5 py-3 text-left transition-opacity ${
                    selectedConversation?.id === convo.id ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[#262626]">
                    {convo.avatar ? (
                      <img src={convo.avatar} alt={convo.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                        {getInitials(convo.name)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[16px] text-white">{convo.name}</span>
                      <span className="text-[12px] text-[#9b9b9b]">{convo.time}</span>
                    </div>
                    <p className="truncate text-[12px] text-[#9b9b9b]">
                      {convo.message || 'Hey, any updates on the campaign?'}
                    </p>
                  </div>
                </button>
              ))}

              {activeTab === 'invitations' && (
                <div className="py-10 text-center text-sm text-[#9b9b9b]">No invitations.</div>
              )}
            </div>
          </section>

<section className="hidden xl:flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-[#181818]">            <div className="flex items-center justify-between bg-[#262626] px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a34a] text-white">
                  {selectedConversation ? getInitials(selectedConversation.name) : 'A'}
                </div>
                <div>
                  <p className="text-[16px] font-medium leading-tight">
                    {selectedConversation?.name || 'Header'}
                  </p>
                  <p className="text-[14px] text-[#9b9b9b]">typing...</p>
                </div>
              </div>
              <button className="px-2 text-white/90 hover:text-white" aria-label="More options">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </div>

            <div className="h-0 flex-1 overflow-y-auto px-4 py-4">
              {error && (
                <div className="mb-3 rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              )}

              {!selectedConversation ? (
                <div className="flex h-full items-center justify-center text-sm text-[#9b9b9b]">
                  Select a conversation to start chatting
                </div>
              ) : (
                <>
                  {loadingMessages && (
                    <div className="space-y-4 py-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`flex animate-pulse ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                          <div className="h-10 w-56 rounded-2xl bg-[#2a2a2a]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingMessages && messages.length === 0 && (
                    <p className="py-10 text-center text-sm text-[#9b9b9b]">No messages yet. Say hello!</p>
                  )}

                  {groupedMessages.map((item, idx) => {
                    if (item.type === 'dateSep') {
                      return (
                        <div key={`sep-${idx}`} className="my-4 flex items-center gap-3">
                          <div className="h-px flex-1 bg-white/10" />
                          <span className="whitespace-nowrap rounded-full border border-white/10 bg-[#111] px-3 py-1 text-[11px] text-[#9b9b9b]">
                            {item.label}
                          </span>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                      );
                    }

                    const message = item.data;
                    const senderId = getSenderId(message);
                    const isMe = !!(currentUserId && senderId && senderId === currentUserId);
                    const timeLabel = formatTime(message.timestamp || message.createdAt);
                    const hasAttachment = Array.isArray(message.attachments) && message.attachments.length > 0;

                    return (
                      <div key={message.id || message._id || `msg-${idx}`} className={`mb-3 flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="mb-1 flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#16a34a] text-[10px] font-semibold text-white">
                            {selectedConversation ? getInitials(selectedConversation.name) : 'A'}
                          </div>
                        )}

                        <div className={`flex max-w-[70%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          {hasAttachment && (
                            <div className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${isMe ? 'bg-[#16a34a] text-white' : 'bg-[#262626] text-[#9b9b9b]'}`}>
                              Attachment
                            </div>
                          )}

                          {message.content && (
                            <div
                              className={`rounded-[18px] px-[14px] py-[9px] text-[14px] leading-[1.5] ${
                                isMe
                                  ? 'rounded-br-[4px] bg-[#16a34a] text-white'
                                  : 'rounded-bl-[4px] bg-[#262626] text-white'
                              } ${message._optimistic ? 'opacity-70' : ''}`}
                            >
                              {message.content}
                            </div>
                          )}

                          <div className={`mt-1 flex items-center gap-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[11px] text-[#9b9b9b]">{timeLabel}</span>
                            {isMe && (
                              <MessageTicks
                                isDelivered={message.isDelivered ?? !message._optimistic}
                                isRead={message.isRead ?? false}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="relative border-t border-white/5 bg-[#181818] px-4 py-3">
              <input ref={fileInputRef} type="file" onChange={onAttachmentSelected} className="hidden" />

              {showAttachments && (
                <div className="absolute bottom-full right-20 z-50 mb-2 rounded-2xl border border-white/10 bg-[#1e1e1e] p-3 shadow-2xl">
                  <div className="flex items-center gap-2.5">
                    {attachmentOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={handleAttachmentClick}
                          className="flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[#9b9b9b] hover:bg-white/5 hover:text-white"
                        >
                          <Icon width={24} height={24} />
                          <span className="whitespace-nowrap text-xs">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button className="flex-shrink-0 text-[#9b9b9b] transition-colors hover:text-white">
                  <EmotionLine width={22} height={22} />
                </button>

                <div className="flex-1 rounded-full bg-[#262626] px-4 py-2.5">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Type something here"
                    className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#9b9b9b]"
                  />
                </div>

                <button
                  onClick={() => setShowAttachments(!showAttachments)}
                  className={`flex-shrink-0 transition-colors ${showAttachments ? 'text-[#16a34a]' : 'text-[#9b9b9b] hover:text-white'}`}
                >
                  <Link width={22} height={22} />
                </button>

                <button className="flex-shrink-0 text-[#9b9b9b] transition-colors hover:text-white">
                  <MicLine width={22} height={22} />
                </button>

                <Button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageInput.trim() || !selectedConversation}
                  loading={sendingMessage}
                  icon={SendPlane2Fill}
                  className="w-10 px-0 flex-shrink-0"
                  aria-label="Send message"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default InboxPage;
