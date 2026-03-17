import { useDispatch, useSelector } from 'react-redux';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  deleteConversation,
  selectConversation,
  addMessage,
} from '@/store/slices/messagingSlice';
import { useCallback } from 'react';

/**
 * Custom hook for messaging operations
 * Provides easy access to messaging state and dispatch actions
 */
export const useMessaging = () => {
  const dispatch = useDispatch();
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    unreadCount,
  } = useSelector((state: any) => state.messaging);

  const fetchConversations = useCallback(() => {
    dispatch(getConversations() as any);
  }, [dispatch]);

  const createNewConversation = useCallback(
    (participantId: string) => {
      dispatch(createConversation(participantId) as any);
    },
    [dispatch]
  );

  const fetchMessages = useCallback(
    (conversationId: string) => {
      dispatch(getMessages(conversationId) as any);
    },
    [dispatch]
  );

  const sendNewMessage = useCallback(
    (conversationId: string, content: string, messageType?: string) => {
      dispatch(sendMessage({ conversationId, content, messageType }) as any);
    },
    [dispatch]
  );

  const markMessageAsRead = useCallback(
    (messageId: string) => {
      dispatch(markAsRead(messageId) as any);
    },
    [dispatch]
  );

  const removeMessage = useCallback(
    (messageId: string) => {
      dispatch(deleteMessage(messageId) as any);
    },
    [dispatch]
  );

  const removeConversation = useCallback(
    (conversationId: string) => {
      dispatch(deleteConversation(conversationId) as any);
    },
    [dispatch]
  );

  const selectNewConversation = useCallback(
    (conversation: any) => {
      dispatch(selectConversation(conversation) as any);
    },
    [dispatch]
  );

  const addNewMessage = useCallback(
    (message: any) => {
      dispatch(addMessage(message) as any);
    },
    [dispatch]
  );

  return {
    // State
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    unreadCount,
    // Actions
    fetchConversations,
    createNewConversation,
    fetchMessages,
    sendNewMessage,
    markMessageAsRead,
    removeMessage,
    removeConversation,
    selectNewConversation,
    addNewMessage,
  };
};
