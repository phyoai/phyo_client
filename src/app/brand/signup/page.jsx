import Image from 'next/image'
import React from 'react'
import FormContainer from '../components/FormContainer'

const page = () => {
    const steps = [{
        title: "Brand Registration",
        description: "",
        submit: "Create Account",
        fields: [{ name: "email", type: "email", placeholder: "Email", label: "Email", required: true }, { name: "password", type: "password", placeholder: "Password", label: "Password", required: true }, { name: "confirmPassword", type: "password", placeholder: "Confirm Password", label: "Confirm Password", required: true }],
    }, {
        title: "Create Your Brand Account",
        description: "",
        submit: "Register Your Brand",
        fields: [{ name: "brandName", type: "text", placeholder: "Enter Your Brand Name", label: "Brand Name", required: true }, { name: "website", type: "text", placeholder: "Enter your Website", label: "Website Link (Optional)", required: true }],
    }]
    return (
        <div className='bg-[#F1FFEF] flex gap-5 h-screen p-5'>
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