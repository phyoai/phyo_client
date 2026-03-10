'use client'
import React, { memo, useState } from 'react';

const MessagesList = memo(({
  contacts = [],
  selectedContact,
  onSelectContact,
  searchPlaceholder = 'Search Messages',
  defaultTab = 'Invitations',
  tabs = ['Messages', 'Invitations'],
  sidebarWidth = 'w-80'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(defaultTab);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${sidebarWidth} bg-neutral-base flex flex-col h-full`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-muted">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-muted rounded-lg bg-neutral-muted text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex border-b border-neutral-muted">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium relative transition-colors ${
                activeTab === tab
                  ? 'text-brand-base border-b-2 border-brand-base'
                  : 'text-text-muted hover:text-text-base border-b-2 border-transparent'
              }`}
            >
              {tab}
              {tab === 'Invitations' && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-base rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tab Label */}
      {activeTab && (
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-text-base">{activeTab}</h3>
        </div>
      )}

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center text-text-muted py-8 text-sm">
            <p>No contacts found</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`p-4 border-b border-neutral-muted cursor-pointer transition-colors ${
                selectedContact?.id === contact.id
                  ? 'bg-neutral-muted border-l-4 border-l-brand-base'
                  : 'hover:bg-neutral-muted'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={contact.avatar} alt={contact.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-base truncate">{contact.name}</h4>
                    {contact.status && (
                      <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ml-2 ${
                        contact.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-neutral-muted text-text-muted'
                      }`}>
                        {contact.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-text-muted truncate">{contact.action}</p>
                    <span className="text-xs text-text-muted flex-shrink-0 ml-2">{contact.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

MessagesList.displayName = 'MessagesList';

export default MessagesList;
