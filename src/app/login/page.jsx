'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

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

    const loginAPI = async (email, password) => {
        console.log('Attempting login for:', email); // Debug log
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
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
                const redirect = searchParams.get('redirect') || '/dashboard';
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section */}
                    <div className="lg:w-1/2 bg-gradient-to-br from-green-500 to-green-600 p-12 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold mb-2">
                                    <span className="text-white">Phyo</span>
                                </h1>
                                <div className="w-20 h-1 bg-white mx-auto rounded-full"></div>
                            </div>
                            <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
                            <p className="text-lg text-green-100 leading-relaxed">
                                Find the right creators.<br />
                                Run better campaigns.<br />
                                <span className="font-semibold">All in one place.</span>
                            </p>
                            <div className="mt-8 flex justify-center space-x-4">
                                <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                                <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                                <div className="w-3 h-3 bg-white rounded-full opacity-40"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="lg:w-1/2 p-12">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                                <p className="text-gray-600">Sign in to your account</p>
                            </div>

                            {/* Success message for verified email */}
                            {verified && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                                    <div className="flex items-center">
                                        <span className="mr-2">✅</span>
                                        Email verified successfully! Please sign in with your credentials.
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                                    <div className="flex items-center">
                                        <span className="mr-2">⚠️</span>
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {formFields.map((field) => (
                                    <div key={field.name} className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                {field.icon}
                                            </span>
                                            <input
                                                type={field.name === 'password' && showPassword ? 'text' : field.type}
                                                placeholder={field.placeholder}
                                                {...register(field.name, field.validation)}
                                                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                                            />
                                            {field.name === 'password' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPassword ? '🙈' : '👁️'}
                                                </button>
                                            )}
                                        </div>
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="mr-1">⚠️</span>
                                                {errors[field.name].message}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <Link 
                                        href="/forgot-password" 
                                        className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Signing In...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span className="mr-2">🚀</span>
                                            Sign In
                                        </div>
                                    )}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                                    >
                                        <span className="mr-2">🔵</span>
                                        <span className="font-medium text-gray-700">Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                                    >
                                        <span className="mr-2">📘</span>
                                        <span className="font-medium text-gray-700">Facebook</span>
                                    </button>
                                </div>

                                <div className="text-center pt-6 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        Don't have an account?{' '}
                                        <Link 
                                            href="/signup" 
                                            className="text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
                                        >
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}