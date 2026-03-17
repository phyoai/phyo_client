'use client'
import React, { useState, memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chat1Fill, UserAddFill, ArrowLeftLine } from '@phyoofficial/phyo-icon-library';
import { useMessaging } from '@/hooks/useMessaging';
import MessagesList from './MessagesList';
import ChatInterface from './ChatInterface';

const InboxPage = memo(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Redux messaging hook
  const {
    conversations = [],
    selectedConversation: reduxSelectedConversation,
    messages = [],
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendNewMessage,
    selectNewConversation
  } = useMessaging();

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id, fetchMessages]);

  const contactsForList = conversations.map(conv => ({
    id: conv._id || conv.id,
    name: conv.participantName || conv.name || 'Unknown',
    avatar: conv.participantAvatar || '/dummyAvatar.jpg',
    status: conv.unread ? 'Unread' : '',
    action: conv.lastMessage || 'No messages yet',
    time: conv.lastMessageTime || '',
  }));

  const selectedContact = selectedConversation
    ? {
        id: selectedConversation._id || selectedConversation.id,
        name: selectedConversation.participantName || selectedConversation.name || 'Unknown',
        avatar: selectedConversation.participantAvatar || '/dummyAvatar.jpg'
      }
    : null;

  // Format messages for ChatInterface
  const formattedMessages = (messages || []).map(msg => ({
    id: msg._id || msg.id,
    content: msg.content || msg.message || '',
    timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    isOwn: msg.isOwn || msg.senderId === localStorage.getItem('userId'),
  }));

  const handleSelectConversation = useCallback((contact) => {
    const conv = conversations.find(c => (c._id || c.id) === contact.id);
    if (conv) {
      setSelectedConversation(conv);
      selectNewConversation(conv);
    }
  }, [conversations, selectNewConversation]);

  const handleSendMessage = useCallback((content, contact) => {
    if (sendNewMessage && contact) {
      sendNewMessage({ conversationId: contact.id || contact._id, content });
    }
  }, [sendNewMessage]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-muted">

      {/* ── Left Sidebar ── */}
      <div className="w-full sm:w-[30%] bg-neutral-base border-r border-neutral-muted flex flex-col overflow-hidden">

        {/* Header + Tabs */}
        <div className="flex-shrink-0 bg-neutral-base border-b border-neutral-muted">
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
            >
              <ArrowLeftLine className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-text-base">Inbox</h1>
          </div>
          <div className="flex">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'messages' ? 'text-text-base border-b-2 border-gray-900' : 'text-text-muted hover:text-text-base'
              }`}
            >
              <Chat1Fill width={20} height={20} />
              Messages
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'invitations' ? 'text-brand-base border-b-2 border-brand-base' : 'text-text-muted hover:text-text-base'
              }`}
            >
              <UserAddFill width={20} height={20} />
              Invitations
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">

          {/* Messages tab */}
          {activeTab === 'messages' && (
            <MessagesList
              contacts={contactsForList}
              selectedContact={selectedContact ? contactsForList.find(c => c.id === selectedContact.id) : null}
              onSelectContact={handleSelectConversation}
              searchPlaceholder="Search messages"
              tabs={[]}
              defaultTab=""
              sidebarWidth="w-full"
            />
          )}

          {/* Invitations tab */}
          {activeTab === 'invitations' && (
            <div className="flex-1 overflow-y-auto bg-neutral-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-base flex items-center justify-center mx-auto mb-4">
                  <UserAddFill width={28} height={28} className="text-text-muted" />
                </div>
                <p className="text-base font-medium text-text-base">No invitations yet</p>
                <p className="text-sm text-text-muted mt-1">Invitations from brands will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel ── */}
      {activeTab === 'messages' ? (
        <ChatInterface
          selectedContact={selectedContact}
          initialMessages={formattedMessages}
          onSendMessage={handleSendMessage}
          emptyTitle="No conversation selected"
          emptyMessage="Choose a message from the list to start chatting"
        />
      ) : (
        /* Empty right panel for invitations tab */
        <div className="flex-1 flex items-center justify-center bg-neutral-muted">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-base flex items-center justify-center mx-auto mb-4">
              <UserAddFill width={28} height={28} className="text-text-muted" />
            </div>
            <p className="text-base font-medium text-text-base">No invitations to display</p>
            <p className="text-sm text-text-muted mt-1">Collaboration invitations will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
});

InboxPage.displayName = 'InboxPage';

export default InboxPage;
