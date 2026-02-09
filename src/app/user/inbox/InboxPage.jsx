'use client'
import React, { useState } from 'react';
import { SendPlane2Fill, MicLine, Link, EmotionLine, Chat1Fill, UserAddFill, Camera4Fill, MultiImageFill, FileTextFill, HeadphoneFill } from '@phyoofficial/phyo-icon-library';

const InboxPage = () => {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'invitations'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);

  // Sample conversations data
  const conversations = [
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
    },
    {
      id: 3,
      name: 'Derek',
      message: "I'm working on the email drafts, aim...",
      time: '18:07',
      avatar: '/dummyAvatar1 2.jpg',
      unread: false
    },
    {
      id: 4,
      name: 'Gina',
      message: "I'll check in with the influencers to...",
      time: '18:06',
      avatar: '/dummyAvatar.jpg',
      unread: false
    },
    {
      id: 5,
      name: 'Finn',
      message: 'I gathered some insights from last v...',
      time: '18:05',
      avatar: '/dummyAvatar1.jpg',
      unread: false
    },
    {
      id: 6,
      name: 'Benny',
      message: "We're finalizing the visuals and sho...",
      time: '18:04',
      avatar: '/dummyAvatar1 2.jpg',
      unread: false
    },
    {
      id: 7,
      name: 'Hugo',
      message: 'The landing page is under review; w...',
      time: '18:03',
      avatar: '/dummyAvatar.jpg',
      unread: false
    },
    {
      id: 8,
      name: 'Eva',
      message: 'The budget approval came through;...',
      time: '18:02',
      avatar: '/dummyAvatar1.jpg',
      unread: false
    },
    {
      id: 9,
      name: 'Ivy',
      message: "I'm scheduling a team meeting for n...",
      time: '18:01',
      avatar: '/dummyAvatar1 2.jpg',
      unread: false
    },
    {
      id: 10,
      name: 'Jack',
      message: "Let's ensure we have a solid follow-...",
      time: '18:00',
      avatar: '/dummyAvatar.jpg',
      unread: false
    }
  ];

  // Sample chat messages for selected conversation
  const getChatMessages = (conversationId) => {
    if (conversationId === 1) {
      return [
        { id: 1, text: '', voice: true, sender: 'them', time: '18:09' },
        { id: 2, text: '', document: true, sender: 'them', time: '18:13' },
        { id: 3, text: 'Around 8 AM, I think.', sender: 'them', time: '18:14' },
        { id: 4, text: 'Perfect! I will be ready.', sender: 'me', time: '18:15' },
        { id: 5, text: "Great! Can't wait to see you!", sender: 'them', time: '18:16' },
        { id: 6, text: "Same here! It's been a while.", sender: 'me', time: '18:17' },
        { id: 7, text: '', voice: true, sender: 'them', time: '18:18' },
        { id: 8, text: 'Absolutely! How about a beach getaway next?', sender: 'me', time: '18:25' },
        { id: 9, text: '', document: true, sender: 'them', time: '18:18' },
        { id: 10, text: 'Count me in! We should consider a road trip too.', sender: 'them', time: '18:30' }
      ];
    }
    return [];
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleAttachmentClick = (type) => {
    console.log('Attachment type selected:', type);
    setShowAttachments(false);
  };

  const attachmentOptions = [
    { id: 'camera', label: 'Camera', icon: Camera4Fill },
    { id: 'gallery', label: 'Gallery', icon: MultiImageFill },
    { id: 'documents', label: 'Documents', icon: FileTextFill },
    { id: 'audio', label: 'Audio', icon: HeadphoneFill }
  ];

  // Sample data for new invitations
  const newInvitations = [
    {
      id: 1,
      name: 'Emily Thompson',
      description: 'Lifestyle influencer sharin...',
      avatar: '/dummyAvatar.jpg',
      type: 'new'
    },
    {
      id: 2,
      name: 'Sophie Kim',
      description: 'Travel blogger exploring hi...',
      avatar: '/dummyAvatar1.jpg',
      type: 'new'
    },
    {
      id: 3,
      name: 'Jake Reyes',
      description: 'Tech enthusiast and revie...',
      avatar: '/dummyAvatar1 2.jpg',
      type: 'new'
    },
    {
      id: 4,
      name: 'Olivia Martinez',
      description: 'Beauty guru demonstratin...',
      avatar: '/dummyAvatar.jpg',
      type: 'new'
    },
    {
      id: 5,
      name: 'Michael Chen',
      description: 'Fitness coach offering wor...',
      avatar: '/dummyAvatar1.jpg',
      type: 'new'
    }
  ];

  // Sample data for my requests
  const myRequests = [
    {
      id: 1,
      name: 'Alice Johnson',
      description: 'A passionate graphic desi...',
      avatar: '/dummyAvatar.jpg',
      type: 'request'
    },
    {
      id: 2,
      name: 'Michael Smith',
      description: 'An innovative product ma...',
      avatar: '/dummyAvatar1 2.jpg',
      type: 'request'
    },
    {
      id: 3,
      name: 'Alice Johnson',
      description: 'A passionate graphic desi...',
      avatar: '/dummyAvatar.jpg',
      type: 'request'
    },
    {
      id: 4,
      name: 'Michael Smith',
      description: 'An innovative product ma...',
      avatar: '/dummyAvatar1.jpg',
      type: 'request'
    }
  ];

  const handleAccept = (id) => {
    console.log('Accepted invitation:', id);
  };

  const handleReject = (id) => {
    console.log('Rejected invitation:', id);
  };

  const handleWithdraw = (id) => {
    console.log('Withdrawn request:', id);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar - Invitations List */}
      <div className="w-full sm:w-[30%] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Inbox</h1>
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
            <>
              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
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
            </>
          )}

          {activeTab === 'invitations' && (
            <>
              {/* New Invitations Section */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">
                    New Invitations ({newInvitations.length})
                  </h2>
                  <button className="text-xs font-medium text-[#00897B] hover:text-[#00695C]">
                    view all &gt;
                  </button>
                </div>

                <div className="space-y-3">
                  {newInvitations.map((invitation) => (
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
                          title="Accept"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleReject(invitation.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Reject"
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

              {/* My Requests Section */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">My Requests</h2>
                  <button className="text-xs font-medium text-[#00897B] hover:text-[#00695C]">
                    view all &gt;
                  </button>
                </div>

                <div className="space-y-3">
                  {myRequests.map((request) => (
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
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex-shrink-0"
                      >
                        withdraw
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Chat Interface or Empty State */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
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
                  {selectedConversation.campaign && (
                    <p className="text-xs text-gray-500">typing...</p>
                  )}
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
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
                    {message.document && (
                      <div className="flex items-center gap-2 mb-2 p-3 bg-[#4A5F45] rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-white">Document</p>
                          <p className="text-xs text-gray-200">1 page</p>
                        </div>
                        <button className="text-white hover:text-gray-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {message.voice && (
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <button className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 h-6">
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                className="w-0.5 bg-white bg-opacity-60 rounded-full"
                                style={{ height: `${Math.random() * 100}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {!message.document && !message.voice && (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-gray-200' : 'text-gray-500'
                      }`}
                    >
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5B7553] focus:border-transparent text-sm"
                  />
                </div>
                
                {/* Attachment Options Panel - Positioned above link button */}
                {showAttachments && (
                  <div className="absolute bottom-[calc(100%+0.5rem)]  right-24 z-50">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 flex items-center gap-2.5">
                      {attachmentOptions.map((option, index) => {
                        const IconComponent = option.icon;
                        return (
                          <div
                            key={option.id}
                            onClick={() => handleAttachmentClick(option.id)}
                            className="flex flex-col items-center gap-1 cursor-pointer group transition-all duration-300 animate-slideUp"
                            style={{
                              animationDelay: `${index * 60}ms`
                            }}
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
                  className="w-10 h-10 flex items-center justify-center bg-[#5B7553] hover:bg-[#4A5F45] text-white rounded-full transition-colors"
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
                src="/assets/phyo_logo_new.svg"
                alt="Phyo Logo"
                className="w-64 h-auto mx-auto opacity-20"
              />
              <p className="text-sm text-gray-400 mt-4 font-medium">A PyroMedia Product</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;

