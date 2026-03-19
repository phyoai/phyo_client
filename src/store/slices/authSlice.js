import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// Async thunks for authentication
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ email, password, type, name, username }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/signup', { email, password, type, name, username });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data || response;
      return {
        token: data.token || data.data?.token,
        user: data.user || data.data?.user,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      await api.post('/user/forgot-password', { email });
      return { success: true, email };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

export const verifyResetCode = createAsyncThunk(
  'auth/verifyResetCode',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      await api.post('/user/verify-code', { email, code });
      return { success: true, email };
    } catch (error) {
      return rejectWithValue(error.message || 'Invalid or expired code');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      await api.post('/user/reset-password', { email, newPassword });
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/verify-otp', { email, otp });
      const data = response.data || response;
      return {
        token: data.token || data.data?.token,
        user: data.user || data.data?.user,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Invalid OTP');
    }
  }
);

export const resendEmailOtp = createAsyncThunk(
  'auth/resendEmailOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      await api.post('/user/resend-otp', { email });
      return { success: true, email };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resend OTP');
    }
  }
);

export const googleOAuth = createAsyncThunk(
  'auth/googleOAuth',
  async (
    { idToken, type, companyName, industry, website, description, name, username, bio, profilePicture },
    { rejectWithValue }
  ) => {
    try {
      const body = {
        idToken,
        type,
        ...(companyName && { companyName }),
        ...(industry && { industry }),
        ...(website && { website }),
        ...(description && { description }),
        ...(name && { name }),
        ...(username && { username }),
        ...(bio && { bio }),
        ...(profilePicture && { profilePicture }),
      };

      const response = await api.post('/user/google', body);
      const data = response.data || response;
      return {
        token: data.token || data.data?.token,
        user: data.user || data.data?.user,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Google OAuth failed');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  resetCodeVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.resetCodeVerified = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.otpSent = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.token) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user || null;
          state.error = null;
        } else {
          state.error = 'Invalid login response: no token received';
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify Reset Code
    builder
      .addCase(verifyResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state) => {
        state.loading = false;
        state.resetCodeVerified = true;
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetCodeVerified = false;
        state.otpSent = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify Email OTP
    builder
      .addCase(verifyEmailOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.token) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user || null;
          state.otpVerified = true;
          state.otpSent = false;
          state.error = null;
        } else {
          state.error = 'Invalid OTP verification response';
        }
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Resend Email OTP
    builder
      .addCase(resendEmailOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendEmailOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(resendEmailOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Google OAuth
    builder
      .addCase(googleOAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleOAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.token) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user || null;
          state.error = null;
        } else {
          state.error = 'Invalid Google OAuth response: no token received';
        }
      })
      .addCase(googleOAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
