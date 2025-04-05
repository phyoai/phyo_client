import Image from 'next/image'
import React from 'react'

const Benefits = () => {
    const benefitsArr = [
        {
            title: "Share of Voice",
            description: "Explore the right creators to promote your brand with data at first.",
            img: "/share.png",
        },
        {
            title: "Market Positioning",
            description: "Benchmark against your competitors for the number of influencers they",
            img: "/competitor.png",
        },
        {
            title: "Influencer Overlap",
            description: "Get the impact of your influencer marketing campaign in real time.",
            img: "/overlap.png"
        }
    ]
    return (
        <div className='flex flex-wrap justify-between gap-[20px] py-[50px] px-[10px] md:px-[100px] bg-[#FBFBFB] my-[50px]'>
            {
                benefitsArr.map((ele) => {
                    return <div key={ele.title} className='flex flex-col items-center text-center sm:w-full md:w-[30%]'>
                        <div className='px-[px] py-[30px] sm:px-[20px] border-4 border-[color:var(--light-green)] flex justify-center items-center rounded-lg'>
                            <Image width={266} height={266} src={ele.img} alt='benefit' />
                        </div>
                        <h3 className='font-bold text-[16px] sm:text-[18px] mt-[15px]'>{ele.title}</h3>
                        <p className='text-[16px] max-w-[90%] sm:max-w-[100%]'>{ele.description}</p>
                    </div>
                })
            }
        </div>
    )
}

export default Benefits;
