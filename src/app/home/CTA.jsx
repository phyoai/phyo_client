import { Gem } from 'lucide-react'
import React from 'react'

const CTA = ({ audience, headline, text }) => {
    return (
        <div className='flex flex-col gap-5 items-start bg-[#FBFBFB] px-8 py-16 md:px-[100px] md:py-[130px]'>
            <span className="relative inline-block rounded-full p-[5px] bg-gradient-to-r from-green-500 to-green-100">
                <p className="font-bold text-[16px] border border-[color:var(--dark-green)] rounded-full flex gap-2 px-[16px] py-[12px] bg-white">
                    <Gem color="#00674F" /> For {audience}
                </p>
            </span>
            <h2 className='font-bold text-[24px] sm:text-[30px] md:text-[34px] max-w-full md:max-w-[40%]'>{headline}</h2>
            <p className='max-w-full sm:max-w-[80%] md:max-w-[45%]'>{text}</p>
            <span className='flex gap-2 flex-col sm:flex-row'>
                <button className='bg-[color:var(--green)] text-white font-bold px-[32px] py-[14px] rounded-lg'>
                    Request For Demo
                </button>
                <button className='bg-[color:var(--light-green)] border border-[color:var(--dark-green)] text-[color:var(--dark-green)] font-bold px-[32px] py-[14px] rounded-lg'>
                    Try For Free
                </button>
            </span>
        </div>
    )
}

export default CTA;
