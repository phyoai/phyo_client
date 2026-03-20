import io, { Socket } from 'socket.io-client';

interface WebSocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface WebSocketNotification {
  id: string;
  userId: string;
  type: 'campaign' | 'message' | 'application' | 'offer' | 'system';
  title: string;
  description?: string;
  data?: Record<string, any>;
  createdAt: string;
}

interface WebSocketEvent {
  event: string;
  data: any;
  timestamp: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Initialize WebSocket connection
   */
  connect(token: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

      try {
        this.socket = io(wsUrl, {
          auth: {
            token,
            userId,
          },
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionAttempts: this.maxReconnectAttempts,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            reject(error);
          }
        });

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error);
        });

        // Set a timeout for connection attempt
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  // ========== MESSAGING ==========

  /**
   * Listen for new messages
   */
  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.socket?.on('message:new', callback);
  }

  /**
   * Listen for message read status
   */
  onMessageRead(callback: (data: { messageId: string; userId: string }) => void): void {
    this.socket?.on('message:read', callback);
  }

  /**
   * Listen for typing indicators
   */
  onUserTyping(
    callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void
  ): void {
    this.socket?.on('user:typing', callback);
  }

  /**
   * Emit typing indicator
   */
  emitTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('user:typing', { conversationId, isTyping });
  }

  /**
   * Emit message read
   */
  emitMessageRead(messageId: string): void {
    this.socket?.emit('message:read', { messageId });
  }

  /**
   * Join conversation room
   */
  joinConversation(conversationId: string): void {
    this.socket?.emit('conversation:join', { conversationId });
  }

  /**
   * Leave conversation room
   */
  leaveConversation(conversationId: string): void {
    this.socket?.emit('conversation:leave', { conversationId });
  }

  // ========== NOTIFICATIONS ==========

  /**
   * Listen for new notifications
   */
  onNotification(callback: (notification: WebSocketNotification) => void): void {
    this.socket?.on('notification:new', callback);
  }

  /**
   * Listen for notification read status
   */
  onNotificationRead(callback: (notificationId: string) => void): void {
    this.socket?.on('notification:read', callback);
  }

  /**
   * Emit notification read
   */
  emitNotificationRead(notificationId: string): void {
    this.socket?.emit('notification:read', { notificationId });
  }

  // ========== CAMPAIGNS ==========

  /**
   * Listen for campaign updates
   */
  onCampaignUpdate(callback: (data: any) => void): void {
    this.socket?.on('campaign:update', callback);
  }

  /**
   * Listen for campaign status changes
   */
  onCampaignStatusChange(callback: (data: { campaignId: string; status: string }) => void): void {
    this.socket?.on('campaign:status-changed', callback);
  }

  /**
   * Listen for application notifications
   */
  onApplicationUpdate(
    callback: (data: { applicationId: string; status: string; campaignId: string }) => void
  ): void {
    this.socket?.on('application:update', callback);
  }

  /**
   * Listen for counter-offer notifications
   */
  onCounterOffer(callback: (data: any) => void): void {
    this.socket?.on('negotiation:counter-offer', callback);
  }

  // ========== USER STATUS ==========

  /**
   * Listen for user online status
   */
  onUserOnline(callback: (userId: string) => void): void {
    this.socket?.on('user:online', callback);
  }

  /**
   * Listen for user offline status
   */
  onUserOffline(callback: (userId: string) => void): void {
    this.socket?.on('user:offline', callback);
  }

  /**
   * Emit user online status
   */
  emitUserOnline(): void {
    this.socket?.emit('user:online');
  }

  /**
   * Emit user offline status
   */
  emitUserOffline(): void {
    this.socket?.emit('user:offline');
  }

  // ========== FILE UPLOADS ==========

  /**
   * Listen for file upload progress
   */
  onFileUploadProgress(callback: (data: { progress: number; fileId: string }) => void): void {
    this.socket?.on('file:upload-progress', callback);
  }

  /**
   * Listen for file upload completion
   */
  onFileUploadComplete(callback: (data: { fileId: string; url: string }) => void): void {
    this.socket?.on('file:upload-complete', callback);
  }

  /**
   * Emit file upload start
   */
  emitFileUploadStart(fileId: string, filename: string, size: number): void {
    this.socket?.emit('file:upload-start', { fileId, filename, size });
  }

  /**
   * Emit file upload progress
   */
  emitFileUploadProgress(fileId: string, progress: number): void {
    this.socket?.emit('file:upload-progress', { fileId, progress });
  }

  // ========== ANALYTICS ==========

  /**
   * Listen for real-time analytics updates
   */
  onAnalyticsUpdate(callback: (data: any) => void): void {
    this.socket?.on('analytics:update', callback);
  }

  // ========== GENERIC LISTENERS ==========

  /**
   * Listen for any event
   */
  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  /**
   * Emit any event
   */
  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.socket?.removeAllListeners(event);
    } else {
      this.socket?.removeAllListeners();
    }
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();

export default websocketService;
