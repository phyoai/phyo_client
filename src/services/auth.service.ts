import apiClient from './api';
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
  GoogleAuthRequest
} from './types';

export const authService = {
  // POST /api/auth/signup
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // POST /api/auth/login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (email: string): Promise<any> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // POST /api/auth/reset-password
  resetPassword: async (data: ResetPasswordRequest): Promise<any> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  // POST /api/auth/verify-code
  verifyCode: async (email: string, code: string): Promise<any> => {
    const response = await apiClient.post('/auth/verify-code', { email, code });
    return response.data;
  },

  // POST /api/auth/verify-otp
  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // POST /api/auth/resend-otp
  resendOtp: async (email: string): Promise<any> => {
    const response = await apiClient.post('/auth/resend-otp', { email });
    return response.data;
  },

  // POST /api/auth/google
  googleAuth: async (data: GoogleAuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/google', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // GET /api/auth/google/callback
  googleCallback: async (code: string, state: string): Promise<AuthResponse> => {
    const response = await apiClient.get('/auth/google/callback', {
      params: { code, state }
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // GET /api/auth/registration-status
  getRegistrationStatus: async (): Promise<any> => {
    const response = await apiClient.get('/auth/registration-status');
    return response.data;
  },

  // GET /api/auth/influencers
  getInfluencers: async (): Promise<any> => {
    const response = await apiClient.get('/auth/influencers');
    return response.data;
  },

  // GET /api/auth/influencer/:id
  getInfluencer: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/auth/influencer/${id}`);
    return response.data;
  },

  // Admin login endpoint
  adminLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/admin-login', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', 'admin');
    }
    return response.data;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
};
