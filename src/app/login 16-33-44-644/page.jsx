'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
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

export default function LoginForm() {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link 
                            href="/brand/signup" 
                            className="font-medium text-[#00674F] hover:text-[#005a43]"
                        >
                            create a new brand account
                        </Link>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm -space-y-px">
                        {formFields.map((field, index) => (
                            <div key={field.name}>
                                <label htmlFor={field.name} className="sr-only">
                                    {field.label}
                                </label>
                                <input
                                    id={field.name}
                                    type={field.type}
                                    autoComplete={field.name}
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00674F] focus:border-[#00674F] focus:z-10 sm:text-sm ${
                                        index === 0 ? 'rounded-t-md' : 'rounded-b-md'
                                    }`}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}
                                />
                                {errors[field.name] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00674F] hover:bg-[#005a43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00674F] disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}





