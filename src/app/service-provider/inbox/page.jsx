'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Search, AlertCircle, Trash2 } from 'lucide-react';
import { messageApi } from '@/api/message-api';

const ConversationSkeleton = () => (
  <div className="p-4 border-b border-gray-100 animate-pulse">
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await messageApi.getConversations();
        setConversations(response.conversations || response.data || []);
      } catch (err) {
        setError(err?.message || 'Failed to load conversations');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetch = async () => {
      try {
        setMessageLoading(true);
        const response = await messageApi.getMessages(selectedConversation.id);
        setMessages(response.messages || response.data || []);
      } catch (err) {
        setError(err?.message || 'Failed to load messages');
        console.error('Error fetching messages:', err);
      } finally {
        setMessageLoading(false);
      }
    };
    fetch();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await messageApi.sendMessage(selectedConversation.id, {
        content: newMessage.trim()
      });
      setNewMessage('');
      // Refresh messages
      const response = await messageApi.getMessages(selectedConversation.id);
      setMessages(response.messages || response.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await messageApi.deleteConversation(conversationId);
      setConversations(conversations.filter(c => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to delete conversation');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.participantName || conv.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List */}
      <div className="w-96 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6" />
            Messages
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <>
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
            </>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-center">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-2">Start a new conversation to begin messaging</p>
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {(conversation.participantName || conversation.name || 'U')[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.participantName || conversation.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conversation.id);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedConversation.participantName || selectedConversation.name}
              </h2>
              <p className="text-sm text-gray-500">Active now</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messageLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === 'current-user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.content || msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === 'current-user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}>
                        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
