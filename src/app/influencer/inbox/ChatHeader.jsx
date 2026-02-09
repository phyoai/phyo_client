'use client'
import React from 'react';

const ChatHeader = ({ contact }) => {
  if (!contact) {
    return (
      <div className="h-16 border-b border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to start chatting</p>
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
};

export default ChatHeader;
