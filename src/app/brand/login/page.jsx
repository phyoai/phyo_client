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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
    </div>
  );
};

export default BrandLogin; 