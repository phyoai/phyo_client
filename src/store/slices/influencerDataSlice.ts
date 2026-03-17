import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SocialMediaData {
  followers: number;
  link: string;
  genderDistribution: Array<{ gender: string; distribution: number }>;
  ageDistribution: Array<{ age: string; value: number }>;
  audienceByCountry: Array<{ category: string; name: string; value: number }>;
  collaborationCharges: {
    reel: number;
    story: number;
    post: number;
    oneMonthDigitalRights: number;
  };
}

interface InfluencerData {
  _id: string;
  name: string;
  user_name: string;
  categoryInstagram: string;
  categoryYouTube: string;
  city: string;
  state: string;
  gender: string;
  image: string;
  instagramData: SocialMediaData;
  youtubeData: SocialMediaData;
  averageLikes: number;
  averageViews: number;
  averageComments: number;
  averageEngagement: number;
}

interface InfluencerDataState {
  allInfluencers: InfluencerData[];
  searchResults: InfluencerData[];
  selectedInfluencer: InfluencerData | null;
  advancedFilters: {
    city?: string;
    state?: string;
    category?: string;
    gender?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minEngagement?: number;
    maxEngagement?: number;
  };
  categories: string[];
  demographics: any;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';

// Async thunks
export const getAllInfluencers = createAsyncThunk(
  'influencerData/getAllInfluencers',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/influencers?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        return { data: [], pagination: { page, limit, total: 0 } };
      }

      const data = await response.json();
      return { data: data.data || [], pagination: data.pagination || { page, limit, total: 0 } };
    } catch (error) {
      return { data: [], pagination: { page, limit, total: 0 } };
    }
  }
);

export const searchInfluencers = createAsyncThunk(
  'influencerData/searchInfluencers',
  async (
    {
      query,
      page = 1,
      limit = 10,
    }: { query: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE}/influencers?search=${query}&page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        return { data: [], pagination: { page, limit, total: 0 } };
      }

      const data = await response.json();
      return { data: data.data || [], pagination: data.pagination || { page, limit, total: 0 } };
    } catch (error) {
      return { data: [], pagination: { page, limit, total: 0 } };
    }
  }
);

export const advancedSearchInfluencers = createAsyncThunk(
  'influencerData/advancedSearch',
  async (
    filters: {
      city?: string;
      state?: string;
      category?: string;
      gender?: string;
      minFollowers?: number;
      maxFollowers?: number;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`${API_BASE}/influencers?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return { data: [], pagination: { page: filters.page || 1, limit: filters.limit || 10, total: 0 } };
      }

      const data = await response.json();
      return {
        data: data.data || [],
        pagination: data.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: 0,
        },
      };
    } catch (error) {
      return { data: [], pagination: { page: 1, limit: 10, total: 0 } };
    }
  }
);

export const getInfluencerById = createAsyncThunk(
  'influencerData/getInfluencerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/influencers/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return rejectWithValue('Influencer not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getInfluencerByUsername = createAsyncThunk(
  'influencerData/getInfluencerByUsername',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/influencers/username/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return rejectWithValue('Influencer not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getInfluencerStats = createAsyncThunk(
  'influencerData/getInfluencerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/influencers/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch stats');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: InfluencerDataState = {
  allInfluencers: [],
  searchResults: [],
  selectedInfluencer: null,
  advancedFilters: {},
  categories: [],
  demographics: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const influencerDataSlice = createSlice({
  name: 'influencerData',
  initialState,
  reducers: {
    setAdvancedFilters: (state, action) => {
      state.advancedFilters = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    selectInfluencer: (state, action) => {
      state.selectedInfluencer = action.payload;
    },
    clearSelectedInfluencer: (state) => {
      state.selectedInfluencer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Influencers
      .addCase(getAllInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.allInfluencers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllInfluencers.rejected, (state) => {
        state.loading = false;
        state.allInfluencers = [];
      })

      // Search Influencers
      .addCase(searchInfluencers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchInfluencers.rejected, (state) => {
        state.loading = false;
        state.searchResults = [];
      })

      // Advanced Search
      .addCase(advancedSearchInfluencers.pending, (state) => {
        state.loading = true;
      })
      .addCase(advancedSearchInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(advancedSearchInfluencers.rejected, (state) => {
        state.loading = false;
        state.searchResults = [];
      })

      // Get by ID
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
        state.error = action.payload as string;
      })

      // Get by Username
      .addCase(getInfluencerByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfluencerByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInfluencer = action.payload;
      })
      .addCase(getInfluencerByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Stats
      .addCase(getInfluencerStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInfluencerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.demographics = action.payload;
      })
      .addCase(getInfluencerStats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setAdvancedFilters,
  clearSearchResults,
  selectInfluencer,
  clearSelectedInfluencer,
} = influencerDataSlice.actions;
export default influencerDataSlice.reducer;
