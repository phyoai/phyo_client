import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface AnalyticsMetrics {
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  engagementRate: number;
  reach: number;
  impressions: number;
}

interface CampaignAnalytics extends AnalyticsMetrics {
  campaignId: string;
  campaignName: string;
  period: string;
  topPerformingInfluencers?: Array<{
    influencerId: string;
    name: string;
    metrics: AnalyticsMetrics;
  }>;
  trendData?: Array<{
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }>;
}

interface ProfileAnalytics extends AnalyticsMetrics {
  profileName: string;
  followers: number;
  growth: number;
  avgEngagement: number;
  topPosts?: Array<{
    postId: string;
    views: number;
    engagement: number;
    posted: string;
  }>;
}

interface DashboardAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  roi: number;
  topInfluencers: Array<{
    id: string;
    name: string;
    performance: number;
  }>;
  recentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    performance: number;
  }>;
}

interface AnalyticsState {
  campaignAnalytics: CampaignAnalytics[];
  selectedCampaignAnalytics: CampaignAnalytics | null;
  profileAnalytics: ProfileAnalytics | null;
  dashboardAnalytics: DashboardAnalytics | null;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  campaignAnalytics: [],
  selectedCampaignAnalytics: null,
  profileAnalytics: null,
  dashboardAnalytics: null,
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  loading: false,
  error: null,
};

// Async Thunks
export const getCampaignAnalytics = createAsyncThunk(
  'analytics/getCampaignAnalytics',
  async (
    { campaignId, startDate, endDate }: { campaignId: string; startDate?: string; endDate?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = { startDate, endDate };
      const response = await apiClient.get(`/analytics/campaigns/${campaignId}`, { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaign analytics');
    }
  }
);

export const getAllCampaignAnalytics = createAsyncThunk(
  'analytics/getAllCampaignAnalytics',
  async (
    { startDate, endDate, page, limit }: { startDate?: string; endDate?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const params = { startDate, endDate, page, limit };
      const response = await apiClient.get('/analytics/campaigns', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch campaign analytics');
    }
  }
);

export const getProfileAnalytics = createAsyncThunk(
  'analytics/getProfileAnalytics',
  async (
    { startDate, endDate }: { startDate?: string; endDate?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = { startDate, endDate };
      const response = await apiClient.get('/analytics/profile', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile analytics');
    }
  }
);

export const getDashboardAnalytics = createAsyncThunk(
  'analytics/getDashboardAnalytics',
  async (
    { startDate, endDate }: { startDate?: string; endDate?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = { startDate, endDate };
      const response = await apiClient.get('/analytics/dashboard', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard analytics');
    }
  }
);

export const getCampaignReports = createAsyncThunk(
  'analytics/getCampaignReports',
  async (
    { campaignId, format }: { campaignId: string; format?: 'pdf' | 'csv' },
    { rejectWithValue }
  ) => {
    try {
      const params = { format };
      const response = await apiClient.get(`/analytics/campaigns/${campaignId}/report`, { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

export const getInfluencerAnalytics = createAsyncThunk(
  'analytics/getInfluencerAnalytics',
  async (
    { influencerId, startDate, endDate }: { influencerId: string; startDate?: string; endDate?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = { startDate, endDate };
      const response = await apiClient.get(`/analytics/influencers/${influencerId}`, { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch influencer analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAnalytics: (state) => {
      state.campaignAnalytics = [];
      state.selectedCampaignAnalytics = null;
      state.profileAnalytics = null;
      state.dashboardAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    // Get Campaign Analytics
    builder
      .addCase(getCampaignAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCampaignAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaignAnalytics = action.payload;
      })
      .addCase(getCampaignAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get All Campaign Analytics
    builder
      .addCase(getAllCampaignAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCampaignAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignAnalytics = action.payload.data || action.payload;
      })
      .addCase(getAllCampaignAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Profile Analytics
    builder
      .addCase(getProfileAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.profileAnalytics = action.payload;
      })
      .addCase(getProfileAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Dashboard Analytics
    builder
      .addCase(getDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardAnalytics = action.payload;
      })
      .addCase(getDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Campaign Reports
    builder.addCase(getCampaignReports.fulfilled, (state, action) => {
      // Handle file download in component
    });

    // Get Influencer Analytics
    builder
      .addCase(getInfluencerAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInfluencerAnalytics.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getInfluencerAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange, clearError, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
