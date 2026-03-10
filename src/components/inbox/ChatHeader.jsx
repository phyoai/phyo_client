'use client'
import React, { memo } from 'react';

const ChatHeader = memo(({ contact, emptyMessage = 'Select a conversation to start chatting' }) => {
  if (!contact) {
    return (
      <div className="h-16 border-b border-neutral-muted flex items-center justify-center bg-neutral-base">
        <p className="text-text-muted text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-neutral-muted flex items-center px-6 bg-neutral-base">
      <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
      <div className="ml-3">
        <h3 className="text-base font-semibold text-text-base">{contact.name}</h3>
        <p className="text-xs text-text-muted">Online</p>
      </div>
    </div>
  );
});

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
