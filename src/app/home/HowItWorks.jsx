import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination'


const HowItWorks = () => {
    return (
        <div className='flex flex-col gap-[20px] px-[100px]'>
            <div>
                <Swiper
                    slidesPerGroup={1}
                    autoplay
                    pagination={{
                        clickable: true,
                        el: ".pag",
                        renderBullet: (index, className) => {
                            return `<span class="${className} custom-bullet">${index + 1}</span>`;
                        },
                    }}
                    loop
                    modules={[Pagination, Autoplay]}

                >
                    <SwiperSlide>
                        <div className='max-w-[50%] mx-auto'>
                            <h1>Analyze Influencers</h1>
                            <p>No more guessing games—Phyo gives you real-time insights into an influencer's audience, powered by Meta and Google data. It’s 100% authentic, real-world data that helps you make the smartest decisions for your campaign. Get the right influencers. Drive the right results.</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='max-w-[50%] mx-auto'>
                            <h1>Select Influencer</h1>
                            <p>No more guessing games—Phyo gives you real-time insights into an influencer's audience, powered by Meta and Google data. It’s 100% authentic, real-world data that helps you make the smartest decisions for your campaign. Get the right influencers. Drive the right results.</p>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            <span className='pag flex justify-center'></span>
            
        </div>
    )
}

export default HowItWorks