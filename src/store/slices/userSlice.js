import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// Async thunks for user management
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Determine if it's FormData (for file uploads) or JSON
      const isFormData = profileData instanceof FormData;

      const config = {};
      if (isFormData) {
        // For FormData, let axios/fetch handle the Content-Type
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await api.patch('/users/profile', profileData, config);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ q, type, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const params = {
        q,
        ...(type && { type }),
        page,
        limit,
      };

      const response = await api.get('/users/search', { params });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search users');
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'User not found');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/users/profile');
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete account');
    }
  }
);

const initialState = {
  profile: null,
  role: null, // "brand" or "influencer" or "service_provider"
  searchResults: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.role = null;
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        if (action.payload?.type) {
          state.role = action.payload.type;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        if (action.payload?.type) {
          state.role = action.payload.type;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search Users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = [];
      });

    // Get User By ID
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
        state.role = null;
        state.searchResults = [];
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserProfile, setUserRole, clearUserData, clearError } = userSlice.actions;
export default userSlice.reducer;
