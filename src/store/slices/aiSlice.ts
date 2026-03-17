import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AIState {
  aiResults: any[];
  selectedInfluencer: any | null;
  reelData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  aiResults: [],
  selectedInfluencer: null,
  reelData: null,
  loading: false,
  error: null,
};

// Async Thunks
export const searchWithAI = createAsyncThunk(
  'ai/searchWithAI',
  async ({ prompt }: { prompt: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        return rejectWithValue('AI search failed');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getInfluencerDetails = createAsyncThunk(
  'ai/getInfluencerDetails',
  async (userName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/ask/details?userName=${encodeURIComponent(userName)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch influencer details');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInstagramReelData = createAsyncThunk(
  'ai/fetchInstagramReelData',
  async ({ reelUrl }: { reelUrl: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/ask/reel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelUrl }),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch reel data');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAIResults: (state) => {
      state.aiResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedInfluencer: (state, action) => {
      state.selectedInfluencer = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Search with AI
    builder
      .addCase(searchWithAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchWithAI.fulfilled, (state, action) => {
        state.loading = false;
        state.aiResults = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(searchWithAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.aiResults = [];
      });

    // Get Influencer Details
    builder
      .addCase(getInfluencerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfluencerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInfluencer = action.payload;
      })
      .addCase(getInfluencerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedInfluencer = null;
      });

    // Fetch Instagram Reel Data
    builder
      .addCase(fetchInstagramReelData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstagramReelData.fulfilled, (state, action) => {
        state.loading = false;
        state.reelData = action.payload;
      })
      .addCase(fetchInstagramReelData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.reelData = null;
      });
  },
});

export const { clearAIResults, clearError, setSelectedInfluencer } = aiSlice.actions;
export default aiSlice.reducer;
