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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Logo - Top Left - Fixed Position */}
      <div className="absolute top-6 left-8 z-20">
        <img 
          src="/logo.png" 
          alt="Phyo Logo" 
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Left Illustration - Positioned to overlap towards center */}
      <div className="hidden lg:block absolute left-[-5%] bottom-0 w-[55%] h-[90%] z-0">
        <img 
          src="/assets/right_illustration.svg" 
          alt="Welcome Illustration" 
          className="w-full h-full object-contain object-right-bottom"
          style={{ objectPosition: 'right bottom' }}
        />
      </div>

      {/* Middle Section - Forgot Password Form */}
      <div className="w-full max-w-[30%] flex items-center justify-center p-4 z-10">
        <div className="w-full bg-white rounded-3xl shadow-xl py-8 px-6  border border-gray-100">
          {step === 1 && <h2 className="text-2xl font-semibold mb-3 text-center text-gray-900">Forgot Password?</h2>}
          
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-gray-500 text-sm text-center leading-relaxed">We'll send you an email with instruction to<br />reset your password.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 border-4 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43573B] focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                  placeholder="jazleen@gmail.com"
                />
              </div>
              
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              
              <div className="flex justify-center pt-2">
                <button
                  onClick={sendForgotPasswordEmail}
                  disabled={loading}
                  className={`py-2 px-4 rounded-full font-semibold text-sm ${loading ? 'bg-gray-400' : 'bg-[#43573B] hover:bg-[#2d4a3a]'} text-white transition-colors`}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-gray-900">Verify OTP</h2>
              
              <p className="text-gray-500 text-sm text-center leading-relaxed">
                We have sent a verification code to your email at<br />
                <span className="font-medium text-gray-700">{email.replace(/(.{1})(.*)(@.*)/, '$1****$3')}</span>
              </p>
              
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={verificationCode[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1) {
                        const newCode = verificationCode.split('');
                        newCode[index] = value;
                        setVerificationCode(newCode.join(''));
                        // Auto-focus next input
                        if (value && index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                        document.getElementById(`otp-${index - 1}`)?.focus();
                      }
                    }}
                    className="w-10 h-10 text-center text-lg font-semibold bg-[#F0F0F0] border-[3px] border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43573B] focus:bg-white text-gray-900"
                  />
                ))}
              </div>
              
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              
              <div className="flex justify-center pt-2">
                <button
                  onClick={verifyCode}
                  disabled={loading || verificationCode.length < 6}
                  className={`py-2 px-4 rounded-full font-semibold text-sm ${loading ? 'bg-gray-400' : 'bg-[#43573B] hover:bg-[#2d4a3a]'} text-white transition-colors`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Didn't receive mail?{' '}
                  <button
                    onClick={sendForgotPasswordEmail}
                    disabled={loading}
                    className="text-gray-900 font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-gray-900">Create New Password</h2>
              
              <p className="text-gray-500 text-sm text-center leading-relaxed">
                Generate a password using 8 unique characters,<br />
                including letters, numbers, and symbols.
              </p>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <span className="text-xs text-gray-400">0/8</span>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 bg-[#F0F0F0] border-[3px] border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43573B] focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="jazleen@gmail.com"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <span className="text-xs text-gray-400">0/8</span>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 bg-[#F0F0F0] border-[3px] border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43573B] focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="Complete"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {/* {success && <div className="text-green-600 text-sm text-center">{success}</div>} */}
              
              <div className="flex justify-center pt-2">
                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className={`py-2.5 px-10 rounded-full font-semibold text-sm ${loading ? 'bg-gray-400' : 'bg-[#43573B] hover:bg-[#2d4a3a]'} text-white transition-colors`}
                >
                  {loading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Illustration - Positioned to overlap towards center */}
      <div className="hidden lg:block absolute right-0 bottom-0 w-[38%] z-0">
        <img 
          src="/assets/illustation_right.svg" 
          alt="Social Media Illustration" 
          className="w-full h-full object-contain"
          style={{ objectPosition: 'left bottom' }}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
