'use client'
import React, { useState, memo, useCallback } from 'react';
import MessagesList from './MessagesList';
import ChatInterface from './ChatInterface';

const ChatPage = memo(({
  contacts = [],
  onSelectContact = null,
  onSendMessage = null,
  onFileSelect = null,
  bgColor = 'bg-gray-50'
}) => {
  const [selectedContact, setSelectedContact] = useState(null);

  // Default sample contacts
  const defaultContacts = [
    {
      id: 1,
      name: 'Caroline Forbes',
      avatar: '/api/placeholder/48/48',
      status: 'Pending',
      action: 'Sent Invitation',
      time: '12h'
    },
    {
      id: 2,
      name: 'Elena Gilbert',
      avatar: '/api/placeholder/48/48',
      status: 'Pending',
      action: 'Sent Invitation',
      time: '3d'
    },
    {
      id: 3,
      name: 'Rebecca Max',
      avatar: '/api/placeholder/48/48',
      status: 'Expired',
      action: 'Sent Invitation',
      time: '12w'
    }
  ];

  const data = contacts.length > 0 ? contacts : defaultContacts;

  const handleSelectContact = useCallback((contact) => {
    setSelectedContact(contact);
    if (onSelectContact) {
      onSelectContact(contact);
    }
  }, [onSelectContact]);

  return (
    <div className={`h-screen ${bgColor} flex`}>
      <MessagesList
        contacts={data}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
      />
      <ChatInterface
        selectedContact={selectedContact}
        onSendMessage={onSendMessage}
        onFileSelect={onFileSelect}
      />
    </div>
  );
});

ChatPage.displayName = 'ChatPage';

export default ChatPage;
