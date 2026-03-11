'use client'
import React, { useState, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Chat1Fill, UserAddFill, ArrowLeftLine } from '@phyoofficial/phyo-icon-library';

import MessagesList from './MessagesList';
import ChatInterface from './ChatInterface';

const InboxPage = memo(({
  conversations = [],
  newInvitations = [],
  myRequests = [],
  onSelectConversation = null,
  onSendMessage = null,
  onAccept = null,
  onReject = null,
  onWithdraw = null,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  const defaultConversations = [
    { id: 1, name: 'Alcie', message: 'Hey, any updates on the campaign?', time: '18:09', avatar: '/dummyAvatar.jpg', unread: false, campaign: 'Campaign Chacha' },
    { id: 2, name: 'Clara', message: 'I spoke with the social media team,...', time: '18:08', avatar: '/dummyAvatar1.jpg', unread: false },
  ];

  const defaultInvitations = [
    { id: 1, name: 'Swagdeep Singh', role: 'Lifestyle Creator', followers: '120K', platform: 'Instagram', mutual: '12 mutual connections', avatar: '/dummyAvatar.jpg',  about: 'Passionate lifestyle creator sharing travel, fashion, and wellness content with an engaged audience.' },
    { id: 2, name: 'Priya Sharma',   role: 'Fashion Influencer', followers: '85K',  platform: 'Instagram', mutual: '5 mutual connections',  avatar: '/dummyAvatar1.jpg', about: 'Fashion and beauty enthusiast helping brands connect with style-conscious millennials.' },
    { id: 3, name: 'Aryan Mehta',    role: 'Travel & Food Blogger', followers: '200K', platform: 'YouTube', mutual: '8 mutual connections',  avatar: '/dummyAvatar.jpg',  about: 'Documenting food trails and travel adventures across India and South-East Asia.' },
  ];

  const defaultRequests = [
    { id: 1, name: 'Neha Kapoor', role: 'Beauty Creator', followers: '60K', platform: 'Instagram', status: 'Pending', sentAgo: '3 days ago', avatar: '/dummyAvatar1.jpg', about: 'Skincare and makeup tutorials with an authentic, relatable style.' },
    { id: 2, name: 'Rohan Verma',  role: 'Tech Reviewer',  followers: '45K', platform: 'YouTube',   status: 'Pending', sentAgo: '1 week ago', avatar: '/dummyAvatar.jpg',  about: 'In-depth gadget reviews and unboxing videos for tech enthusiasts.' },
  ];

  const data = {
    conversations:  conversations.length  > 0 ? conversations  : defaultConversations,
    newInvitations: newInvitations.length > 0 ? newInvitations : defaultInvitations,
    myRequests:     myRequests.length     > 0 ? myRequests      : defaultRequests,
  };

  const contactsForList = data.conversations.map(conv => ({
    id: conv.id, name: conv.name, avatar: conv.avatar,
    status: conv.unread ? 'Unread' : '', action: conv.message, time: conv.time,
  }));

  const selectedContact = selectedConversation
    ? { id: selectedConversation.id, name: selectedConversation.campaign || selectedConversation.name, avatar: selectedConversation.avatar }
    : null;

  const getInitialMessages = useCallback((convId) => {
    if (convId === 1) return [
      { id: 1, content: 'Around 8 AM, I think.', timestamp: '18:14', isOwn: false },
      { id: 2, content: 'Perfect! I will be ready.', timestamp: '18:15', isOwn: true },
    ];
    return [];
  }, []);

  const handleSelectConversation = useCallback((contact) => {
    const conv = data.conversations.find(c => c.id === contact.id) || contact;
    setSelectedConversation(conv);
    if (onSelectConversation) onSelectConversation(conv);
  }, [data.conversations, onSelectConversation]);

  const handleAccept   = useCallback((id) => { if (onAccept)   onAccept(id);   }, [onAccept]);
  const handleReject   = useCallback((id) => { if (onReject)   onReject(id);   }, [onReject]);
  const handleWithdraw = useCallback((id) => { if (onWithdraw) onWithdraw(id); }, [onWithdraw]);

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
              onClick={() => { setActiveTab('invitations'); setSelectedInvitation(null); }}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'invitations' ? 'text-brand-base border-b-2 border-brand-base' : 'text-text-muted hover:text-text-base'
              }`}
            >
              <UserAddFill width={20} height={20} />
              Invitations
              {data.newInvitations.length > 0 && (
                <span className="ml-1 bg-brand-base text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {data.newInvitations.length}
                </span>
              )}
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
            <div className="flex-1 overflow-y-auto bg-neutral-muted">

              {/* Pending Invitations */}
              {data.newInvitations.length > 0 && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                    {data.newInvitations.length} Pending Invitations
                  </p>
                  <div className="space-y-3">
                    {data.newInvitations.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => setSelectedInvitation(inv)}
                        className={`bg-neutral-base rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
                          selectedInvitation?.id === inv.id ? 'border-brand-base ring-1 ring-brand-base' : 'border-neutral-muted hover:border-neutral-muted'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img src={inv.avatar} alt={inv.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-neutral-muted" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-text-base leading-tight">{inv.name}</h3>
                            <p className="text-xs text-text-muted mt-0.5">{inv.role} · {inv.followers}</p>
                            {inv.mutual && (
                              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM2 8a2 2 0 114 0 2 2 0 01-4 0z"/>
                                </svg>
                                {inv.mutual}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={(e) => { e.stopPropagation(); handleReject(inv.id); }} className="flex-1 py-1.5 text-xs font-semibold text-text-muted border border-neutral-muted rounded-full hover:bg-neutral-muted transition-colors">
                            Ignore
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleAccept(inv.id); }} className="flex-1 py-1.5 text-xs font-semibold text-white bg-brand-base rounded-full hover:opacity-90 transition-colors">
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sent Requests */}
              {data.myRequests.length > 0 && (
                <div className="p-4 pt-0">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Sent Requests</p>
                  <div className="space-y-3">
                    {data.myRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => setSelectedInvitation(req)}
                        className={`bg-neutral-base rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
                          selectedInvitation?.id === req.id ? 'border-brand-base ring-1 ring-brand-base' : 'border-neutral-muted hover:border-neutral-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-neutral-muted" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-text-base">{req.name}</h3>
                            <p className="text-xs text-text-muted mt-0.5 truncate">{req.role} · {req.followers}</p>
                            <p className="text-xs text-text-muted mt-0.5">
                              Sent {req.sentAgo} · <span className="text-yellow-600 font-medium">{req.status}</span>
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleWithdraw(req.id); }}
                            className="px-3 py-1.5 text-xs font-semibold text-text-muted border border-neutral-muted rounded-full hover:bg-neutral-muted transition-colors flex-shrink-0"
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel ── */}
      {activeTab === 'messages' ? (
        <ChatInterface
          selectedContact={selectedContact}
          initialMessages={selectedConversation ? getInitialMessages(selectedConversation.id) : []}
          onSendMessage={onSendMessage}
          emptyTitle="No conversation selected"
          emptyMessage="Choose a message from the list to start chatting"
        />
      ) : selectedInvitation ? (
        /* Invitation Detail Panel */
        <div className="flex-1 overflow-y-auto bg-neutral-muted">
          <div className="max-w-xl mx-auto p-6 space-y-5">

            {/* Profile Card */}
            <div className="bg-neutral-base rounded-2xl border border-neutral-muted shadow-sm overflow-hidden">
              {/* Cover */}
              <div className="h-28 bg-gradient-to-r from-brand-base to-accent-base" />
              {/* Avatar */}
              <div className="px-6 pb-5">
                <div className="-mt-10 mb-3">
                  <img
                    src={selectedInvitation.avatar}
                    alt={selectedInvitation.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-neutral-base shadow"
                  />
                </div>
                <h2 className="text-xl font-bold text-text-base">{selectedInvitation.name}</h2>
                <p className="text-sm text-text-muted mt-0.5">{selectedInvitation.role} · {selectedInvitation.followers} followers</p>
                {selectedInvitation.mutual && (
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM2 8a2 2 0 114 0 2 2 0 01-4 0z"/>
                    </svg>
                    {selectedInvitation.mutual}
                  </p>
                )}
                {selectedInvitation.platform && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium bg-neutral-muted text-text-muted rounded-full">
                    {selectedInvitation.platform}
                  </span>
                )}
              </div>
            </div>

            {/* About */}
            {selectedInvitation.about && (
              <div className="bg-neutral-base rounded-2xl border border-neutral-muted shadow-sm p-5">
                <h3 className="text-sm font-semibold text-text-base mb-2">About</h3>
                <p className="text-sm text-text-muted leading-relaxed">{selectedInvitation.about}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-neutral-base rounded-2xl border border-neutral-muted shadow-sm p-5">
              {selectedInvitation.status ? (
                /* Sent request — show withdraw */
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <p className="text-sm text-text-muted">Invitation sent {selectedInvitation.sentAgo} and is <span className="font-semibold text-yellow-600">{selectedInvitation.status}</span>.</p>
                  </div>
                  <button
                    onClick={() => handleWithdraw(selectedInvitation.id)}
                    className="w-full py-2.5 text-sm font-semibold text-text-base border border-neutral-muted rounded-full hover:bg-neutral-muted transition-colors"
                  >
                    Withdraw Invitation
                  </button>
                </div>
              ) : (
                /* Incoming invite — show accept / ignore */
                <div className="space-y-3">
                  <p className="text-sm text-text-muted">{selectedInvitation.name} wants to collaborate with you.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(selectedInvitation.id)}
                      className="flex-1 py-2.5 text-sm font-semibold text-text-base border border-neutral-muted rounded-full hover:bg-neutral-muted transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAccept(selectedInvitation.id)}
                      className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-base rounded-full hover:opacity-90 transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* Empty invitations right panel */
        <div className="flex-1 flex items-center justify-center bg-neutral-muted">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-muted flex items-center justify-center mx-auto mb-4">
              <UserAddFill width={28} height={28} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-text-base">Select an invitation</p>
            <p className="text-sm text-text-muted mt-1">Click any invitation to see their profile</p>
          </div>
        </div>
      )}
    </div>
  );
});

InboxPage.displayName = 'InboxPage';

export default InboxPage;
