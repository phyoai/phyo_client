'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const formFields = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'John',
        validation: { required: 'Name is required' },
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'example@gmail.com',
        validation: { required: 'Email is required' },
    },
    {
        name: 'mobileNumber',
        label: 'Phone number',
        type: 'tel',
        placeholder: '1234567890',
        validation: { required: 'Phone number is required' },
    },
    {
        name: 'agencyName',
        label: 'Agency/Brand name',
        type: 'text',
        placeholder: 'PyroMedia',
        validation: { required: 'Agency/Brand name is required' },
    },
    {
        name: 'website',
        label: 'Link to website',
        type: 'text',
        placeholder: 'www.yourcompanyname.com',
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'password',
        validation: { required: 'Password is required' },
    },
];

export default function SignupForm() {
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
                baseURL: "http://localhost:8000/api",
                url: "/user/signup",
                data,
            })
            alert(`Signup Successful: ${response.data.message}`);
            router.push("/")
        } catch (error) {
            alert(`Signup Failed: ${error.response?.data?.message || 'Something went wrong!'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen auth-gradient">
            {/* Left Section */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-10">
                <div>
                    <h1 className="text-4xl font-bold text-black">
                        <span className="text-green-600">Phyo</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                    Find influencers in seconds. Launch campaigns in minutes.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="max-w-md w-full">
                    <h2 className="text-[40px] font-semibold mb-4">Register</h2>

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

                        <button type="submit" disabled={loading} className="w-full bg-[color:var(--green)] py-[10px] text-white cursor-pointer">
                            {loading ? 'Signing up...' : 'Create'}
                        </button>

                        <p className="text-sm text-center mt-4">
                            Have an account?{' '}
                            <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
