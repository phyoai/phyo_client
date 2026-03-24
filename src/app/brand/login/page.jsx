'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

const BrandLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: verify code, 3: new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  
  const router = useRouter();
  const { login, isAuthenticated, isBrand, loading: authLoading } = useAuth();

  // Redirect if already authenticated and is a brand
  useEffect(() => {
    if (!authLoading && isAuthenticated() && isBrand()) {
      router.replace('/brand/dashboard');
    }
  }, [isAuthenticated, isBrand, authLoading, router]);

  // Show loading or redirect if already authenticated
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          {/* Logo Skeleton */}
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8 animate-pulse"></div>
          {/* Form Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated() && isBrand()) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Check if user is a brand
        if (result.data.user?.type === 'BRAND' || result.data.data?.type === 'BRAND') {
          router.replace('/brand/dashboard');
        } else {
          setError('This login is for brands only. Please use the appropriate login page.');
        }
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password functions
  const sendForgotPasswordEmail = async () => {
    if (!forgotEmail) {
      setForgotError('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    
    try {
      const response = await fetch('https://api.phyo.ai/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setForgotSuccess('Verification code sent to your email!');
        setForgotStep(2);
      } else {
        setForgotError(result.message || 'Failed to send verification code');
      }
    } catch (error) {
      setForgotError('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setForgotError('Please enter the verification code');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    
    try {
      const response = await fetch('https://api.phyo.ai/api/user/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotEmail, 
          code: verificationCode 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setForgotSuccess('Code verified successfully!');
        setForgotStep(3);
      } else {
        setForgotError(result.message || 'Invalid verification code');
      }
    } catch (error) {
      setForgotError('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setForgotError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    
    try {
      const response = await fetch('https://api.phyo.ai/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotEmail, 
          newPassword: newPassword 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setForgotSuccess('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          resetForgotPasswordState();
          setShowForgotPassword(false);
        }, 2000);
      } else {
        setForgotError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setForgotError('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotPasswordState = () => {
    setForgotStep(1);
    setForgotEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    setForgotSuccess('');
  };

  const openForgotPassword = () => {
    resetForgotPasswordState();
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    resetForgotPasswordState();
    setShowForgotPassword(false);
  };

  return (
    <div className='bg-[#0000] flex gap-5 h-screen p-5'>
      <div className='w-1/2'>
        <Image src={"/welcome.png"} width={200} height={300} alt='brand' className='absolute bottom-0 left-0 w-[30%] h-[70%]' />
      </div>
      <div className='bg-white rounded-lg w-[50%] h-full'>
        <div className="flex items-center justify-center h-full">
          <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Brand Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                />
              </div>
              
              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-sm text-green-600 hover:text-green-800 underline"
                >
                  Forgot Password?
                </button>
              </div>

              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md font-medium ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className='text-center mt-4'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <Link href="/brand/signup" className='text-green-600 hover:text-green-800 font-medium'>
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
              <button
                onClick={closeForgotPassword}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Step 1: Enter Email */}
            {forgotStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">Enter your email address to receive a verification code</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                </div>
                {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
                {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
                <button
                  onClick={sendForgotPasswordEmail}
                  disabled={forgotLoading}
                  className={`w-full py-2 px-4 rounded-md font-medium ${forgotLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
                >
                  {forgotLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            )}

            {/* Step 2: Verify Code */}
            {forgotStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">Enter the 6-digit verification code sent to {forgotEmail}</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
                {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
                <div className="flex gap-2">
                  <button
                    onClick={() => setForgotStep(1)}
                    className="flex-1 py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={verifyCode}
                    disabled={forgotLoading}
                    className={`flex-1 py-2 px-4 rounded-md font-medium ${forgotLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
                  >
                    {forgotLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
                <button
                  onClick={sendForgotPasswordEmail}
                  disabled={forgotLoading}
                  className="w-full text-sm text-green-600 hover:text-green-800 underline"
                >
                  Resend Code
                </button>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {forgotStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">Enter your new password</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Confirm new password"
                  />
                </div>
                {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
                {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
                <div className="flex gap-2">
                  <button
                    onClick={() => setForgotStep(2)}
                    className="flex-1 py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={resetPassword}
                    disabled={forgotLoading}
                    className={`flex-1 py-2 px-4 rounded-md font-medium ${forgotLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogin;