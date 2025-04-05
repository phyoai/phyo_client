import React from 'react'
import { ArrowRight } from 'lucide-react';

const WhyPhyo = () => {
  return (
    <div>
        <h1 className='text-[#312F39] text-[48px] sm:leading-[66px] font-semibold text-center'><span className='text-[34px] font-medium'>Why</span> Phyo.AI?</h1>
        <span className='flex text-[#00674F] justify-center items-center gap-4'><p className='text-center text-[#00674F] font-bold text-[22px] '>Unlock Your First Match for free   </p>  <ArrowRight /></span>
         
        <div className='mt-[52px]'>
               <div className='flex flex-col sm:flex-row gap-2 p-1'>
                      <div className='px-[29px] hover:bg-[#00674F] group hover:text-white py-[46px] bg-[#F3F2EB] rounded-xl'>
                                <h3 className='pb-[12px] font-bold text-[#4F4D59] text-[22px] group-hover:text-white'>AI-Powered Precision</h3>
                                <p className='text-[#606A7A] text-[16px] font-medium group-hover:text-white'>Phyo.AI matches you with influencers based on data—no more guesswork</p>
                        </div>
                      <div className='px-[29px] hover:bg-[#00674F] group hover:text-white w-[1/3] py-[46px] bg-[#F3F2EB] rounded-xl'>
                                <h3 className='pb-[12px] font-bold text-[#4F4D59] text-[22px] group-hover:text-white'>Data-Driven Insights</h3>
                                <p className='text-[#606A7A] text-[16px] font-medium group-hover:text-white'>Go beyond follower counts. Get insights into audience demographics, influencer engagement rates, and authentic reach.</p>
                        </div>
                
               </div>  
               <div className='flex flex-col sm:flex-row gap-2 p-1'>
                      <div className='px-[29px] hover:bg-[#00674F] group hover:text-white py-[46px] bg-[#F3F2EB] rounded-xl'>
                                <h3 className='pb-[12px] font-bold text-[#4F4D59] text-[22px] group-hover:text-white'>Save Time and Money</h3>
                                <p className='text-[#606A7A] text-[16px] font-medium group-hover:text-white'>Our AI does in seconds what would take hours or even days manually. Free up your time and let our algorithms work for you.</p>
                        </div>
                      <div className='px-[29px] hover:bg-[#00674F] group hover:text-white w-[1/3] py-[46px] bg-[#F3F2EB] rounded-xl'>
                                <h3 className='pb-[12px] font-bold text-[#4F4D59] text-[22px] group-hover:text-white'>Verified Influencers</h3>
                                <p className='text-[#606A7A] text-[16px] font-medium group-hover:text-white'>Every influencer in our database is vetted to ensure authenticity, so you can trust the connections you make.</p>
                        </div>
                
               </div>  
               <div className='flex gap-2 p-1'>
                      <div className='px-[55px] w-full hover:bg-[#00674F] group hover:text-white py-[58px] bg-[#F3F2EB] rounded-xl'>
                                <h3 className='pb-[12px] font-bold text-[#4F4D59] text-[22px] group-hover:text-white'>Scalable for Every Business</h3>
                                <p className='text-[#606A7A] text-[16px] font-medium group-hover:text-white'>From startups to enterprise brands, PyroMedia scales to meet your needs, with flexible pricing plans to match your budget.</p>
                        </div>
               </div>  
        </div>
    </div>
  )
}

export default WhyPhyo