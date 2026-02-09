'use client'
import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-green-600 text-white' 
          : 'bg-green-100 text-gray-900'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.timestamp && (
          <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;