'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const formFields = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'example@gmail.com',
        validation: { required: 'Email is required' },
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'password',
        validation: { required: 'Password is required' },
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
        }
    }, [isAuthenticated, router, searchParams]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const result = await login(data.email, data.password);
            
            if (result.success) {
                // Redirect to the original requested URL or default dashboard
                const redirect = searchParams.get('redirect') || '/brand/dashboard';
                router.push(redirect);
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Show loading if checking authentication
    if (isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen auth-gradient">
            {/* Left Section */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-10">
                <div>
                    <h1 className="text-4xl font-bold text-black">
                        <span className="text-green-600">Phyo</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                        Find the right creators. Run better campaigns. All in one place.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="max-w-md w-full">
                    <h2 className="text-[40px] font-semibold mb-4">Login</h2>
                    <p className="text-gray-500 mb-6">Welcome back</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}
                                    className="mt-1 block w-full py-[18px] px-[30px] border border-[#C3C3C3] rounded-md"
                                />
                                {errors[field.name] && (
                                    <p className="text-red-500 text-sm">{errors[field.name].message}</p>
                                )}
                            </div>
                        ))}

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-[color:var(--green)] py-[10px] text-white cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className="text-sm text-center mt-4">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}





