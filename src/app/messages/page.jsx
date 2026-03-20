'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations } from '@/store/slices/messagingSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { Search, MessagePlus } from 'lucide-react';

export default function MessagesPage() {
  const dispatch = useDispatch();

  const { conversations, loading } = useSelector((state) => state.messaging);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MessagePlus size={20} className="text-blue-600" />
            </button>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessagePlus size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No conversations yet</p>
              </div>
            </div>
          ) : (
            <div>
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`
                    w-full p-4 border-b border-gray-100 hover:bg-gray-50
                    transition-colors text-left
                    ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {conversation.participantName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.lastMessage?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className="mt-2 inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      {conversation.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex md:flex-1 flex-col">
        {selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedConversation.participantName}
              </h2>
              <p className="text-gray-600 mb-6">
                Click on a conversation to view messages
              </p>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessagePlus size={64} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
