import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/api';

interface FavoriteItem {
  id: string;
  type: 'campaign' | 'influencer' | 'brand';
  itemId: string;
  itemName: string;
  thumbnail?: string;
  createdAt: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  favoriteIds: Set<string>;
  campaigns: any[];
  influencers: any[];
  brands: any[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: FavoritesState = {
  items: [],
  favoriteIds: new Set(),
  campaigns: [],
  influencers: [],
  brands: [],
  loading: false,
  error: null,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// Async Thunks
export const getFavorites = createAsyncThunk(
  'favorites/getFavorites',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/favorites', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const getFavoriteCampaigns = createAsyncThunk(
  'favorites/getFavoriteCampaigns',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/favorites/campaigns', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite campaigns');
    }
  }
);

export const getFavoriteInfluencers = createAsyncThunk(
  'favorites/getFavoriteInfluencers',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/favorites/influencers', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite influencers');
    }
  }
);

export const getFavoriteBrands = createAsyncThunk(
  'favorites/getFavoriteBrands',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/favorites/brands', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite brands');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ type, itemId }: { type: 'campaign' | 'influencer' | 'brand'; itemId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/favorites', { type, itemId });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ type, itemId }: { type: 'campaign' | 'influencer' | 'brand'; itemId: string }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/favorites/${type}/${itemId}`);
      return { type, itemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
);

export const isFavorite = createAsyncThunk(
  'favorites/isFavorite',
  async ({ type, itemId }: { type: 'campaign' | 'influencer' | 'brand'; itemId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/favorites/check/${type}/${itemId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(false);
    }
  }
);

export const clearAllFavorites = createAsyncThunk(
  'favorites/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete('/favorites/clear-all');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    toggleFavoriteLocally: (state, action) => {
      const { type, itemId } = action.payload;
      const key = `${type}:${itemId}`;
      if (state.favoriteIds.has(key)) {
        state.favoriteIds.delete(key);
      } else {
        state.favoriteIds.add(key);
      }
    },
  },
  extraReducers: (builder) => {
    // Get Favorites
    builder
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        // Build favoriteIds set
        state.favoriteIds = new Set(state.items.map((item) => `${item.type}:${item.itemId}`));
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Favorite Campaigns
    builder
      .addCase(getFavoriteCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFavoriteCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(getFavoriteCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Favorite Influencers
    builder
      .addCase(getFavoriteInfluencers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFavoriteInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.influencers = action.payload;
      })
      .addCase(getFavoriteInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Favorite Brands
    builder
      .addCase(getFavoriteBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFavoriteBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(getFavoriteBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add Favorite
    builder
      .addCase(addFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        const item = action.payload;
        const key = `${item.type}:${item.itemId}`;
        if (!state.favoriteIds.has(key)) {
          state.favoriteIds.add(key);
          state.items.push(item);
          state.successMessage = 'Added to favorites';
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Remove Favorite
    builder
      .addCase(removeFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const { type, itemId } = action.payload;
        const key = `${type}:${itemId}`;
        state.favoriteIds.delete(key);
        state.items = state.items.filter((item) => !(item.type === type && item.itemId === itemId));
        state.successMessage = 'Removed from favorites';
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Is Favorite
    builder.addCase(isFavorite.fulfilled, (state, action) => {
      // Used to check if item is favorite
    });

    // Clear All Favorites
    builder
      .addCase(clearAllFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(clearAllFavorites.fulfilled, (state) => {
        state.items = [];
        state.campaigns = [];
        state.influencers = [];
        state.brands = [];
        state.favoriteIds = new Set();
        state.successMessage = 'All favorites cleared';
      })
      .addCase(clearAllFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, toggleFavoriteLocally } = favoritesSlice.actions;
export default favoritesSlice.reducer;
