import { describe, it, expect, beforeEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/utils/api';
import { AuthService } from '@/services';

describe('AuthService Integration Tests', () => {
  let mockAdapter: MockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(api);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('signup', () => {
    it('should signup with valid credentials', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        userType: 'INFLUENCER',
      };

      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            name: 'Test User',
            userType: 'INFLUENCER',
          },
          token: 'jwt-token-123',
        },
      };

      mockAdapter.onPost('/api/auth/signup').reply(200, mockResponse);

      const result = await AuthService.signup(signupData);

      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe('test@example.com');
      expect(result.data.token).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const signupData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        userType: 'BRAND',
      };

      mockAdapter.onPost('/api/auth/signup').reply(400, {
        success: false,
        message: 'Invalid email format',
      });

      try {
        await AuthService.signup(signupData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toBe('Invalid email format');
      }
    });

    it('should fail with duplicate email', async () => {
      const signupData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        userType: 'INFLUENCER',
      };

      mockAdapter.onPost('/api/auth/signup').reply(409, {
        success: false,
        message: 'Email already exists',
      });

      try {
        await AuthService.signup(signupData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(409);
      }
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            name: 'Test User',
            userType: 'INFLUENCER',
          },
          token: 'jwt-token-123',
        },
      };

      mockAdapter.onPost('/api/auth/login').reply(200, mockResponse);

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe('test@example.com');
      expect(result.data.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAdapter.onPost('/api/auth/login').reply(401, {
        success: false,
        message: 'Invalid email or password',
      });

      try {
        await AuthService.login(loginData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should fail with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockAdapter.onPost('/api/auth/login').reply(404, {
        success: false,
        message: 'User not found',
      });

      try {
        await AuthService.login(loginData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP successfully', async () => {
      const verifyData = {
        email: 'test@example.com',
        otp: '123456',
      };

      mockAdapter.onPost('/api/auth/verify-email-otp').reply(200, {
        success: true,
        message: 'Email verified successfully',
      });

      const result = await AuthService.verifyOTP(verifyData);

      expect(result.success).toBe(true);
    });

    it('should fail with invalid OTP', async () => {
      const verifyData = {
        email: 'test@example.com',
        otp: 'invalid',
      };

      mockAdapter.onPost('/api/auth/verify-email-otp').reply(400, {
        success: false,
        message: 'Invalid OTP',
      });

      try {
        await AuthService.verifyOTP(verifyData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should fail with expired OTP', async () => {
      const verifyData = {
        email: 'test@example.com',
        otp: '123456',
      };

      mockAdapter.onPost('/api/auth/verify-email-otp').reply(410, {
        success: false,
        message: 'OTP expired',
      });

      try {
        await AuthService.verifyOTP(verifyData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(410);
      }
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid code', async () => {
      const resetData = {
        email: 'test@example.com',
        code: 'reset-code-123',
        newPassword: 'newpassword123',
      };

      mockAdapter.onPost('/api/auth/reset-password').reply(200, {
        success: true,
        message: 'Password reset successfully',
      });

      const result = await AuthService.resetPassword(resetData);

      expect(result.success).toBe(true);
    });

    it('should fail with invalid reset code', async () => {
      const resetData = {
        email: 'test@example.com',
        code: 'invalid-code',
        newPassword: 'newpassword123',
      };

      mockAdapter.onPost('/api/auth/reset-password').reply(400, {
        success: false,
        message: 'Invalid or expired reset code',
      });

      try {
        await AuthService.resetPassword(resetData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});
