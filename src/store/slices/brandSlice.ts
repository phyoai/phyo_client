import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface BrandProfile {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  followers?: number;
  rating?: number;
  createdAt?: string;
}

interface BrandState {
  brands: BrandProfile[];
  trendingBrands: BrandProfile[];
  myBrand: BrandProfile | null;
  selectedBrand: BrandProfile | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: BrandState = {
  brands: [],
  trendingBrands: [],
  myBrand: null,
  selectedBrand: null,
  loading: false,
  error: null,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async Thunks
export const getBrands = createAsyncThunk(
  'brand/getBrands',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/brands', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

export const getTrendingBrands = createAsyncThunk(
  'brand/getTrendingBrands',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/trending/brands', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trending brands:', error.message);
      return { data: [] };
    }
  }
);

export const getMyBrand = createAsyncThunk(
  'brand/getMyBrand',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/brands/me');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brand');
    }
  }
);

export const getBrandById = createAsyncThunk(
  'brand/getBrandById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/brands/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Brand not found');
    }
  }
);

export const createBrand = createAsyncThunk(
  'brand/createBrand',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/brands', data);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brand/updateBrand',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/brands/${id}`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brand/deleteBrand',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/brands/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete brand');
    }
  }
);

export const getBrandCampaigns = createAsyncThunk(
  'brand/getBrandCampaigns',
  async ({ brandId, params }: { brandId: string; params?: any }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/brands/${brandId}/campaigns`, { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brand campaigns');
    }
  }
);

export const getBrandStats = createAsyncThunk(
  'brand/getBrandStats',
  async (brandId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/brands/${brandId}/stats`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brand stats');
    }
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetSelectedBrand: (state) => {
      state.selectedBrand = null;
    },
  },
  extraReducers: (builder) => {
    // Get Brands
    builder
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Trending Brands
    builder
      .addCase(getTrendingBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingBrands = action.payload.data || [];
      })
      .addCase(getTrendingBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get My Brand
    builder
      .addCase(getMyBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.myBrand = action.payload;
      })
      .addCase(getMyBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Brand By ID
    builder
      .addCase(getBrandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBrand = action.payload;
      })
      .addCase(getBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Brand
    builder
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.myBrand = action.payload;
        state.successMessage = 'Brand created successfully';
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Brand
    builder
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        if (state.myBrand?.id === action.payload.id) {
          state.myBrand = action.payload;
        }
        if (state.selectedBrand?.id === action.payload.id) {
          state.selectedBrand = action.payload;
        }
        state.successMessage = 'Brand updated successfully';
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Brand
    builder
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter((b) => b.id !== action.payload);
        if (state.myBrand?.id === action.payload) {
          state.myBrand = null;
        }
        state.successMessage = 'Brand deleted successfully';
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Brand Campaigns
    builder.addCase(getBrandCampaigns.fulfilled, (state, action) => {
      // Handled by campaign slice
    });

    // Get Brand Stats
    builder.addCase(getBrandStats.fulfilled, (state, action) => {
      // Could add stats to state if needed
    });
  },
});

export const { clearError, clearSuccessMessage, resetSelectedBrand } = brandSlice.actions;
export default brandSlice.reducer;
