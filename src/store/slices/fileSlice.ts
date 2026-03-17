import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

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

      const response = await api.post('/upload/chat-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteChatImage = createAsyncThunk(
  'file/deleteChatImage',
  async (key: string, { rejectWithValue }) => {
    try {
      await api.delete(`/upload/chat-image/${key}`);
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
