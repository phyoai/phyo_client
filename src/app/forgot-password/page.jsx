'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: verify code, 3: new password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const sendForgotPasswordEmail = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.phyo.ai/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess('Verification code sent to your email!');
        setStep(2);
      } else {
        setError(result.message || 'Failed to send verification code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.phyo.ai/api/user/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess('Code verified successfully!');
        setStep(3);
      } else {
        setError(result.message || 'Invalid verification code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setError('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.phyo.ai/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Forgot Password</h2>
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">Enter your email address to receive a verification code</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00897B]"
              placeholder="Enter your email"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <button
              onClick={sendForgotPasswordEmail}
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium ${loading ? 'bg-gray-400' : 'bg-[#00897B] hover:bg-[#00796B]'} text-white transition-colors`}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">Enter the 6-digit verification code sent to {email}</p>
            <input
              type="text"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              maxLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00897B]"
              placeholder="Enter 6-digit code"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={verifyCode}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md font-medium ${loading ? 'bg-gray-400' : 'bg-[#00897B] hover:bg-[#00796B]'} text-white transition-colors`}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
            <button
              onClick={sendForgotPasswordEmail}
              disabled={loading}
              className="w-full text-sm text-[#00897B] hover:text-[#00796B] underline"
            >
              Resend Code
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">Enter your new password</p>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00897B]"
              placeholder="Enter new password"
            />
            <input
              type="password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00897B]"
              placeholder="Confirm new password"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={resetPassword}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md font-medium ${loading ? 'bg-gray-400' : 'bg-[#00897B] hover:bg-[#00796B]'} text-white transition-colors`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
