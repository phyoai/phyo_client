import FormContainer from '../../brand/components/FormContainer'
import Image from 'next/image'
import React, { Suspense } from 'react'

const page = () => {
    const steps = [{
        title: "Influencer Registration",
        description: "",
        submit: "Create Account",
        fields: [{ name: "email", type: "email", placeholder: "Email", label: "Email", required: true }, { name: "password", type: "password", placeholder: "Password", label: "Password", required: true }, { name: "confirmPassword", type: "password", placeholder: "Confirm Password", label: "Confirm Password", required: true }],
    }, {
        title: "Gender Distribution of your audience?",
        description: "",
        submit: "Next",
        fields: [{
            name: "genderDistribution", type: "distribution", placeholder: "Gender Distribution", label: "", required: true, options: [
                { value: "MEN", label: "Men" },
                { value: "WOMEN", label: "Women" }
            ]
        }],
    }, {
        title: "Age Distribution of your audience?",
        description: "",
        submit: "Next",
        fields: [{
            name: "ageDistribution", type: "distribution", placeholder: "Gender Distribution", label: "", required: true, options: [
                { value: "13-17", label: "13-17 Years" },
                { value: "18-24", label: "18-24 Years" },
                { value: "25-34", label: "25-34 Years" },
                { value: "35-44", label: "35-44 Years" },
                { value: "45-54", label: "45-54 Years" },
                { value: "55-64", label: "55-64 Years" },
                { value: "65+", label: "65+ Years" },
            ]
        }],
    }, {
        title: "Where is Your Audience Based?",
        description: "",
        submit: "Next",
        fields: [{
            name: "audienceLocation",
            type: "audienceLocation",
            label: "Where is Your Audience Based?",
            required: true
        }],
    }, {
        title: "Set Your Collaboration Charges",
        description: "Please specify your charges for different types of content collaborations",
        submit: "Done!",
        fields: [{
            name: "collaborationCharges",
            type: "collaborationCharges",
            label: "Collaboration Charges",
            required: true
        }],
    }
        // {
        //     title: "What is Your Profession/Role ?",
        //     description: "",
        //     submit: "Next",
        //     fields: [{ name: "profession", type: "text", placeholder: "e.g Graphic Designer, Illustrator", label: "", required: true }],
        // }, {
        //     title: "How many years of experience do you have ?",
        //     description: "",
        //     submit: "Next",
        //     fields: [{
        //         name: "experience", type: "select", placeholder: "", label: "Years of Experience", required: true, options: [
        //             { value: "1", label: "0-1" },
        //             { value: "2", label: "1-2" },
        //             { value: "2+", label: "2+ years" },
        //         ]
        //     }],
        // }, {
        //     title: "Tell us about your skills",
        //     description: "",
        //     submit: "Next",
        //     fields: [{ name: "description", type: "text", placeholder: "e.g Adobe Photoshop, Figma etc", label: "", required: true }],
        // }, {
        //     title: "Share your work to boost your profile",
        //     description: "",
        //     submit: "Next",
        //     fields: [{ name: "portfolio", type: "text", placeholder: "e.g Behance, Dribble", label: "Portfolio Link", required: true }, { name: "resume", type: "file", placeholder: "Click or drag file to this area to upload", label: "Upload Resume", required: true }],
        // }, {
        //     title: "Let's us know your availability",
        //     description: "",
        //     submit: "Done!!",
        //     fields: [{ name: "availability", type: "radio", placeholder: "e.g Full-Time, PART-TIME", label: "", options: [
        //         {label: "Full Time", value: "FULL_TIME"},
        //         {label: "Half Time", value: "HALF_TIME"},
        //         {label: "Freelance", value: "FREELANCE"},
        //     ], required: true }],
        // }
    ]
    return (
        <div className='bg-[#F1FFEF] flex gap-5 h-screen p-5'>
            <div className='w-1/2'>
                <Image src={"/welcome.png"} width={200} height={300} alt='brand' className='absolute bottom-0 left-0 w-[30%] h-[70%]' />
            </div>
            <div className='bg-white rounded-lg w-[50%] h-full'>
                <Suspense fallback={<div>Loading...</div>}>
                    <FormContainer steps={steps} />
                </Suspense>
            </div>
        </div>
    )
}

export default page