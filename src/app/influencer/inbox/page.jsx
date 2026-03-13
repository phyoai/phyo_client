'use client'
import React, { Suspense, useState, useEffect } from 'react';
import InboxPage from '@/components/inbox/InboxPage'
import { conversationAPI } from '@/utils/api';
import { useSocket } from '@/app/context/SocketContext';

function InfluencerInboxContent() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, onMessage } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await conversationAPI.getAll();
        setConversations(data.data || data || []);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Real-time message updates via socket
  useEffect(() => {
    if (!socket || conversations.length === 0) return;

    const unsubscribers = [];
    conversations.forEach(conv => {
      const unsub = onMessage(conv._id || conv.id, (message) => {
        setConversations(prev =>
          prev.map(c =>
            (c._id || c.id) === (conv._id || conv.id)
              ? { ...c, lastMessage: message.content, timestamp: new Date().toLocaleTimeString() }
              : c
          )
        );
      });
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach(unsub => unsub?.());
  }, [socket, conversations, onMessage]);

  return <InboxPage conversations={conversations} />;
}

export default function InfluencerInbox() {
  return (
    <div>
      <Suspense fallback={
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Left Sidebar Skeleton */}
          <div className="w-full sm:w-[30%] bg-neutral-base border-r border-gray-200 flex flex-col overflow-hidden">
            {/* Header Skeleton */}
            <div className="flex-shrink-0 bg-neutral-base border-b border-gray-200">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <div className="h-7 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              {/* Tabs Skeleton */}
              <div className="flex border-b border-gray-200">
                <div className="flex-1 py-3 px-4 flex items-center justify-center">
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="flex-1 py-3 px-4 flex items-center justify-center">
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
            {/* Conversations List Skeleton */}
            <div className="flex-1 overflow-y-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Skeleton */}
          <div className="flex-1 flex items-center justify-center bg-neutral-base">
            <div className="text-center">
              <div className="w-64 h-32 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      }>
        <InfluencerInboxContent/>
      </Suspense>
    </div>
  );
}
