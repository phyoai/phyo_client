'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { authUtils } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formFields = [
    {
        name: 'email',
        label: 'Email/Phone number',
        type: 'email',
        placeholder: 'john@example.com',
        validation: { 
            required: 'Email is required',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
            }
        },
        icon: '✉️'
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        validation: { required: 'Password is required' },
        icon: '🔒'
    },
];

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    // Check for verification success message
    const verified = searchParams.get('verified');
    // Check for expired session
    const expired = searchParams.get('expired');

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            let redirect = searchParams.get('redirect');
            if (!redirect) {
                // Check user type from localStorage
                const userDataStr = localStorage.getItem('userData');
                if (userDataStr) {
                    try {
                        const userData = JSON.parse(userDataStr);
                        if (userData.type === 'USER') {
                            // Check registration status for regular users
                            if (userData.brandRegistrationStatus === 'COMPLETED') {
                                redirect = '/brand/dashboard';
                            } else if (userData.influencerRegistrationStatus === 'COMPLETED') {
                                redirect = '/influencer/dashboard';
                            } else {
                                redirect = '/user/dashboard';
                            }
                        } else if (userData.type === 'BRAND') {
                            redirect = '/brand/dashboard';
                        } else if (userData.type === 'INFLUENCER') {
                            redirect = '/influencer/dashboard';
                        } else {
                            redirect = '/';
                        }
                    } catch (e) {
                        redirect = '/';
                    }
                } else {
                    redirect = '/';
                }
            }
            
            // Only redirect if we're not already on the login page with a redirect param
            // This prevents infinite loops
            if (redirect) {
                router.push(redirect);
            }
        }
    }, [isAuthenticated, router, searchParams]);

    // Show success message for verified email
    useEffect(() => {
        if (verified) {
            toast.success('Email verified successfully! Please sign in with your credentials.');
        }
    }, [verified]);

    const loginAPI = async (email, password) => {
        console.log('Attempting login for:', email); // Debug log
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI2IkpXVCJ9.eyJpZCI6IjY4OGFmODQ1Y2IzNzc4ODVhZjllZTlmMiIsImlhdCI6MTc1MzkzODA5OCwiZXhwIjoxNzU0MDI0NDk4fQ.L2HKgeVwN7GCPEDwL2T21ek_rn_Zn5UDIo1v66PpmH8'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login API Response:', data); // Debug log
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const googleLoginAPI = async (idToken) => {
        console.log('Attempting Google login'); // Debug log
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/user/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                idToken,
                type: 'USER' // Default user type, can be modified based on your needs
            })
        });

        const data = await response.json();
        console.log('Google Login API Response:', data); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);

        try {
            console.log('Google credential received'); // Debug log
            const result = await googleLoginAPI(credentialResponse.credential);
            
            // Handle successful login
            if (result.token) {
                console.log('Google login successful'); // Debug log
                
                // Store the authentication token in both localStorage and cookies
                authUtils.setToken(result.token);
                
                // Store user data if provided
                const userData = result.user;
                if (userData) {
                    localStorage.setItem('userData', JSON.stringify(userData));
                    if (userData.email) {
                        localStorage.setItem('userEmail', userData.email);
                    }
                }
                
                toast.success('Successfully signed in with Google!');
                
                // Determine redirect based on user type and registration status
                let redirect = searchParams.get('redirect');
                if (!redirect) {
                    const userType = userData?.type;
                    
                    if (userType === 'USER') {
                        // Check registration status for regular users
                        if (userData.brandRegistrationStatus === 'COMPLETED') {
                            redirect = '/brand/dashboard';
                        } else if (userData.influencerRegistrationStatus === 'COMPLETED') {
                            redirect = '/influencer/dashboard';
                        } else {
                            // User hasn't completed any registration
                            redirect = '/user/dashboard';
                        }
                    } else if (userType === 'BRAND') {
                        redirect = '/brand/dashboard';
                    } else if (userType === 'INFLUENCER') {
                        redirect = '/influencer/dashboard';
                    } else {
                        redirect = '/';
                    }
                }
                setTimeout(() => router.push(redirect), 1000);
                
            } else {
                console.log('Google login failed with result:', result); // Debug log
                toast.error(result.message || 'Google login failed');
            }
        } catch (error) {
            console.error('Google login error:', error); // Debug log
            toast.error(error.message || 'Failed to sign in with Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign-In failed');
        toast.error('Google Sign-In was unsuccessful. Please try again.');
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            console.log('Submitting login form'); // Debug log
            const result = await loginAPI(data.email, data.password);
            
            // Handle successful login
            if (result.success || result.token || result.data?.token) {
                console.log('Login successful'); // Debug log
                
                // Store the authentication token in both localStorage and cookies
                const token = result.token || result.data?.token;
                if (token) {
                    authUtils.setToken(token);
                    localStorage.setItem('userEmail', data.email);
                }
                
                // Store user data if provided
                const userData = result.user || result.data?.user;
                if (userData) {
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
                
                toast.success('Login successful! Welcome back!');
                
                // Determine redirect based on user type and registration status
                let redirect = searchParams.get('redirect');
                if (!redirect) {
                    const userType = userData?.type;
                    
                    if (userType === 'USER') {
                        // Check registration status for regular users
                        if (userData.brandRegistrationStatus === 'COMPLETED') {
                            redirect = '/brand/dashboard';
                        } else if (userData.influencerRegistrationStatus === 'COMPLETED') {
                            redirect = '/influencer/dashboard';
                        } else {
                            // User hasn't completed any registration
                            redirect = '/user/dashboard';
                        }
                    } else if (userType === 'BRAND') {
                        redirect = '/brand/dashboard';
                    } else if (userType === 'INFLUENCER') {
                        redirect = '/influencer/dashboard';
                    } else {
                        redirect = '/';
                    }
                }
                setTimeout(() => router.push(redirect), 1000);
                
            } else {
                console.log('Login failed with result:', result); // Debug log
                toast.error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error); // Debug log
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Show loading if checking authentication
    if (isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00897B] border-t-transparent"></div>
            </div>
        );
    }

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

            {/* Middle Section - Login Form */}
            <div className="w-full max-w-[30%] flex items-center justify-center p-4 z-10">
                <div className="w-full bg-white rounded-2xl shadow-xl py-6 px-6 border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                        <p className="text-gray-500 text-sm">
                            Login to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type={field.name === 'password' && showPassword ? 'text' : field.type}
                                        placeholder={field.placeholder}
                                        {...register(field.name, field.validation)}
                                        className="w-full px-4 py-1.5 bg-[#F0F0F0]  border-4 rounded-lg focus:ring-2 focus:ring-[#43573B] focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
                                    />
                                    {field.name === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors "
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showPassword ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                )}
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors[field.name].message}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center justify-end pt-1">
                            <Link 
                                href="/forgot-password" 
                                className="text-sm text-gray-900 hover:text-gray-700 font-semibold hover:underline"
                            >
                                forgot password?
                            </Link>
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-start pt-2 pb-2">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-0.5 w-5 h-5 text-[#43573B] bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#43573B] checked:bg-[#43573B] checked:border-[#43573B] cursor-pointer"
                                style={{
                                    accentColor: '#43573B'
                                }}
                            />
                            <label htmlFor="terms" className="ml-3 text-xs text-gray-500 leading-relaxed cursor-pointer">
                                by signing in you agree to <span className="text-gray-600 font-bold">Terms of Service</span> and{' '}
                                <span className="text-gray-600 font-bold">Privacy Policy.</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#43573B] hover:bg-[#2d4a3a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                {/* <div className="w-full border-t border-gray-300"></div> */}
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500 text-xs font-bold">or login with</span>
                            </div>
                        </div>

                        {/* Google Sign-In Button */}
                        <div className="w-full">
                            <button
                                type="button"
                                onClick={() => {
                                    // Trigger the hidden Google login button
                                    const googleBtn = document.querySelector('div[role="button"][aria-labelledby]');
                                    if (googleBtn) {
                                        googleBtn.click();
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border-[#43573B] border-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 text-sm shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                            {/* Hidden Google Login for actual functionality */}
                            <div className="hidden">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap={false}
                                />
                            </div>
                        </div>

                        {/* Don't have account link */}
                        <div className="text-center mt-5">
                            <p className="text-sm text-gray-600">
                                Didn't have an account?{' '}
                                <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                                    Let's create your account
                                </Link>
                            </p>
                        </div>
                    </form>
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

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default function LoginPage() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com';
    
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00897B] border-t-transparent"></div>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </GoogleOAuthProvider>
    );
}