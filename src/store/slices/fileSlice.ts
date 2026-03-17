import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface FileMetadata {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface FileState {
  uploadedFiles: FileMetadata[];
  currentFile: FileMetadata | null;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';

// Async thunks
export const uploadChatImage = createAsyncThunk(
  'file/uploadChatImage',
  async (
    { file, conversationId }: { file: File; conversationId: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('conversationId', conversationId);

      const response = await fetch(`${API_BASE}/upload/chat-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        return rejectWithValue('Failed to upload image');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteChatImage = createAsyncThunk(
  'file/deleteChatImage',
  async (key: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/upload/chat-image/${key}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to delete image');
      }

      return key;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: FileState = {
  uploadedFiles: [],
  currentFile: null,
  uploading: false,
  uploadProgress: 0,
  error: null,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadError: (state) => {
      state.error = null;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Chat Image
      .addCase(uploadChatImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadChatImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.currentFile = action.payload;
        state.uploadedFiles.unshift(action.payload);
      })
      .addCase(uploadChatImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })

      // Delete Chat Image
      .addCase(deleteChatImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(deleteChatImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedFiles = state.uploadedFiles.filter((f) => f.key !== action.payload);
        if (state.currentFile?.key === action.payload) {
          state.currentFile = null;
        }
      })
      .addCase(deleteChatImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUploadProgress, clearUploadError, clearCurrentFile } = fileSlice.actions;
export default fileSlice.reducer;
