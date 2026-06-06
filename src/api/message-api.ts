/**
 * Message API Utility Functions
 * Provides typed wrapper functions for messaging and conversations
 *
 * Usage:
 * import { messageApi } from '@/api/message-api';
 * const conversations = await messageApi.getConversations({ page: 1, limit: 20 });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Message & Conversation Types
 */
export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  attachments?: Array<{
    id: string;
    type: 'image' | 'file' | 'video';
    url: string;
    name: string;
  }>;
  isRead: boolean;
  createdAt: string;
}

export interface IConversation {
  id: string;
  participantIds: string[];
  participants: Array<{
    id: string;
    name: string;
    image?: string;
    role: 'brand' | 'influencer' | 'service_provider';
  }>;
  lastMessage?: IMessage;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

export interface IMessagesResponse {
  data: IMessage[];
  pagination: IPagination;
}

export interface IConversationsResponse {
  data: IConversation[];
  pagination: IPagination;
}

const defaultPagination: IPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/**
 * Message API service
 * Handles all messaging and conversation operations
 */
export const messageApi = {
  /**
   * Get all conversations for the current user
   *
   * @param params - Pagination parameters
   * @returns Promise resolving to paginated conversations
   *
   * @example
   * const result = await messageApi.getConversations({ page: 1, limit: 20 });
   */
  getConversations: async (
    params?: Partial<{ page: number; limit: number }>
  ): Promise<{ conversations: IConversation[]; pagination: IPagination }> => {
    try {
      const response = await api.get<any>(
        '/messages/conversations',
        { params }
      );

      const payload = response.data;

      // Backend returns: { message: "...", data: [...conversations] }
      const conversationsArray = Array.isArray(payload?.data)
        ? payload.data.map((conv: any) => ({
            id: conv._id || conv.id,
            participantIds: conv.participantIds || [],
            participants: conv.participants || [],
            lastMessage: typeof conv.lastMessage === 'string'
              ? { content: conv.lastMessage, createdAt: conv.lastMessageTime }
              : conv.lastMessage,
            lastMessageAt: conv.lastMessageTime || conv.lastMessageAt || conv.createdAt,
            unreadCount: conv.unreadCount ?? 0,
            createdAt: conv.createdAt,
          }))
        : [];

      return {
        conversations: conversationsArray as IConversation[],
        pagination: defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch conversations';
      console.error('Error in getConversations:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get a specific conversation
   *
   * @param conversationId - The conversation ID
   * @returns Promise resolving to conversation with latest messages
   *
   * @example
   * const conversation = await messageApi.getConversation('conv_123');
   */
  getConversation: async (conversationId: string): Promise<IConversation> => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Invalid conversation ID');
      }

      const response = await api.get<IApiResponse<IConversation>>(
        `/messages/conversations/${conversationId.trim()}`
      );

      if (!response.data.data) {
        throw new Error('Conversation not found');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch conversation';
      console.error('Error in getConversation:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Create a new conversation
   *
   * @param participantIds - IDs of participants to add to conversation
   * @returns Promise resolving to created conversation
   *
   * @example
   * const conversation = await messageApi.createConversation(['user_123', 'user_456']);
   */
  createConversation: async (participantIds: string[]): Promise<IConversation> => {
    try {
      if (!participantIds || participantIds.length === 0) {
        throw new Error('At least one participant ID is required');
      }

      const response = await api.post<IApiResponse<IConversation>>(
        '/messages/conversations',
        { participantIds }
      );

      if (!response.data.data) {
        throw new Error('Failed to create conversation');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create conversation';
      console.error('Error in createConversation:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Create a new conversation (handoff-compatible)
   *
   * Handoff API: POST /messages/conversations
   * Payload: { participantId, message }
   */
  createConversationWithMessage: async (
    participantId: string,
    message?: string
  ): Promise<IConversation> => {
    try {
      if (!participantId || typeof participantId !== 'string') {
        throw new Error('Invalid participant ID');
      }

      // API handoff doc: response is payload?.conversation || payload?.data?.conversation || payload?.data || payload
      const response = await api.post<any>(
        '/messages/conversations',
        { participantId, ...(message ? { message } : {}) }
      );

      const payload = response.data;
      const conv = payload?.conversation || payload?.data?.conversation || payload?.data || payload;
      if (!conv) {
        throw new Error('Failed to create conversation');
      }

      return conv;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create conversation';
      console.error('Error in createConversationWithMessage:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a conversation
   *
   * @param conversationId - The conversation ID to delete
   * @returns Promise resolving to deletion response
   *
   * @example
   * await messageApi.deleteConversation('conv_123');
   */
  deleteConversation: async (conversationId: string): Promise<{ message: string }> => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Invalid conversation ID');
      }

      const response = await api.delete<IApiResponse<{ message: string }>>(
        `/messages/conversations/${conversationId.trim()}`
      );

      return response.data?.data ?? { message: 'Conversation deleted' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete conversation';
      console.error('Error in deleteConversation:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get messages in a conversation
   *
   * @param conversationId - The conversation ID
   * @param params - Pagination parameters
   * @returns Promise resolving to paginated messages
   *
   * @example
   * const result = await messageApi.getMessages('conv_123', { page: 1, limit: 50 });
   */
  getMessages: async (
    conversationId: string,
    params?: Partial<{ page: number; limit: number }>
  ): Promise<{ messages: IMessage[]; pagination: IPagination }> => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Invalid conversation ID');
      }

      // API handoff doc: ChatBoxScreen loads messages via GET /messages/:conversationId
      const response = await api.get<any>(
        `/messages/${conversationId.trim()}`,
        { params }
      );

      const payload = response.data;

      // Backend returns: { message: "...", data: { messages: [...], pagination: {...} } }
      // Multi-fallback: messages can be at data.messages, messages, data.items, data, or payload itself
      const rawList: any[] =
        payload?.data?.messages ??
        payload?.messages ??
        payload?.data?.items ??
        (Array.isArray(payload?.data) ? payload.data : null) ??
        (Array.isArray(payload) ? payload : []);

      const messagesArray = rawList.map((msg: any) => ({
        id: msg._id || msg.id,
        _id: msg._id || msg.id,
        conversationId: msg.conversationId,
        // Keep senderId as-is so InboxPage can extract _id from object or string
        senderId: msg.senderId,
        senderName: typeof msg.senderId === 'object' ? msg.senderId.name : '',
        senderImage: typeof msg.senderId === 'object' ? msg.senderId.profilePicture || msg.senderId.image : '',
        content: msg.content,
        attachments: msg.attachments || [],
        isRead: msg.isRead ?? false,
        isDelivered: msg.isDelivered ?? true,
        deliveredAt: msg.deliveredAt ?? null,
        timestamp: msg.timestamp || msg.createdAt,
        createdAt: msg.createdAt || msg.timestamp,
        messageType: msg.messageType || 'text',
      }));

      return {
        messages: messagesArray as IMessage[],
        pagination: payload?.data?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch messages';
      console.error('Error in getMessages:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Send a message to a conversation
   *
   * @param conversationId - The conversation ID
   * @param content - The message content
   * @returns Promise resolving to sent message
   *
   * @example
   * const message = await messageApi.sendMessage('conv_123', 'Hello!');
   */
  sendMessage: async (conversationId: string, content: string): Promise<IMessage> => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Invalid conversation ID');
      }
      if (!content || typeof content !== 'string') {
        throw new Error('Message content is required');
      }

      // API handoff doc: POST /messages with { conversationId, content, message }
      // Response: payload?.message || payload?.data?.message || payload?.data || payload
      const trimmed = content.trim();
      const response = await api.post<any>('/messages', {
        conversationId: conversationId.trim(),
        content: trimmed,
        message: trimmed,
      });

      const payload = response.data;
      const raw = payload?.message || payload?.data?.message || payload?.data || payload;
      if (!raw) {
        throw new Error('Failed to send message');
      }
      // Normalise to same shape as getMessages
      return {
        id: raw._id || raw.id,
        _id: raw._id || raw.id,
        conversationId: raw.conversationId,
        senderId: raw.senderId,
        content: raw.content,
        attachments: raw.attachments || [],
        isRead: raw.isRead ?? false,
        isDelivered: raw.isDelivered ?? true,
        deliveredAt: raw.deliveredAt ?? null,
        timestamp: raw.timestamp || raw.createdAt,
        createdAt: raw.createdAt || raw.timestamp,
        messageType: raw.messageType || 'text',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to send message';
      console.error('Error in sendMessage:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Send a message with file attachment
   *
   * @param conversationId - The conversation ID
   * @param content - The message content
   * @param file - File to attach
   * @returns Promise resolving to sent message
   *
   * @example
   * const message = await messageApi.sendMessageWithFile('conv_123', 'Check this', file);
   */
  sendMessageWithFile: async (
    conversationId: string,
    content: string,
    file: File
  ): Promise<IMessage> => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Invalid conversation ID');
      }
      if (!file || !(file instanceof File)) {
        throw new Error('Valid file is required');
      }

      // API handoff doc: POST /messages/with-file
      // Multipart: { conversationId, message, file }
      const formData = new FormData();
      formData.append('conversationId', conversationId.trim());
      formData.append('message', content || '');
      formData.append('file', file);

      const response = await api.post<IApiResponse<IMessage>>('/messages/with-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.data.data) {
        throw new Error('Failed to send message with file');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to send message';
      console.error('Error in sendMessageWithFile:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Mark a message as read
   *
   * @param messageId - The message ID
   * @returns Promise resolving to updated message
   *
   * @example
   * await messageApi.markMessageAsRead('msg_123');
   */
  markMessageAsRead: async (messageId: string): Promise<IMessage> => {
    try {
      if (!messageId || typeof messageId !== 'string') {
        throw new Error('Invalid message ID');
      }

      // API handoff doc: response is payload?.message || payload?.data?.message || payload?.data || payload
      const response = await api.patch<any>(
        `/messages/${messageId.trim()}/read`,
        {}
      );

      const payload = response.data;
      const msg = payload?.message || payload?.data?.message || payload?.data || payload;
      if (!msg) {
        throw new Error('Failed to mark message as read');
      }

      return msg;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to mark as read';
      console.error('Error in markMessageAsRead:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a message
   *
   * @param messageId - The message ID to delete
   * @returns Promise resolving to deletion response
   *
   * @example
   * await messageApi.deleteMessage('msg_123');
   */
  deleteMessage: async (messageId: string): Promise<{ message: string }> => {
    try {
      if (!messageId || typeof messageId !== 'string') {
        throw new Error('Invalid message ID');
      }

      const response = await api.delete<IApiResponse<{ message: string }>>(
        `/messages/${messageId.trim()}`
      );

      return response.data?.data ?? { message: 'Message deleted' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete message';
      console.error('Error in deleteMessage:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};

export default messageApi;
