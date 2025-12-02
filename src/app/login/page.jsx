'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { loadGoogleScript } from '@/utils/googleAuth';

const formFields = [
    {
        name: 'email',
        label: 'Email Address',
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
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    // Check for verification success message
    const verified = searchParams.get('verified');

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(redirect);
        }
    }, [isAuthenticated, router, searchParams]);

    // Initialize Google Sign-In
    useEffect(() => {
        const initGoogle = async () => {
            try {
                await loadGoogleScript();
                const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
                
                if (window.google && clientId) {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleGoogleCallback,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });

                    // Render button in the google-signin-button div
                    const buttonDiv = document.getElementById('google-signin-button');
                    if (buttonDiv) {
                        window.google.accounts.id.renderButton(
                            buttonDiv,
                            {
                                theme: 'outline',
                                size: 'large',
                                width: buttonDiv.offsetWidth,
                                text: 'continue_with',
                                shape: 'rectangular',
                            }
                        );
                    }
                }
            } catch (error) {
                console.error('Failed to initialize Google Sign-In:', error);
            }
        };

        initGoogle();
    }, []);

    const loginAPI = async (email, password) => {
        console.log('Attempting login for:', email); // Debug log
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
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
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
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

    const handleGoogleCallback = async (response) => {
        setGoogleLoading(true);
        setError('');

        try {
            console.log('Google credential received'); // Debug log
            const result = await googleLoginAPI(response.credential);
            
            // Handle successful login
            if (result.token) {
                console.log('Google login successful'); // Debug log
                
                // Store the authentication token
                localStorage.setItem('authToken', result.token);
                
                // Store user data if provided
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    if (result.user.email) {
                        localStorage.setItem('userEmail', result.user.email);
                    }
                }
                
                // Redirect to dashboard or requested page
                const redirect = searchParams.get('redirect') || '/';
                router.push(redirect);
                
            } else {
                console.log('Google login failed with result:', result); // Debug log
                setError(result.message || 'Google login failed');
            }
        } catch (error) {
            console.error('Google login error:', error); // Debug log
            setError(error.message || 'Failed to sign in with Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // This function is no longer needed as we're using the rendered button
        // but keeping it for backward compatibility
        if (window.google) {
            window.google.accounts.id.prompt();
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            console.log('Submitting login form'); // Debug log
            const result = await loginAPI(data.email, data.password);
            
            // Handle successful login
            if (result.success || result.token || result.data?.token) {
                console.log('Login successful'); // Debug log
                
                // Store the authentication token
                const token = result.token || result.data?.token;
                if (token) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userEmail', data.email);
                }
                
                // Store user data if provided
                if (result.user || result.data?.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user || result.data.user));
                }
                
                // Redirect to dashboard or requested page
                const redirect = searchParams.get('redirect') || '/';
                router.push(redirect);
                
            } else {
                console.log('Login failed with result:', result); // Debug log
                setError(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error); // Debug log
            setError(error.message || 'An unexpected error occurred');
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
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Section - Illustration with Green Background */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#F1FFEF] relative">
                {/* Logo - Top Left */}
                <div className="absolute top-8 left-8 z-10">
                    <h1 className="text-3xl font-bold text-gray-900">phyo</h1>
                </div>

                {/* Illustration Container */}
                <div className="w-full h-full flex items-center justify-center p-12">
                    <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                        {/* Social Media Icons - Positioned around illustration */}
                        <div className="absolute top-1/4 left-16 w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center z-10 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </div>
                        
                        <div className="absolute top-1/3 left-32 w-12 h-12 bg-[#2C3E50] rounded-full flex items-center justify-center z-10 shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                            </svg>
                        </div>

                        {/* Main Illustration - Centered */}
                        <div className="relative flex items-center justify-center">
                            <img 
                                src="/welcome.png" 
                                alt="Welcome Illustration" 
                                className="w-full max-w-lg object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F1FFEF] min-h-screen p-8">
                <div className="w-full max-w-md bg-white rounded-3xl  shadow-md p-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-[#00897B] font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Success message for verified email */}
                    {verified && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                            <div className="flex items-center">
                                <span className="mr-2">✅</span>
                                Email verified successfully! Please sign in with your credentials.
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            <div className="flex items-center">
                                <span className="mr-2">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type={field.name === 'password' && showPassword ? 'text' : field.type}
                                        placeholder={field.placeholder}
                                        {...register(field.name, field.validation)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                                    />
                                    {field.name === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                    <p className="text-red-500 text-sm mt-1.5">
                                        {errors[field.name].message}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center justify-end">
                            <Link 
                                href="/forgot-password" 
                                className="text-sm text-[#00897B] hover:text-[#00796B] font-medium hover:underline"
                            >
                                Forgot Password
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#00674F] hover:bg-[#00796B] text-white font-semibold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        {/* Google Sign-In Button Container */}
                        <div id="google-signin-button" className="w-full"></div>

                        {/* Fallback Custom Button (hidden by default, shown if Google button fails) */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            className="w-full hidden items-center bg-[#F4F7FF] justify-center gap-3 px-4 py-3.5 hover:scale-105 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            id="fallback-google-button"
                        >
                            {googleLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                                    <span className="font-medium text-gray-700">Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="font-medium text-gray-700">Continue with Google</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00897B] border-t-transparent"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}