import Image from 'next/image'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'; // ← This is crucial
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';


const phasesData = [
    {
        phase: "Before",
        title: "Competitor Analysis",
        description: "Our A.I Driven competitor analysis helps your brand understand what your competitors do in the creator marketing space to stay ahead of the competition, Phyo helps you stay ahead of your competitors.",
        image: "/graphic1.png",
    },
    {
        phase: "During",
        title: "ROI Prediction",
        description: "With our A.I Predictor Meter helps you understand the ROI from your next influencer campaign with the historical data refining technology.",
        image: "/graphic2.png",
    },
    {
        phase: "After",
        title: "Low TAT and Commercials",
        description: "With our fast and smooth campaigns, we offer subsidized commercials for the creators.",
        image: "/graphic3.png",
    },
]

const CompaignPhases = () => {
    return (
        <section>
            <div className='flex flex-col-reverse md:flex-row gap-5 items-center p-6 md:p-[100px]'>
                <div className='phases_pagination flex flex-row sm:flex-col gap-2'></div>
                <div className="flex-grow max-w-full">
                    <Swiper
                        slidesPerView={1}
                        autoplay
                        effect="fade"
                        pagination={{
                            clickable: true,
                            el: ".phases_pagination",
                            renderBullet: (index, className) => {
                                return `<span class="${className} phases_custom_bullet"></span>`;
                            },
                        }}
                        modules={[Autoplay, EffectFade, Pagination]}
                    >
                        {
                            phasesData.map((ele) => {
                                return <SwiperSlide key={ele.title} className='bg-white'>
                                    <div className='flex flex-col'>
                                        <h2 className='text-center font-bold text-[30px] sm:text-[40px] md:text-[50px]'>{ele.phase} The Campaign</h2>
                                        <div className='flex flex-col md:flex-row gap-5'>
                                            <span className='md:w-1/2'>
                                                <h3 className='text-[25px] sm:text-[30px] font-bold'>{ele.title}</h3>
                                                <p className='max-w-full sm:max-w-[80%] md:max-w-[55%]'>{ele.description}</p>
                                            </span>
                                            <div className='w-full md:w-1/2 rounded-md'>
                                                <Image src={ele.image} alt={ele.title} width={550} height={290} layout="responsive" className='rounded-md' />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            })
                        }
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default CompaignPhases;
