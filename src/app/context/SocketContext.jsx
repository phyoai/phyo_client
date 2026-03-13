'use client'

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messageListenersRef = useRef(new Map());
  const typingListenersRef = useRef(new Map());

  useEffect(() => {
    if (!token || typeof window === 'undefined') return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'https://api.phyo.ai';

    const newSocket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Don't block HTTP requests if socket fails to connect
      setIsConnected(false);
    });

    // Message events
    newSocket.on('message-received', (message) => {
      console.log('Message received:', message);
      // Dispatch to registered listeners for this conversation
      const conversationId = message.conversationId;
      if (messageListenersRef.current.has(conversationId)) {
        const listeners = messageListenersRef.current.get(conversationId);
        listeners.forEach(callback => callback(message));
      }
    });

    // Typing indicators
    newSocket.on('user-typing', ({ conversationId, userId, userName }) => {
      if (typingListenersRef.current.has(conversationId)) {
        const listeners = typingListenersRef.current.get(conversationId);
        listeners.forEach(callback => callback({ userId, userName, typing: true }));
      }
    });

    newSocket.on('stop-typing', ({ conversationId, userId }) => {
      if (typingListenersRef.current.has(conversationId)) {
        const listeners = typingListenersRef.current.get(conversationId);
        listeners.forEach(callback => callback({ userId, typing: false }));
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Emit helpers
  const joinConversation = useCallback((conversationId) => {
    if (socket) {
      socket.emit('join-conversation', { conversationId });
      console.log('Joined conversation:', conversationId);
    }
  }, [socket]);

  const leaveConversation = useCallback((conversationId) => {
    if (socket) {
      socket.emit('leave-conversation', { conversationId });
      console.log('Left conversation:', conversationId);
    }
  }, [socket]);

  const sendMessage = useCallback((conversationId, content, type = 'text') => {
    if (socket) {
      socket.emit('send-message', { conversationId, content, type });
      console.log('Message sent:', { conversationId, content });
    }
  }, [socket]);

  const emitTyping = useCallback((conversationId) => {
    if (socket) {
      socket.emit('user-typing', { conversationId });
    }
  }, [socket]);

  const emitStopTyping = useCallback((conversationId) => {
    if (socket) {
      socket.emit('stop-typing', { conversationId });
    }
  }, [socket]);

  // Register/unregister message listeners
  const onMessage = useCallback((conversationId, callback) => {
    if (!messageListenersRef.current.has(conversationId)) {
      messageListenersRef.current.set(conversationId, []);
    }
    messageListenersRef.current.get(conversationId).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = messageListenersRef.current.get(conversationId);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  // Register/unregister typing listeners
  const onTyping = useCallback((conversationId, callback) => {
    if (!typingListenersRef.current.has(conversationId)) {
      typingListenersRef.current.set(conversationId, []);
    }
    typingListenersRef.current.get(conversationId).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = typingListenersRef.current.get(conversationId);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const value = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    emitTyping,
    emitStopTyping,
    onMessage,
    onTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
