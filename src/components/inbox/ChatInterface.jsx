'use client'
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatInterface = memo(({
  selectedContact,
  initialMessages = [],
  onSendMessage = null,
  onFileSelect = null,
  autoReply = true,
  emptyTitle = 'No conversation selected',
  emptyMessage = 'Choose a contact from the list to start messaging'
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef(null);

  // Default sample message for new contacts
  const defaultSampleMessage = {
    id: 1,
    content: `Hi [Influencer Name],

We're excited to invite you to collaborate with us on our upcoming campaign for [Brand Name]!

We believe your content style and audience align perfectly with our goals.

Here are the key details:

📌 Campaign: [Campaign Name]
🎯 Deliverables: 1 Reel + 2 Stories
💰 Compensation: [Amount or Type]
🗓️ Timeline: [Start Date] - [End Date]

Please review and respond by [Last Reply Date], after which this invite will expire.

Looking forward to potentially working together!

Warm regards,
[Brand Representative Name]
[Brand Name]`,
    timestamp: 'Today 10:27am',
    isOwn: false
  };

  // Load messages when contact changes
  useEffect(() => {
    if (selectedContact) {
      if (initialMessages.length > 0) {
        setMessages(initialMessages);
      } else if (selectedContact.id === 2) {
        setMessages([defaultSampleMessage]);
      } else {
        setMessages([]);
      }
    }
  }, [selectedContact, initialMessages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback((content) => {
    const newMessage = {
      id: Date.now(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    setMessages(prev => [...prev, newMessage]);

    if (onSendMessage) {
      onSendMessage(content, selectedContact);
    }

    // Simulate response
    if (autoReply && selectedContact) {
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          content: "Thank you for reaching out! I'd love to learn more about this opportunity. Could you tell me more about the brand and campaign details?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  }, [selectedContact, autoReply, onSendMessage]);

  const handleFileSelect = useCallback((file) => {
    const fileMessage = {
      id: Date.now(),
      content: `📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    setMessages(prev => [...prev, fileMessage]);

    if (onFileSelect) {
      onFileSelect(file, selectedContact);
    }
  }, [selectedContact, onFileSelect]);

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyTitle}</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-base">
      <ChatHeader contact={selectedContact} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} isOwn={message.isOwn} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} onFileSelect={handleFileSelect} />
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
