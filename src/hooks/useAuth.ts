import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signupUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  verifyEmailOtp,
  resendEmailOtp,
  googleOAuth,
  logout,
  clearError,
} from '@/store/slices/authSlice';
import type { RootState } from '@/store';

export const useAuth = () => {
  const dispatch = useDispatch() as any;
  const {
    isAuthenticated,
    token,
    user,
    loading,
    error,
    otpSent,
    otpVerified,
    resetCodeVerified,
  } = useSelector((state: RootState) => state.auth);

  const signup = useCallback(
    (data: any) => {
      dispatch(signupUser(data) as any);
    },
    [dispatch]
  );

  const login = useCallback(
    (data: any) => {
      dispatch(loginUser(data) as any);
    },
    [dispatch]
  );

  const forgotPass = useCallback(
    (email: any) => {
      dispatch((forgotPassword as any)({ email }) as any);
    },
    [dispatch]
  );

  const verifyCode = useCallback(
    (email: any, code: any) => {
      dispatch((verifyResetCode as any)({ email, code }) as any);
    },
    [dispatch]
  );

  const resetPass = useCallback(
    (email: any, newPassword: any) => {
      dispatch((resetPassword as any)({ email, newPassword }) as any);
    },
    [dispatch]
  );

  const verifyOtp = useCallback(
    (email: any, otp: any) => {
      dispatch((verifyEmailOtp as any)({ email, otp }) as any);
    },
    [dispatch]
  );

  const resendOtp = useCallback(
    (email: any) => {
      dispatch((resendEmailOtp as any)({ email }) as any);
    },
    [dispatch]
  );

  const googleLogin = useCallback(
    (data: any) => {
      dispatch(googleOAuth(data) as any);
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const removeError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isAuthenticated,
    token,
    user,
    loading,
    error,
    otpSent,
    otpVerified,
    resetCodeVerified,
    signup,
    login,
    forgotPass,
    verifyCode,
    resetPass,
    verifyOtp,
    resendOtp,
    googleLogin,
    logoutUser,
    removeError,
  };
};
