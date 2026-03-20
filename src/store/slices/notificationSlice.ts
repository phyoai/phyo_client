import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface Notification {
  id: string;
  userId: string;
  type: 'campaign' | 'message' | 'application' | 'offer' | 'system';
  title: string;
  description?: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

interface NotificationPreference {
  emailNotifications: boolean;
  pushNotifications: boolean;
  campaignUpdates: boolean;
  messages: boolean;
  applications: boolean;
  offers: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    campaignUpdates: true,
    messages: true,
    applications: true,
    offers: true,
  },
  loading: false,
  error: null,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// Async Thunks
export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/notifications', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const getUnreadNotifications = createAsyncThunk(
  'notification/getUnreadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/notifications/unread');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.patch('/notifications/read-all');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const getNotificationPreferences = createAsyncThunk(
  'notification/getPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/notifications/preferences');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch preferences');
    }
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'notification/updatePreferences',
  async (preferences: Partial<NotificationPreference>, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/notifications/preferences', preferences);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    // Get Notifications
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Unread Notifications
    builder
      .addCase(getUnreadNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.unreadCount = action.payload.length;
        } else {
          state.unreadCount = action.payload?.count || 0;
        }
      })
      .addCase(getUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark as Read
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Mark All as Read
    builder
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.read = true));
        state.unreadCount = 0;
        state.successMessage = 'All notifications marked as read';
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n.id === action.payload);
        if (index !== -1) {
          if (!state.notifications[index].read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
        state.successMessage = 'Notification deleted';
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Get Preferences
    builder
      .addCase(getNotificationPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(getNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Preferences
    builder
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = { ...state.preferences, ...action.payload };
        state.successMessage = 'Notification preferences updated';
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
