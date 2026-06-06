import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface MessagingState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: MessagingState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

// Async Thunks
export const getConversations = createAsyncThunk(
  'messaging/getConversations',
  async (_, { rejectWithValue }) => {
    try {
      // API handoff doc: conversation list is `/messages/conversations` (quirk to preserve).
      const response = await api.get('/messages/conversations');
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch conversations');
    }
  }
);

export const createConversation = createAsyncThunk(
  'messaging/createConversation',
  async (participantId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages/conversations', { participantId });
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create conversation');
    }
  }
);

export const getMessages = createAsyncThunk(
  'messaging/getMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messaging/sendMessage',
  async (
    { conversationId, content, messageType }: { conversationId: string; content: string; messageType?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/messages', {
        conversationId,
        content,
        messageType: messageType || 'text',
      });
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messaging/markAsRead',
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark as read');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messaging/deleteMessage',
  async (messageId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/messages/${messageId}`);
      return { success: true, messageId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete message');
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'messaging/deleteConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/messages/conversations/${conversationId}`);
      return { success: true, conversationId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete conversation');
    }
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Conversations
    builder
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload || [];
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Conversation
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations.push(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Messages
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark as Read
    builder
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedConversation) {
          state.selectedConversation.unreadCount = 0;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Message
    builder
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter((msg) => msg.id !== action.payload.messageId);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Conversation
    builder
      .addCase(deleteConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = state.conversations.filter(
          (conv) => conv.id !== action.payload.conversationId
        );
        state.messages = [];
        state.selectedConversation = null;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectConversation, addMessage, clearError } = messagingSlice.actions;
export default messagingSlice.reducer;
