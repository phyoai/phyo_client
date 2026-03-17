import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface DashboardMetrics {
  totalCampaigns?: number;
  activeCampaigns?: number;
  totalEarnings?: number;
  engagement?: number;
  followers?: number;
  viewsThisMonth?: number;
}

interface DashboardState {
  metrics: DashboardMetrics;
  recentCampaigns: any[];
  trendingInfluencers: any[];
  campaignStats: any;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  metrics: {},
  recentCampaigns: [],
  trendingInfluencers: [],
  campaignStats: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async Thunks
export const getDashboardMetrics = createAsyncThunk(
  'dashboard/getMetrics',
  async () => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  }
);

export const getRecentCampaigns = createAsyncThunk(
  'dashboard/getRecentCampaigns',
  async (limit?: number) => {
    const response = await apiClient.get('/dashboard/campaigns', {
      params: { limit: limit || 5 },
    });
    return response.data;
  }
);

export const getTrendingInfluencers = createAsyncThunk(
  'dashboard/getTrendingInfluencers',
  async (limit?: number) => {
    const response = await apiClient.get('/dashboard/trending-influencers', {
      params: { limit: limit || 10 },
    });
    return response.data;
  }
);

export const getCampaignStats = createAsyncThunk(
  'dashboard/getCampaignStats',
  async (campaignId?: string) => {
    const response = await apiClient.get('/dashboard/campaign-stats', {
      params: { campaignId },
    });
    return response.data;
  }
);

export const refreshDashboard = createAsyncThunk(
  'dashboard/refreshDashboard',
  async () => {
    const metricsResponse = await apiClient.get('/dashboard/metrics');
    const campaignsResponse = await apiClient.get('/dashboard/campaigns');
    const influencersResponse = await apiClient.get('/dashboard/trending-influencers');

    return {
      metrics: metricsResponse.data,
      campaigns: campaignsResponse.data,
      influencers: influencersResponse.data,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.metrics = {};
      state.recentCampaigns = [];
      state.trendingInfluencers = [];
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    // Get Metrics
    builder
      .addCase(getDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.data || action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch metrics';
      });

    // Get Recent Campaigns
    builder
      .addCase(getRecentCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.recentCampaigns = action.payload.data || [];
      })
      .addCase(getRecentCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      });

    // Get Trending Influencers
    builder
      .addCase(getTrendingInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingInfluencers = action.payload.data || [];
      })
      .addCase(getTrendingInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch influencers';
      });

    // Get Campaign Stats
    builder
      .addCase(getCampaignStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCampaignStats.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignStats = action.payload.data || {};
      })
      .addCase(getCampaignStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaign stats';
      });

    // Refresh Dashboard
    builder
      .addCase(refreshDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics.data || action.payload.metrics;
        state.recentCampaigns = action.payload.campaigns.data || [];
        state.trendingInfluencers = action.payload.influencers.data || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to refresh dashboard';
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
