'use client'
import React, { useState, memo, useCallback } from 'react';
import { SendPlane2FillMicLineLinkEmotionLineChat1FillUserAddFillCamera4FillMultiImageFillFileTextFillHeadphoneFill } from '@phyoofficial/phyo-icon-library'; 
const InboxPage = memo(({
  conversations = [],
  newInvitations = [],
  myRequests = [],
  onSelectConversation = null,
  onSendMessage = null,
  onAccept = null,
  onReject = null,
  onWithdraw = null,
  logoSrc = '/assets/phyo_logo_new.svg',
  accentColor = '#5B7553',
  sidebarWidth = '30%'
}) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);

  // Default sample data
  const defaultConversations = [
    {
      id: 1,
      name: 'Alcie',
      message: 'Hey, any updates on the campaign?',
      time: '18:09',
      avatar: '/dummyAvatar.jpg',
      unread: false,
      campaign: 'Campaign Chacha'
    },
    {
      id: 2,
      name: 'Clara',
      message: 'I spoke with the social media team,...',
      time: '18:08',
      avatar: '/dummyAvatar1.jpg',
      unread: false
    }
  ];

  const data = {
    conversations: conversations.length > 0 ? conversations : defaultConversations,
    newInvitations,
    myRequests
  };

  const handleSelectConversation = useCallback((conv) => {
    setSelectedConversation(conv);
    if (onSelectConversation) {
      onSelectConversation(conv);
    }
  }, [onSelectConversation]);

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && selectedConversation) {
      if (onSendMessage) {
        onSendMessage(messageInput, selectedConversation);
      }
      setMessageInput('');
    }
  }, [messageInput, selectedConversation, onSendMessage]);

  const handleAccept = useCallback((id) => {
    if (onAccept) {
      onAccept(id);
    }
  }, [onAccept]);

  const handleReject = useCallback((id) => {
    if (onReject) {
      onReject(id);
    }
  }, [onReject]);

  const handleWithdraw = useCallback((id) => {
    if (onWithdraw) {
      onWithdraw(id);
    }
  }, [onWithdraw]);

  const handleAttachmentClick = useCallback((type) => {
    setShowAttachments(false);
  }, []);

  const attachmentOptions = [
    { id: 'camera', label: 'Camera', icon: Camera4Fill },
    { id: 'gallery', label: 'Gallery', icon: MultiImageFill },
    { id: 'documents', label: 'Documents', icon: FileTextFill },
    { id: 'audio', label: 'Audio', icon: HeadphoneFill }
  ];

  const getChatMessages = useCallback((conversationId) => {
    if (conversationId === 1) {
      return [
        { id: 1, text: '', voice: true, sender: 'them', time: '18:09' },
        { id: 2, text: '', document: true, sender: 'them', time: '18:13' },
        { id: 3, text: 'Around 8 AM, I think.', sender: 'them', time: '18:14' },
        { id: 4, text: 'Perfect! I will be ready.', sender: 'me', time: '18:15' }
      ];
    }
    return [];
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar - Invitations List */}
      <div className={`w-full sm:w-[${sidebarWidth}] bg-neutral-base border-r border-gray-200 flex flex-col overflow-hidden`}>
        {/* Sticky Header */}
        <div className="flex-shrink-0 bg-neutral-base border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">InboxLine</h1>
          </div>

          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'messages'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Chat1Fill width={20} height={20} />
              Messages
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'invitations'
                  ? 'text-[#00897B] border-b-2 border-[#00897B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserAddFill width={20} height={20} />
              Invitations
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'messages' && (
            <div className="flex-1 overflow-y-auto">
              {data.conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {conversation.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.message}
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invitations' && (
            <>
              {/* New Invitations Section */}
              {data.newInvitations.length > 0 && (
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-900">
                      New Invitations ({data.newInvitations.length})
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {data.newInvitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 cursor-pointer transition-colors"
                      >
                        <img
                          src={invitation.avatar}
                          alt={invitation.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {invitation.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {invitation.description}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleAccept(invitation.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(invitation.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Requests Section */}
              {data.myRequests.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-900">My Requests</h2>
                  </div>

                  <div className="space-y-3">
                    {data.myRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 cursor-pointer transition-colors"
                      >
                        <img
                          src={request.avatar}
                          alt={request.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {request.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {request.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleWithdraw(request.id)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-neutral-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex-shrink-0"
                        >
                          withdraw
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Chat Interface or Empty State */}
      <div className="flex-1 flex flex-col bg-neutral-base overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {selectedConversation.campaign || selectedConversation.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {getChatMessages(selectedConversation.id).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === 'me'
                        ? 'bg-[#5B7553] text-white rounded-2xl rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                    } px-4 py-2.5`}
                  >
                    {!message.document && !message.voice && (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-gray-200' : 'text-gray-500'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 relative">
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <EmotionLine width={24} height={24} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="type something here"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{ '--tw-ring-color': accentColor }}
                  />
                </div>

                {/* Attachment Options Panel */}
                {showAttachments && (
                  <div className="absolute bottom-[calc(100%+0.5rem)] right-24 z-50">
                    <div className="bg-neutral-base rounded-2xl shadow-xl border border-gray-200 p-3 flex items-center gap-2.5">
                      {attachmentOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <div
                            key={option.id}
                            onClick={() => handleAttachmentClick(option.id)}
                            className="flex flex-col items-center gap-1 cursor-pointer group transition-all duration-300"
                          >
                            <div className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                              <IconComponent width={28} height={28} className="text-[#787d73]" />
                            </div>
                            <span className="text-xs font-semibold text-[#787d73] whitespace-nowrap">
                              {option.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowAttachments(!showAttachments)}
                  className={`text-gray-400 hover:text-gray-600 transition-all duration-300 ${
                    showAttachments ? 'text-[#5B7553] rotate-45 scale-110' : ''
                  }`}
                >
                  <Link width={24} height={24} />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MicLine width={24} height={24} />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 flex items-center justify-center text-white rounded-full transition-colors hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  <SendPlane2Fill width={20} height={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-64 h-auto mx-auto opacity-20"
              />
              <p className="text-sm text-gray-400 mt-4 font-medium">A PyroMedia Product</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

InboxPage.displayName = 'InboxPage';

export default InboxPage;
