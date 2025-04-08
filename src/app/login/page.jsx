'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    const router = useRouter()

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios({
                method: "post",
                baseURL: "https://api.phyo.ai/api",
                url: "/user/login",
                data,
                withCredentials: true
            })
            alert(`Login Successful: ${response.data.message}`);
            router.push("/")
        } catch (error) {
            alert(`Login Failed: ${error.response?.data?.message || 'Something went wrong!'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen auth-gradient">
            {/* Left Section */}
            <div className="hidden lg:flex flex-1 items-center justify-center  p-10">
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
            <div className="flex-1 flex items-center justify-center p-6 bg-white ">
                <div className="max-w-md w-full">
                    <h2 className="text-[40px] font-semibold mb-4">Login</h2>
                    <p className="text-gray-500 mb-6">Welcome back</p>

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

                        <div className="flex justify-between items-center">
                            <label className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" className="form-checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-500 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[color:var(--green)] py-[10px] text-white cursor-pointer">
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className="text-sm text-center mt-4">
                            Don’t have an account?{' '}
                            <Link href="/signup" className="text-blue-500 hover:underline">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}





