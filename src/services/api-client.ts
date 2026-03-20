/**
 * Central API Client Service
 * Handles all HTTP requests with token management, error handling, and response standardization
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG } from "@/utils/api-endpoints";

/**
 * Standard API Response Structure
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

/**
 * API Client Class
 * Centralizes all API communication logic
 */
export class APIClient {
  private instance: AxiosInstance;
  private retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  private retryDelay = API_CONFIG.RETRY_DELAY;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add request interceptor for token injection
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;

        // Handle 401 Unauthorized
        if (
          error.response?.status === 401 &&
          !config._retry
        ) {
          config._retry = true;
          this.handleUnauthorized();
          return this.instance(config);
        }

        // Handle network errors with retry
        if (
          !error.response &&
          config._retryCount &&
          config._retryCount < this.retryAttempts
        ) {
          config._retryCount++;
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay)
          );
          return this.instance(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET Request
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.instance.get<APIResponse<T>>(
        url,
        config
      );
      return this.normalizeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST Request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.instance.post<APIResponse<T>>(
        url,
        data,
        config
      );
      return this.normalizeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT Request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.instance.put<APIResponse<T>>(
        url,
        data,
        config
      );
      return this.normalizeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH Request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.instance.patch<APIResponse<T>>(
        url,
        data,
        config
      );
      return this.normalizeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE Request
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.instance.delete<APIResponse<T>>(
        url,
        config
      );
      return this.normalizeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * File Upload (multipart/form-data)
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<APIResponse<T>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      const response = await this.instance.post<APIResponse<T>>(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return this.normalizeResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Normalize API Response
   */
  private normalizeResponse<T>(response: AxiosResponse<APIResponse<T>>): APIResponse<T> {
    const { data } = response;

    return {
      success: data.success ?? response.status < 400,
      data: data.data,
      message: data.message,
      status: response.status,
    };
  }

  /**
   * Handle API Errors
   */
  private handleError(error: any): APIResponse {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as APIResponse;
      return {
        success: false,
        message: data.message || "An error occurred",
        error: data.error || error.message,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        message: "No response from server",
        error: error.message,
      };
    } else {
      // Error in request setup
      return {
        success: false,
        message: "Error setting up request",
        error: error.message,
      };
    }
  }

  /**
   * Handle Unauthorized Errors (401)
   */
  private handleUnauthorized(): void {
    // Clear token and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Emit event for global handling
    window.dispatchEvent(new Event("auth:unauthorized"));

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Get Token from Storage
   */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  /**
   * Set Token
   */
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  /**
   * Clear Token
   */
  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  /**
   * Get Axios Instance for Advanced Usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

export default apiClient;
