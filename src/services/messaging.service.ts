import apiClient from './api';
import { Conversation, Message, CreateMessageRequest, MarkAsReadRequest, PaginationParams } from './types';

export const messagingService = {
  // Conversation endpoints

  // POST /api/conversations
  createConversation: async (participantIds: string[]): Promise<Conversation> => {
    const response = await apiClient.post('/conversations', { participantIds });
    return response.data.data;
  },

  // GET /api/conversations
  getConversations: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/conversations', { params });
    return response.data;
  },

  // GET /api/conversations/:id
  getConversationById: async (id: string): Promise<Conversation> => {
    const response = await apiClient.get(`/conversations/${id}`);
    return response.data.data;
  },

  // DELETE /api/conversations/:id
  deleteConversation: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/conversations/${id}`);
    return response.data;
  },

  // Message endpoints

  // POST /api/messages
  sendMessage: async (conversationId: string, content: string, file?: File): Promise<Message> => {
    try {
      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      const response = await apiClient.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // GET /api/messages/:conversationId
  getMessages: async (conversationId: string, params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get(`/messages/${conversationId}`, { params });
    return response.data;
  },

  // PUT /api/messages/:id/read
  markAsRead: async (messageId: string): Promise<Message> => {
    const response = await apiClient.put(`/messages/${messageId}/read`, {});
    return response.data.data;
  },

  // Mark multiple messages as read
  markMultipleAsRead: async (messageIds: string[]): Promise<any> => {
    const response = await apiClient.put('/messages/read-multiple', { messageIds });
    return response.data;
  },

  // DELETE /api/messages/:id
  deleteMessage: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/messages/${id}`);
    return response.data;
  },

  // Get unread count for a conversation
  getUnreadCount: async (conversationId: string): Promise<number> => {
    const response = await apiClient.get(`/messages/${conversationId}/unread-count`);
    return response.data.data?.unreadCount || 0;
  }
};
