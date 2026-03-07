'use client'
import React, { memo } from 'react';

const ChatHeader = memo(({ contact, emptyMessage = 'Select a conversation to start chatting' }) => {
  if (!contact) {
    return (
      <div className="h-16 border-b border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-gray-200 flex items-center px-6">
      <img
        src={contact.avatar}
        alt={contact.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="ml-3">
        <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
      </div>
    </div>
  );
});

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
