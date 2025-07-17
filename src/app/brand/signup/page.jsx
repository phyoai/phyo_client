import Image from 'next/image'
import React from 'react'
import FormContainer from '../components/FormContainer'

const page = () => {
    const steps = [{
        title: "Brand Registration",
        description: "Create your account to get started",
        submit: "Create Account",
        fields: [
            { name: "email", type: "email", placeholder: "Enter your email", label: "Email", required: true },
            { name: "password", type: "password", placeholder: "Create a password", label: "Password", required: true },
            { name: "confirmPassword", type: "password", placeholder: "Confirm your password", label: "Confirm Password", required: true }
        ],
    }, {
        title: "Create Your Brand Account",
        description: "Tell us about your brand",
        submit: "Register Your Brand",
        fields: [
            { name: "brandName", type: "text", placeholder: "Enter Your Brand Name", label: "Brand Name", required: true },
            { name: "industry", type: "select", placeholder: "Select your industry", label: "Industry", required: true, options: [
                { value: "technology", label: "Technology" },
                { value: "fashion", label: "Fashion & Beauty" },
                { value: "food", label: "Food & Beverage" },
                { value: "health", label: "Health & Fitness" },
                { value: "travel", label: "Travel & Tourism" },
                { value: "education", label: "Education" },
                { value: "finance", label: "Finance" },
                { value: "sports", label: "Sports" },
                { value: "entertainment", label: "Entertainment" },
                { value: "automotive", label: "Automotive" },
                { value: "real_estate", label: "Real Estate" },
                { value: "general", label: "Other" }
            ]},
            { name: "website", type: "text", placeholder: "Enter your website (optional)", label: "Website Link", required: false }
        ],
    }]
    return (
        <div className='bg-[#0000] flex gap-5 h-screen p-5'>
            <div className='w-1/2'>
                <Image src={"/welcome.png"} width={200} height={300} alt='brand' className='absolute bottom-0 left-0 w-[30%] h-[70%]' />
            </div>
            <div className='bg-white rounded-lg w-[50%] h-full'>
                <FormContainer steps={steps} />
            </div>
        </div>
    )
}

export default page