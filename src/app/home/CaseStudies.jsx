import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

const CaseStudies = () => {
    const caseStudiesData = ["", "", "", "", "", "", "", ""]
    return (
        <section className='my-[90px]'>
            <h2 className='text-[50px] font-bold text-center mb-[50px]'>Case Studies</h2>
            <div className='px-[100px]'>
                <Swiper
                    slidesPerView={3.5}
                    spaceBetween={20}
                >
                    {
                        caseStudiesData.map((ele, index) => {
                            return <SwiperSlide key={index} className='overflow-visible case_studies_card p-[20px]'>
                                <div className='w-full h-[550px]'>

                                </div>
                            </SwiperSlide>
                        })
                    }
                </Swiper>
            </div>
        </section>
    )
}

export default CaseStudies