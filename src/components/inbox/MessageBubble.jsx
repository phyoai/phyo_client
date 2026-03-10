'use client'
import React, { memo } from 'react';

const MessageBubble = memo(({
  message,
  isOwn,
  ownBgColor = 'bg-brand-base',
  otherBgColor = 'bg-neutral-muted',
  ownTextColor = 'text-white',
  otherTextColor = 'text-text-base'
}) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn ? `${ownBgColor} ${ownTextColor}` : `${otherBgColor} ${otherTextColor}`
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.timestamp && (
          <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-text-muted'}`}>
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
