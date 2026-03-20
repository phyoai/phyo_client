'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmailOtp, resendEmailOtp } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import OTPInput from '@/components/ui/OTPInput';
import Spinner from '@/components/ui/Spinner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, otpSent, otpVerified } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Get email from localStorage if available
    const storedEmail = localStorage.getItem('pendingEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (otpVerified) {
      setSuccessMessage('Email verified successfully! Redirecting...');
      setTimeout(() => {
        localStorage.removeItem('pendingEmail');
        router.push('/dashboard');
      }, 2000);
    }
  }, [otpVerified, router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      // Error will be shown by OTP component
      return;
    }

    const result = await dispatch(
      verifyEmailOtp({
        email,
        otp,
      })
    );

    if (result.type.endsWith('/fulfilled')) {
      setSuccessMessage('Email verified successfully!');
    }
  };

  const handleResendOtp = async () => {
    const result = await dispatch(resendEmailOtp({ email }));

    if (result.type.endsWith('/fulfilled')) {
      setSuccessMessage('OTP sent to your email');
      setResendCountdown(60);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification Required</h1>
          <p className="text-gray-600 mb-6">
            No email found. Please sign up or log in first.
          </p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
            <p className="text-gray-600 mt-2">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                One-Time Password
              </label>
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length < 6}
            >
              {loading ? <Spinner size="sm" /> : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-4">
              Didn't receive the OTP?
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendOtp}
              disabled={loading || resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Resend in ${resendCountdown}s`
                : 'Resend OTP'}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
