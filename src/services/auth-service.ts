/**
 * Authentication Service
 * Handles all auth-related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import { AUTH_ENDPOINTS, INFLUENCER_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * Authentication Response Types
 */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    profilePicture?: string;
    phoneNumber?: string;
    isVerified?: boolean;
    tokenVersion?: number;
  };
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  userType: "influencer" | "brand";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface ResendOTPPayload {
  email: string;
}

export interface GoogleAuthPayload {
  token: string;
}

/**
 * Authentication Service
 */
export class AuthService {
  /**
   * User Signup
   */
  static async signup(
    payload: SignupPayload
  ): Promise<APIResponse<AuthResponse>> {
    return apiClient.post(AUTH_ENDPOINTS.SIGNUP, payload);
  }

  /**
   * User Login
   */
  static async login(
    payload: LoginPayload
  ): Promise<APIResponse<AuthResponse>> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.LOGIN,
      payload
    );

    // Store token on successful login
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Admin Login
   */
  static async adminLogin(
    payload: LoginPayload
  ): Promise<APIResponse<AuthResponse>> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.ADMIN_LOGIN,
      payload
    );

    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Google Authentication
   */
  static async googleAuth(
    payload: GoogleAuthPayload
  ): Promise<APIResponse<AuthResponse>> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.GOOGLE_AUTH,
      payload
    );

    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Forgot Password
   */
  static async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<APIResponse> {
    return apiClient.post(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );
  }

  /**
   * Verify Reset Code
   */
  static async verifyResetCode(
    payload: VerifyResetCodePayload
  ): Promise<APIResponse> {
    return apiClient.post(
      AUTH_ENDPOINTS.VERIFY_RESET_CODE,
      payload
    );
  }

  /**
   * Reset Password
   */
  static async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<APIResponse> {
    return apiClient.post(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      payload
    );
  }

  /**
   * Verify Email OTP
   */
  static async verifyEmailOTP(
    payload: VerifyOTPPayload
  ): Promise<APIResponse> {
    return apiClient.post(
      AUTH_ENDPOINTS.VERIFY_EMAIL_OTP,
      payload
    );
  }

  /**
   * Resend Email OTP
   */
  static async resendEmailOTP(
    payload: ResendOTPPayload
  ): Promise<APIResponse> {
    return apiClient.post(
      AUTH_ENDPOINTS.RESEND_EMAIL_OTP,
      payload
    );
  }

  /**
   * Get All Influencers (PUBLIC - No Auth Required)
   */
  static async getAllInfluencers(): Promise<APIResponse> {
    return apiClient.get(INFLUENCER_ENDPOINTS.GET_INFLUENCERS);
  }

  /**
   * Get Influencer by ID (PUBLIC - No Auth Required)
   */
  static async getInfluencerById(id: string): Promise<APIResponse> {
    return apiClient.get(INFLUENCER_ENDPOINTS.GET_INFLUENCER_BY_ID(id));
  }

  /**
   * Check Registration Status
   */
  static async checkRegistrationStatus(
    email: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${AUTH_ENDPOINTS.CHECK_REGISTRATION_STATUS}?email=${email}`
    );
  }

  /**
   * Logout (clear local token)
   */
  static logout(): void {
    apiClient.clearToken();
    localStorage.removeItem("user");
  }
}

export default AuthService;
