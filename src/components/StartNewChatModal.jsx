'use client'
import { useEffect, useRef, useState } from 'react';
import { influencerApi } from '@/api/influencer-api';
import messageApi from '@/api/message-api';
import secureAuthStorage from '@/utils/secure-auth';
import { SendPlane2Fill, ArrowLeftLine } from '@phyoofficial/phyo-icon-library';
import { useSidebar } from '@/app/context/SidebarContext';

export default function StartNewChatPanel({ isOpen, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const currentUserId = secureAuthStorage.getUserData()?._id;
  const { isExpanded } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await influencerApi.getAllInfluencers(
        { niche: searchQuery || undefined },
        { page: 1, limit: 50 }
      );
      setUsers(result.influencers || []);
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
      const conv = await messageApi.createConversationWithMessage(user._id || user.id);
      setConversation(conv);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || !conversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const newMessage = {
        id: `tmp-${Date.now()}`,
        content,
        senderId: currentUserId,
        senderName: secureAuthStorage.getUserData()?.name || 'You',
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput('');
      await messageApi.sendMessage(conversation.id || conversation._id, { content });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed top-[80px] right-0 bottom-0 z-50 bg-[#000201] flex flex-col transition-all duration-300 ${isExpanded ? 'left-[280px]' : 'left-[72px]'}`}>
      {/* Header */}
      <div className="h-[80px] bg-[#181818] border-b border-[#2F2F2F] flex items-center px-5 flex-shrink-0">
        <button onClick={onClose} className="text-[#9B9B9B] hover:text-white transition-colors mr-4">
          <ArrowLeftLine width={24} height={24} />
        </button>
        <h2 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Start New Chat
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-[20px] p-5">
        {/* Left Panel - Users List */}
        <div className="w-[360px] flex-shrink-0 bg-[#181818] rounded-[24px] p-5 flex flex-col overflow-hidden border border-[#2F2F2F]">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                const timer = setTimeout(() => loadUsers(), 300);
                return () => clearTimeout(timer);
              }}
              className="w-full px-4 py-3 bg-[#262626] border border-[#333] rounded-xl text-sm text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2">
              {users.map((user) => (
                <div
                  key={user._id || user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`p-4 rounded-[12px] cursor-pointer transition-colors ${
                    selectedUser?._id === user._id || selectedUser?.id === user.id
                      ? 'bg-[#16a34a]/20 border border-[#16a34a]'
                      : 'bg-[#262626] hover:bg-[#2F2F2F] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {(user.name || user.username || '?')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-normal text-white truncate">
                        {user.name || user.username || 'Unknown'}
                      </p>
                      <p className="text-[12px] text-[#9b9b9b] truncate">
                        {user.categories?.[0] || 'Creator'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 bg-[#181818] rounded-[24px] p-5 flex flex-col overflow-hidden border border-[#2F2F2F]">
          {selectedUser ? (
            <>
              <div className="pb-4 border-b border-[#2F2F2F] mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#16a34a] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(selectedUser.name || selectedUser.username || '?')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[16px] font-normal text-white">
                      {selectedUser.name || selectedUser.username}
                    </p>
                    <p className="text-[12px] text-[#9b9b9b]">
                      {selectedUser.categories?.[0] || 'Creator'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-[#9b9b9b]">
                    <p>Start a conversation...</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={msg.id || idx} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-3 rounded-[12px] ${msg.senderId === currentUserId ? 'bg-[#16a34a] text-white' : 'bg-[#262626] text-[#9b9b9b]'}`}>
                        <p className="text-[14px]">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-[#262626] border border-[#333] rounded-xl text-sm text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageInput.trim()}
                  className="w-12 h-12 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <SendPlane2Fill width={20} height={20} fill="white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#9b9b9b]">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
