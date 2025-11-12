'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const formFields = [
    {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        validation: { required: 'Name is required' },
        icon: '👤'
    },
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'johndoe',
        validation: { required: 'Username is required' },
        icon: '@'
    },
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
        placeholder: 'Create a strong password',
        validation: { 
            required: 'Password is required',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
            }
        },
        icon: '🔒'
    },
];

function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpLoading, setOtpLoading] = useState(false);
    const [signupData, setSignupData] = useState(null);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(redirect);
        }
    }, [isAuthenticated, router, searchParams]);

    const signupAPI = async (userData) => {
        console.log('Sending signup data:', userData); // Debug log
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODlhY2E1YTA0MTM5NjE0ODM4OWNmNSIsImlhdCI6MTc1Mzg1MzIyNiwiZXhwIjoxNzUzOTM5NjI2fQ.lep_xGBaaSJDUH68SCspcrudeybsmtwBpeRkJolKlBY'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log('API Response:', data); // Debug log
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const verifyOTPAPI = async (email, otpCode) => {
        console.log('Verifying OTP for:', email, 'with code:', otpCode); // Debug log
        
        // Replace with your actual OTP verification endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODlhY2E1YTA0MTM5NjE0ODM4OWNmNSIsImlhdCI6MTc1Mzg1MzIyNiwiZXhwIjoxNzUzOTM5NjI2fQ.lep_xGBaaSJDUH68SCspcrudeybsmtwBpeRkJolKlBY'
            },
            body: JSON.stringify({ email, otp: otpCode })
        });

        const data = await response.json();
        console.log('OTP Verification Response:', data); // Debug log
        console.log('OTP Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const userData = {
                ...data,
                type: 'USER' // Set to USER as requested
            };

            console.log('Submitting form with data:', userData); // Debug log
            const result = await signupAPI(userData);
            console.log('Signup result:', result); // Debug log
            
            // More flexible response handling
            if (result.success || result.message?.includes('OTP') || result.status === 'success' || result.data) {
                console.log('OTP should be sent, showing OTP screen'); // Debug log
                setSignupData(userData);
                setShowOTP(true);
            } else {
                console.log('Unexpected response format:', result); // Debug log
                // Still show OTP screen if we got a response (assuming OTP was sent)
                setSignupData(userData);
                setShowOTP(true);
            }
        } catch (error) {
            console.error('Signup error:', error); // Debug log
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setOtpLoading(true);
        setError('');

        try {
            console.log('Attempting OTP verification...'); // Debug log
            const result = await verifyOTPAPI(signupData.email, otpCode);
            console.log('OTP verification result:', result); // Debug log
            
            // More flexible success handling
            if (result.success || result.message?.includes('verified') || result.status === 'success' || result.verified) {
                console.log('OTP verified successfully, redirecting to login...'); // Debug log
                
                // Store token if provided
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }
                
                // Small delay to show success, then redirect
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 1000);
                
                // Show success message
                setError(''); // Clear any errors
                // You could set a success state here if you want to show a success message
                
            } else {
                console.log('OTP verification failed with result:', result); // Debug log
                setError(result.message || 'OTP verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error); // Debug log
            
            // If the error message indicates success, still redirect
            if (error.message?.includes('verified') || error.message?.includes('success')) {
                console.log('Error message indicates success, redirecting anyway...'); // Debug log
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 1000);
            } else {
                setError(error.message || 'OTP verification failed');
            }
        } finally {
            setOtpLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!signupData) return;
        
        try {
            await signupAPI(signupData);
            setError('');
            // Show success message or toast
        } catch (error) {
            setError('Failed to resend OTP');
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

    if (showOTP) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📧</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to<br />
                            <span className="font-semibold text-green-600">{signupData?.email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center space-x-3 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleOTPSubmit}
                        disabled={otpLoading || otp.join('').length !== 6}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                        {otpLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Verifying...
                            </div>
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-600 mb-2">Didn't receive the code?</p>
                        <button
                            onClick={resendOTP}
                            className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
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
                            <h2 className="text-2xl font-semibold mb-4">Welcome to the Future</h2>
                            <p className="text-lg text-green-100 leading-relaxed">
                                Find influencers in seconds.<br />
                                Launch campaigns in minutes.<br />
                                <span className="font-semibold">Join thousands of creators today.</span>
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
                                <h2 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
                                <p className="text-gray-600">Start your journey with us today</p>
                            </div>

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
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                {...register(field.name, field.validation)}
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                                            />
                                        </div>
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="mr-1">⚠️</span>
                                                {errors[field.name].message}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span className="mr-2">🚀</span>
                                            Create Account
                                        </div>
                                    )}
                                </button>

                                <div className="text-center pt-6 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        Already have an account?{' '}
                                        <Link 
                                            href="/login" 
                                            className="text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
                                        >
                                            Sign In
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

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}