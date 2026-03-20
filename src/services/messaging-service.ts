/**
 * Messaging Service
 * Handles all messaging and conversation related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import {
  CONVERSATION_ENDPOINTS,
  MESSAGE_ENDPOINTS,
  MESSAGES_NOTIFICATIONS_ENDPOINTS,
} from "@/utils/api-endpoints";

/**
 * Messaging Types
 */
export interface Conversation {
  id: string;
  participantId: string;
  participantName?: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateConversationPayload {
  participantId: string;
  initialMessage?: string;
}

export interface SendMessagePayload {
  content: string;
  attachments?: string[];
}

/**
 * Messaging Service
 */
export class MessagingService {
  /**
   * Create Conversation
   */
  static async createConversation(
    payload: CreateConversationPayload
  ): Promise<APIResponse<Conversation>> {
    return apiClient.post(
      CONVERSATION_ENDPOINTS.CREATE,
      payload
    );
  }

  /**
   * Get All Conversations
   */
  static async getConversations(): Promise<
    APIResponse<Conversation[]>
  > {
    return apiClient.get(CONVERSATION_ENDPOINTS.GET_ALL);
  }

  /**
   * Get Conversation by ID
   */
  static async getConversationById(
    id: string
  ): Promise<APIResponse<Conversation>> {
    return apiClient.get(CONVERSATION_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Delete Conversation
   */
  static async deleteConversation(id: string): Promise<APIResponse> {
    return apiClient.delete(CONVERSATION_ENDPOINTS.DELETE(id));
  }

  /**
   * Send Message
   */
  static async sendMessage(
    conversationId: string,
    payload: SendMessagePayload
  ): Promise<APIResponse<Message>> {
    return apiClient.post(
      MESSAGE_ENDPOINTS.SEND,
      {
        conversationId,
        ...payload,
      }
    );
  }

  /**
   * Get Messages by Conversation
   */
  static async getMessages(
    conversationId: string
  ): Promise<APIResponse<Message[]>> {
    return apiClient.get(
      MESSAGE_ENDPOINTS.GET_BY_CONVERSATION(conversationId)
    );
  }

  /**
   * Mark Message as Read
   */
  static async markMessageAsRead(
    messageId: string
  ): Promise<APIResponse> {
    return apiClient.patch(
      MESSAGE_ENDPOINTS.MARK_AS_READ(messageId),
      {}
    );
  }

  /**
   * Delete Message
   */
  static async deleteMessage(messageId: string): Promise<APIResponse> {
    return apiClient.delete(MESSAGE_ENDPOINTS.DELETE(messageId));
  }

  /**
   * Combined - Get Notifications
   */
  static async getNotifications(): Promise<APIResponse> {
    return apiClient.get(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.GET_NOTIFICATIONS
    );
  }

  /**
   * Combined - Create Conversation
   */
  static async createConversationCombined(
    payload: CreateConversationPayload
  ): Promise<APIResponse<Conversation>> {
    return apiClient.post(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.CREATE_CONVERSATION,
      payload
    );
  }

  /**
   * Combined - Get Conversations
   */
  static async getConversationsCombined(): Promise<
    APIResponse<Conversation[]>
  > {
    return apiClient.get(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.GET_CONVERSATIONS
    );
  }

  /**
   * Combined - Get Conversation Messages
   */
  static async getConversationMessages(
    conversationId: string
  ): Promise<APIResponse<Message[]>> {
    return apiClient.get(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.GET_CONVERSATION_MESSAGES(
        conversationId
      )
    );
  }

  /**
   * Combined - Send Message
   */
  static async sendMessageCombined(
    conversationId: string,
    payload: SendMessagePayload
  ): Promise<APIResponse<Message>> {
    return apiClient.post(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.SEND_MESSAGE(
        conversationId
      ),
      payload
    );
  }

  /**
   * Combined - Get Unread Count
   */
  static async getUnreadCount(
    conversationId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.GET_UNREAD_COUNT(
        conversationId
      )
    );
  }

  /**
   * Combined - Mark Conversation as Read
   */
  static async markConversationAsRead(
    conversationId: string
  ): Promise<APIResponse> {
    return apiClient.put(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.MARK_CONVERSATION_AS_READ(
        conversationId
      ),
      {}
    );
  }

  /**
   * Mark Notification as Read
   */
  static async markNotificationAsRead(
    notificationId: string
  ): Promise<APIResponse> {
    return apiClient.put(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.MARK_NOTIFICATION_AS_READ(
        notificationId
      ),
      {}
    );
  }

  /**
   * Delete Notification
   */
  static async deleteNotification(
    notificationId: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      MESSAGES_NOTIFICATIONS_ENDPOINTS.DELETE_NOTIFICATION(
        notificationId
      )
    );
  }
}

export default MessagingService;
