import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  status?: string;
  createdAt?: string;
}

interface CampaignState {
  campaigns: Campaign[];
  myCampaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: CampaignState = {
  campaigns: [],
  myCampaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async Thunks
export const getCampaigns = createAsyncThunk(
  'campaign/getCampaigns',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/campaigns', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching campaigns:', error.response?.status, error.message);
      // Return empty data instead of rejecting to prevent crash
      return { data: [], pagination: { page: 1, totalPages: 1, totalItems: 0 } };
    }
  }
);

export const getMyCampaigns = createAsyncThunk(
  'campaign/getMyCampaigns',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      // Try /campaigns first, then /campaigns/mine as fallback
      let response;
      try {
        response = await apiClient.get('/campaigns', { params: { ...params, mine: true } });
      } catch (err: any) {
        // If that fails, try the mine endpoint
        if (err.response?.status === 404 || err.response?.status === 405) {
          response = await apiClient.get('/campaigns/mine', { params });
        } else {
          throw err;
        }
      }
      return response.data || { data: [] };
    } catch (error: any) {
      console.error('Error fetching my campaigns:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      // Return error so UI can show proper error message
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch campaigns');
    }
  }
);

export const getCampaignById = createAsyncThunk(
  'campaign/getCampaignById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/campaigns/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error fetching campaign by ID:', error.message);
      return rejectWithValue('Campaign not found');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaign/createCampaign',
  async (data: any) => {
    const response = await apiClient.post('/campaigns', data);
    return response.data.data;
  }
);

export const updateCampaign = createAsyncThunk(
  'campaign/updateCampaign',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.put(`/campaigns/${id}`, data);
    return response.data.data;
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaign/deleteCampaign',
  async (id: string) => {
    await apiClient.delete(`/campaigns/${id}`);
    return id;
  }
);

export const applyToCampaign = createAsyncThunk(
  'campaign/applyToCampaign',
  async ({ id, applicationData }: { id: string; applicationData?: any }) => {
    const response = await apiClient.post(`/campaigns/${id}/influencers`, applicationData || {});
    return response.data;
  }
);

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Campaigns
    builder
      .addCase(getCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = null; // Don't show error, just show empty list
        state.campaigns = [];
      });

    // Get My Campaigns
    builder
      .addCase(getMyCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.myCampaigns = action.payload.data || [];
      })
      .addCase(getMyCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = null; // Don't show error, just show empty list
        state.myCampaigns = [];
      });

    // Get Campaign by ID
    builder
      .addCase(getCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload;
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaign';
      });

    // Create Campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.myCampaigns.unshift(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create campaign';
      });

    // Update Campaign
    builder
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myCampaigns.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.myCampaigns[index] = action.payload;
        }
        if (state.selectedCampaign?.id === action.payload.id) {
          state.selectedCampaign = action.payload;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update campaign';
      });

    // Delete Campaign
    builder
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.myCampaigns = state.myCampaigns.filter((c) => c.id !== action.payload);
        if (state.selectedCampaign?.id === action.payload) {
          state.selectedCampaign = null;
        }
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete campaign';
      });
  },
});

export const { clearSelectedCampaign, setPagination } = campaignSlice.actions;
export default campaignSlice.reducer;
