/**
 * Conversation Service
 * Handles all conversation-related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import { CONVERSATION_ENDPOINTS } from "@/utils/api-endpoints";

export interface IConversation {
  _id: string;
  participants: string[];
  lastMessage?: any;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationPayload {
  participantId: string;
}

export class ConversationService {
  /**
   * Create a new conversation
   */
  static async createConversation(
    payload: CreateConversationPayload
  ): Promise<APIResponse<IConversation>> {
    return apiClient.post(CONVERSATION_ENDPOINTS.CREATE, payload);
  }

  /**
   * Get all conversations for current user
   */
  static async getConversations(): Promise<APIResponse<IConversation[]>> {
    return apiClient.get(CONVERSATION_ENDPOINTS.GET_ALL) as Promise<APIResponse<IConversation[]>>;
  }

  /**
   * Get specific conversation by ID
   */
  static async getConversationById(
    conversationId: string
  ): Promise<APIResponse<IConversation>> {
    return apiClient.get(
      CONVERSATION_ENDPOINTS.GET_BY_ID(conversationId)
    ) as Promise<APIResponse<IConversation>>;
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(
    conversationId: string
  ): Promise<APIResponse<{ message: string }>> {
    return apiClient.delete(
      CONVERSATION_ENDPOINTS.DELETE(conversationId)
    ) as Promise<APIResponse<{ message: string }>>;
  }
}
