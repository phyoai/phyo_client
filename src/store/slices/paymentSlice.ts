import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  interval: string;
}

interface UserPlan {
  planId: string;
  planName: string;
  credits: number;
  creditsUsed: number;
  status: string;
  startDate: string;
  endDate: string;
  features: string[];
}

interface CreditInfo {
  totalCredits: number;
  remainingCredits: number;
  usedCredits: number;
  resetDate: string;
  monthlyLimit: number;
}

interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  planId: string;
  key: string;
}

interface PaymentHistory {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  planId: string;
  status: string;
  date: string;
}

interface PaymentState {
  plans: Plan[];
  userPlan: UserPlan | null;
  creditInfo: CreditInfo | null;
  paymentHistory: PaymentHistory[];
  currentOrder: PaymentOrder | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Async thunks
export const getSubscriptionPlans = createAsyncThunk(
  'payment/getSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payment/plans');
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getUserPlan = createAsyncThunk(
  'payment/getUserPlan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payment/user-plan');
      return response.data?.data || response.data;
    } catch (error) {
      return { planId: 'free', planName: 'Free', credits: 0, creditsUsed: 0, status: 'active', startDate: '', endDate: '', features: [] };
    }
  }
);

export const getCreditInfo = createAsyncThunk(
  'payment/getCreditInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payment/credits');
      return response.data?.data || response.data;
    } catch (error) {
      return { totalCredits: 0, remainingCredits: 0, usedCredits: 0, resetDate: '', monthlyLimit: 0 };
    }
  }
);

export const createPaymentOrder = createAsyncThunk(
  'payment/createPaymentOrder',
  async ({ planId, interval }: { planId: string; interval: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/create-order', { planId, interval });
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (
    {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      planId,
    }: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      planId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/payment/verify-payment', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        planId,
      });
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'payment/getPaymentHistory',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/payment/history', { params: { page, limit } });
      const data = response.data?.data || response.data;
      return { history: data, pagination: response.data?.pagination || { page, limit, total: 0 } };
    } catch (error) {
      return { history: [], pagination: { page, limit, total: 0 } };
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'payment/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/cancel-subscription', {});
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: PaymentState = {
  plans: [],
  userPlan: null,
  creditInfo: null,
  paymentHistory: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Plans
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload || [];
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.plans = [];
      })

      // Get User Plan
      .addCase(getUserPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlan = action.payload;
      })
      .addCase(getUserPlan.rejected, (state) => {
        state.loading = false;
        state.userPlan = null;
      })

      // Get Credit Info
      .addCase(getCreditInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCreditInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.creditInfo = action.payload;
      })
      .addCase(getCreditInfo.rejected, (state) => {
        state.loading = false;
        state.creditInfo = null;
      })

      // Create Payment Order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlan = action.payload;
        state.currentOrder = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Payment History
      .addCase(getPaymentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.history;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPaymentHistory.rejected, (state) => {
        state.loading = false;
        state.paymentHistory = [];
      })

      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.loading = false;
        state.userPlan = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError, clearCurrentOrder } = paymentSlice.actions;
export default paymentSlice.reducer;
