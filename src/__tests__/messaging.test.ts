import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/utils/api';
import { ConversationService, MessageService } from '@/services';

describe('Messaging Integration Tests', () => {
  let mockAdapter: MockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(api);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('ConversationService', () => {
    describe('createConversation', () => {
      it('should create a conversation successfully', async () => {
        const mockResponse = {
          success: true,
          data: {
            _id: 'conv-123',
            participants: ['user-1', 'user-2'],
            createdAt: new Date().toISOString(),
            lastMessage: null,
          },
        };

        mockAdapter.onPost('/api/conversations').reply(201, mockResponse);

        const result = await ConversationService.createConversation('user-2');

        expect(result.success).toBe(true);
        expect(result.data._id).toBe('conv-123');
        expect(result.data.participants).toHaveLength(2);
      });

      it('should fail when participant not found', async () => {
        mockAdapter.onPost('/api/conversations').reply(404, {
          success: false,
          message: 'User not found',
        });

        try {
          await ConversationService.createConversation('non-existent');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(404);
        }
      });
    });

    describe('getConversations', () => {
      it('should fetch all conversations', async () => {
        const mockResponse = {
          success: true,
          data: [
            {
              _id: 'conv-1',
              participants: ['user-1', 'user-2'],
              lastMessage: 'Hi there!',
              unreadCount: 2,
              lastMessageTime: new Date().toISOString(),
            },
            {
              _id: 'conv-2',
              participants: ['user-1', 'user-3'],
              lastMessage: 'How are you?',
              unreadCount: 0,
              lastMessageTime: new Date().toISOString(),
            },
          ],
        };

        mockAdapter.onGet('/api/conversations').reply(200, mockResponse);

        const result = await ConversationService.getConversations();

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);
        expect(result.data[0].unreadCount).toBe(2);
        expect(result.data[1].unreadCount).toBe(0);
      });

      it('should return empty array when no conversations exist', async () => {
        mockAdapter.onGet('/api/conversations').reply(200, {
          success: true,
          data: [],
        });

        const result = await ConversationService.getConversations();

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(0);
      });
    });

    describe('getConversationById', () => {
      it('should fetch conversation by ID', async () => {
        const mockResponse = {
          success: true,
          data: {
            _id: 'conv-123',
            participants: ['user-1', 'user-2'],
            lastMessage: 'Hello!',
            createdAt: new Date().toISOString(),
          },
        };

        mockAdapter.onGet('/api/conversations/conv-123').reply(200, mockResponse);

        const result = await ConversationService.getConversationById('conv-123');

        expect(result.success).toBe(true);
        expect(result.data._id).toBe('conv-123');
      });

      it('should fail when conversation not found', async () => {
        mockAdapter.onGet('/api/conversations/non-existent').reply(404, {
          success: false,
          message: 'Conversation not found',
        });

        try {
          await ConversationService.getConversationById('non-existent');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(404);
        }
      });
    });

    describe('deleteConversation', () => {
      it('should delete conversation successfully', async () => {
        mockAdapter.onDelete('/api/conversations/conv-123').reply(200, {
          success: true,
          message: 'Conversation deleted',
        });

        const result = await ConversationService.deleteConversation('conv-123');

        expect(result.success).toBe(true);
      });
    });
  });

  describe('MessageService', () => {
    describe('sendMessage', () => {
      it('should send message successfully', async () => {
        const messageData = {
          conversationId: 'conv-123',
          content: 'Hello!',
          messageType: 'text',
        };

        const mockResponse = {
          success: true,
          data: {
            _id: 'msg-123',
            ...messageData,
            senderId: 'user-1',
            timestamp: new Date().toISOString(),
            read: false,
          },
        };

        mockAdapter.onPost('/api/messages').reply(201, mockResponse);

        const result = await MessageService.sendMessage(messageData);

        expect(result.success).toBe(true);
        expect(result.data.content).toBe('Hello!');
        expect(result.data.read).toBe(false);
      });

      it('should fail with empty message content', async () => {
        const messageData = {
          conversationId: 'conv-123',
          content: '',
          messageType: 'text',
        };

        mockAdapter.onPost('/api/messages').reply(400, {
          success: false,
          message: 'Message content cannot be empty',
        });

        try {
          await MessageService.sendMessage(messageData);
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should fail when conversation not found', async () => {
        const messageData = {
          conversationId: 'non-existent',
          content: 'Hello!',
          messageType: 'text',
        };

        mockAdapter.onPost('/api/messages').reply(404, {
          success: false,
          message: 'Conversation not found',
        });

        try {
          await MessageService.sendMessage(messageData);
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(404);
        }
      });
    });

    describe('getMessages', () => {
      it('should fetch messages for conversation', async () => {
        const mockResponse = {
          success: true,
          data: [
            {
              _id: 'msg-1',
              conversationId: 'conv-123',
              senderId: 'user-1',
              content: 'Hello!',
              timestamp: new Date().toISOString(),
              read: true,
            },
            {
              _id: 'msg-2',
              conversationId: 'conv-123',
              senderId: 'user-2',
              content: 'Hi there!',
              timestamp: new Date().toISOString(),
              read: false,
            },
          ],
        };

        mockAdapter.onGet('/api/messages/conv-123').reply(200, mockResponse);

        const result = await MessageService.getMessages('conv-123');

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);
        expect(result.data[0].content).toBe('Hello!');
        expect(result.data[1].read).toBe(false);
      });

      it('should return empty array when no messages exist', async () => {
        mockAdapter.onGet('/api/messages/conv-123').reply(200, {
          success: true,
          data: [],
        });

        const result = await MessageService.getMessages('conv-123');

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(0);
      });

      it('should fail when conversation not found', async () => {
        mockAdapter.onGet('/api/messages/non-existent').reply(404, {
          success: false,
          message: 'Conversation not found',
        });

        try {
          await MessageService.getMessages('non-existent');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(404);
        }
      });
    });

    describe('markMessageAsRead', () => {
      it('should mark message as read', async () => {
        mockAdapter.onPatch('/api/messages/msg-123/read').reply(200, {
          success: true,
          data: {
            _id: 'msg-123',
            read: true,
          },
        });

        const result = await MessageService.markMessageAsRead('msg-123');

        expect(result.success).toBe(true);
        expect(result.data.read).toBe(true);
      });

      it('should fail when message not found', async () => {
        mockAdapter.onPatch('/api/messages/non-existent/read').reply(404, {
          success: false,
          message: 'Message not found',
        });

        try {
          await MessageService.markMessageAsRead('non-existent');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(404);
        }
      });
    });

    describe('deleteMessage', () => {
      it('should delete message successfully', async () => {
        mockAdapter.onDelete('/api/messages/msg-123').reply(200, {
          success: true,
          message: 'Message deleted',
        });

        const result = await MessageService.deleteMessage('msg-123');

        expect(result.success).toBe(true);
      });

      it('should fail when message not found', async () => {
        mockAdapter.onDelete('/api/messages/non-existent').reply(404, {
          success: false,
          message: 'Message not found',
        });

        try {
          await MessageService.deleteMessage('non-existent');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response.status).toBe(404);
        }
      });
    });

    describe('bulkMarkAsRead', () => {
      it('should mark multiple messages as read', async () => {
        const messageIds = ['msg-1', 'msg-2', 'msg-3'];

        mockAdapter.onPost('/api/messages/bulk-read').reply(200, {
          success: true,
          data: {
            markedCount: 3,
          },
        });

        const result = await MessageService.bulkMarkAsRead(messageIds);

        expect(result.success).toBe(true);
        expect(result.data.markedCount).toBe(3);
      });

      it('should handle empty array', async () => {
        mockAdapter.onPost('/api/messages/bulk-read').reply(200, {
          success: true,
          data: {
            markedCount: 0,
          },
        });

        const result = await MessageService.bulkMarkAsRead([]);

        expect(result.success).toBe(true);
        expect(result.data.markedCount).toBe(0);
      });
    });
  });
});
