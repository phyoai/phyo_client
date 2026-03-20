'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmailOtp, resendEmailOtp } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import OTPInput from '@/components/ui/OTPInput';
import Spinner from '@/components/ui/Spinner';

export default function OTPPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, otpVerified, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Get email from localStorage if available
    const storedEmail = localStorage.getItem('pendingEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Redirect if no pending email
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (otpVerified && user) {
      setSuccessMessage('OTP verified successfully! Redirecting...');
      setTimeout(() => {
        localStorage.removeItem('pendingEmail');
        router.push('/dashboard');
      }, 2000);
    }
  }, [otpVerified, user, router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!otp || otp.length < 6) {
      setValidationError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!email) {
      setValidationError('Email not found. Please sign up again.');
      return;
    }

    const result = await dispatch(
      verifyEmailOtp({
        email,
        otp,
      })
    );

    if (result.type.endsWith('/rejected')) {
      setValidationError(result.payload || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    const result = await dispatch(resendEmailOtp({ email }));

    if (result.type.endsWith('/fulfilled')) {
      setSuccessMessage('OTP sent successfully! Check your email.');
      setOtp('');
      setResendCountdown(60);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">
              We sent a verification code to
              <br />
              <strong>{email || 'your email'}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {validationError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{validationError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter 6-Digit Code
              </label>
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the code from the email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length < 6}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                'Verify Email'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-3">
              <p className="text-center text-gray-600 text-sm">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendOtp}
                disabled={loading || resendCountdown > 0}
              >
                {resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : 'Resend Code'}
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Wrong email?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
