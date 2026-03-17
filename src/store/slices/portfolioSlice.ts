import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PortfolioClient {
  _id: string;
  projectTitle: string;
  servicesProvided: string[];
  projectDuration: string;
  projectStatus: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  clientName: string;
  budget: number;
  images: string[];
}

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  clients: PortfolioClient[];
  createdAt: string;
  updatedAt: string;
}

interface PortfolioStats {
  totalPortfolios: number;
  totalClients: number;
  totalBudget: number;
  projectStatusBreakdown: {
    completed: number;
    inProgress: number;
    onHold: number;
  };
}

interface PortfolioState {
  portfolioItems: PortfolioItem[];
  selectedItem: PortfolioItem | null;
  portfolioStats: PortfolioStats | null;
  categories: string[];
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
export const getPortfolioItems = createAsyncThunk(
  'portfolio/getPortfolioItems',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

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

export const getPortfolioItem = createAsyncThunk(
  'portfolio/getPortfolioItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Portfolio not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createPortfolioItem = createAsyncThunk(
  'portfolio/createPortfolioItem',
  async (
    itemData: { title: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to create portfolio');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePortfolioItem = createAsyncThunk(
  'portfolio/updatePortfolioItem',
  async (
    { id, itemData }: { id: string; itemData: Partial<PortfolioItem> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to update portfolio');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deletePortfolioItem = createAsyncThunk(
  'portfolio/deletePortfolioItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to delete portfolio');
      }

      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addClientToPortfolio = createAsyncThunk(
  'portfolio/addClientToPortfolio',
  async (
    { portfolioId, clientData }: { portfolioId: string; clientData: PortfolioClient },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios/${portfolioId}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to add client');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePortfolioClient = createAsyncThunk(
  'portfolio/updatePortfolioClient',
  async (
    {
      portfolioId,
      clientId,
      clientData,
    }: { portfolioId: string; clientId: string; clientData: Partial<PortfolioClient> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE}/portfolios/${portfolioId}/clients/${clientId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) {
        return rejectWithValue('Failed to update client');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removePortfolioClient = createAsyncThunk(
  'portfolio/removePortfolioClient',
  async (
    { portfolioId, clientId }: { portfolioId: string; clientId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE}/portfolios/${portfolioId}/clients/${clientId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue('Failed to remove client');
      }

      return { portfolioId, clientId };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPortfolioStats = createAsyncThunk(
  'portfolio/getPortfolioStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/portfolios/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
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

const initialState: PortfolioState = {
  portfolioItems: [],
  selectedItem: null,
  portfolioStats: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    selectPortfolioItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearPortfolio: (state) => {
      state.portfolioItems = [];
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Items
      .addCase(getPortfolioItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPortfolioItems.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolioItems = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPortfolioItems.rejected, (state) => {
        state.loading = false;
        state.portfolioItems = [];
      })

      // Get Item
      .addCase(getPortfolioItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPortfolioItem.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(getPortfolioItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Item
      .addCase(createPortfolioItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPortfolioItem.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolioItems.unshift(action.payload);
      })
      .addCase(createPortfolioItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Item
      .addCase(updatePortfolioItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePortfolioItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.portfolioItems.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.portfolioItems[index] = action.payload;
        }
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updatePortfolioItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Item
      .addCase(deletePortfolioItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePortfolioItem.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolioItems = state.portfolioItems.filter((p) => p._id !== action.payload);
        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deletePortfolioItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Client
      .addCase(addClientToPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClientToPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(addClientToPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Client
      .addCase(updatePortfolioClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePortfolioClient.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updatePortfolioClient.rejected, (state) => {
        state.loading = false;
      })

      // Remove Client
      .addCase(removePortfolioClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(removePortfolioClient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removePortfolioClient.rejected, (state) => {
        state.loading = false;
      })

      // Get Stats
      .addCase(getPortfolioStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPortfolioStats.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolioStats = action.payload;
      })
      .addCase(getPortfolioStats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { selectPortfolioItem, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
