'use client'
import React, { useState } from 'react';
import MessagesList from './MessagesList';
import ChatInterface from './ChatInterface';

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  // Sample contacts data
  const contacts = [
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

  return (
    <div className="h-screen bg-gray-50 flex">
      <MessagesList 
        contacts={contacts} 
        selectedContact={selectedContact}
        onSelectContact={setSelectedContact}
      />
      <ChatInterface selectedContact={selectedContact} />
    </div>
  );
};

export default ChatPage;