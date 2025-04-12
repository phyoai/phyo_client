import LoginPopup from "../../components/LoginPopup"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Hero = ({ handleSubmit, token }) => {
    const [prompt, setPrompt] = useState("")
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleFind = () => {
        if (!token) {
            setIsPopupOpen(true);
            return;
        }
        handleSubmit(prompt)
    }

    useEffect(() => {
        const savedPrompt = localStorage.getItem("searchPrompt")
        console.log("Saved prompt:", savedPrompt);
        
        if (savedPrompt) {
            console.log("Running in the if");
            
            setPrompt(savedPrompt)
            localStorage.removeItem("searchPrompt")
        }
        console.log("Running out of if");
    }, [])

    return (
        <div className='relative'>

            <video autoPlay loop muted playsInline className='absolute top-0 left-0 w-full h-screen  object-cover z-[-1]'>
                <source src="/anim.mp4" type="video/mp4" />
            </video>

            <h1 className="text-[32px] sm:text-[34px] items-center text-[#312F39] mx-auto text-center font-bold relative">
                Phyo: World's Only Influencer Search Engine
            </h1>
            <h2 className='text-[28px] font-medium text-center'>Search Influencers in Seconds</h2>


            <p className="text-center text-[#59565F] mt-2 text-[9px] sm:text-[16px] sm:w-[40%] w-[80%] mx-auto">
                Phyo is your AI-powered solution for modern influencer marketing. Find creators in seconds, analyze their audience quality, and collaborate seamlessly. Track campaigns in real-time, compare costs, and optimize strategies, all in one platform. Built for brands and agencies aiming to save time and achieve measurable results without the guesswork.
            </p>

            <div className="flex items-center mt-[75px] justify-center mx-[10px]">
                <div className="flex items-center justify-between w-full max-w-4xl border-2 border-green-700 rounded-full p-2 bg-white">
                    <input value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" placeholder="Example: I want to find best influencer fashion industry" className="w-full outline-none px-4 text-gray-600 placeholder:text-gray-400 text-sm bg-transparent" />
                    <button onClick={handleFind} className="bg-[#00674F] text-white rounded-full px-6 py-2 text-sm">
                        Find
                    </button>
                </div>
            </div>
            <Image src={"/star1.png"} width={60} height={60} alt='star' className='hidden sm:block absolute top-[20%] left-[15%]' />
            <Image src={"/star2.png"} width={50} height={50} alt='star' className='absolute sm:bottom-[20%] sm:right-[5%] left-[5%] top-[-10%]' />

            <LoginPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} prompt={prompt} />
        </div>
    )
}

export default Hero




