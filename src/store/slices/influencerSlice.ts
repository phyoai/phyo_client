import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface Influencer {
  id: string;
  name: string;
  email?: string;
  followers?: number;
  engagement?: number;
}

interface InfluencerState {
  influencers: Influencer[];
  selectedInfluencer: Influencer | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    minFollowers?: number;
    maxFollowers?: number;
    engagement?: number;
  };
}

const initialState: InfluencerState = {
  influencers: [],
  selectedInfluencer: null,
  loading: false,
  error: null,
  filters: {},
};

// Async Thunks
export const getInfluencers = createAsyncThunk(
  'influencer/getInfluencers',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/influencers', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching influencers:', error.message);
      // Return empty data instead of rejecting
      return { data: [] };
    }
  }
);

export const getInfluencerById = createAsyncThunk(
  'influencer/getInfluencerById',
  async (id: string) => {
    const response = await apiClient.get(`/influencers/${id}`);
    return response.data.data;
  }
);

export const getTrendingInfluencers = createAsyncThunk(
  'influencer/getTrendingInfluencers',
  async (params?: any) => {
    // Use regular influencers endpoint with limit parameter
    const response = await apiClient.get('/influencers', { params });
    return response.data;
  }
);

export const searchInfluencers = createAsyncThunk(
  'influencer/searchInfluencers',
  async (query: string) => {
    const response = await apiClient.get(`/influencers/search?q=${query}`);
    return response.data;
  }
);

const influencerSlice = createSlice({
  name: 'influencer',
  initialState,
  reducers: {
    clearSelectedInfluencer: (state) => {
      state.selectedInfluencer = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Influencers
    builder
      .addCase(getInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.influencers = action.payload.data || [];
      })
      .addCase(getInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
        state.influencers = [];
      });

    // Get Influencer by ID
    builder
      .addCase(getInfluencerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfluencerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInfluencer = action.payload;
      })
      .addCase(getInfluencerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch influencer';
      });

    // Get Trending Influencers
    builder
      .addCase(getTrendingInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.influencers = action.payload.data || [];
      })
      .addCase(getTrendingInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending influencers';
      });

    // Search Influencers
    builder
      .addCase(searchInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.influencers = action.payload.data || [];
      })
      .addCase(searchInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search influencers';
      });
  },
});

export const { clearSelectedInfluencer, setFilters } = influencerSlice.actions;
export default influencerSlice.reducer;
