import React, { useState } from 'react'
import { Card, Heading } from './ContentTypeDistribution';
import { ageDistributionData, creatorData } from '@/data/data';

const AudienceNewDesign = ({ creator }) => {
    const [active, setActive] = useState("all")
    return (
        <>
            <div className='flex gap-[20px]'>
                <button className={`${active === "all" ? "bg-[color:var(--dark-green)] text-white" : "bg-transparent text-gray-400"}  font-semibold px-4 py-2 rounded-xl`} onClick={() => setActive("all")}>All</button>
                <button className={`${active === "instagram" ? "bg-[color:var(--dark-green)] text-white" : "bg-transparent text-gray-400"}  font-semibold px-4 py-2 rounded-xl`} onClick={() => setActive("instagram")}>Instagram</button>
                <button className={`${active === "youtube" ? "bg-[color:var(--dark-green)] text-white" : "bg-transparent text-gray-400"}  font-semibold px-4 py-2 rounded-xl`} onClick={() => setActive("youtube")}>Youtube</button>
            </div>
            <h1 className='font-bold text-[32px] text-[color:var(--dark-green)]'>Audience</h1>
            <div className='bg-white  p-[20px] rounded-xl'>
                {/* <div className='flex flex-col gap-[50px]'> */}
                <div className='flex flex-col sm:flex-row gap-2 justify-center'>
                    {
                        (active === "all" || active === "instagram") && <div className='flex flex-col gap-[50px]'>
                            <GenderDistribution data={creator.instagramData.genderDistribution} title={active !== "all" ? "Gender Distibution" : "Instagram Gender Distibution"} />
                            <AgeDistribution data={creator.instagramData.ageDistribution} title={active !== "all" ? "Age Distibution" : "Instagram Age Distibution"} />
                            <AudienceByCountry data={creator.instagramData.audienceByCountry} title={active !== "all" ? "Top Cities" : "Instagram Top Cities"} />
                        </div>
                    }
                    {(active === "all" || active === "youtube") && <div className='flex flex-col gap-[50px]'>
                        <GenderDistribution data={creator.youtubeData.genderDistribution} title={active !== "all" ? "Gender Distibution" : "Youtube Gender Distibution"} />
                        <AgeDistribution data={creator.youtubeData.ageDistribution} title={active !== "all" ? "Age Distibution" : "Youtube Age Distibution"} />
                        <AudienceByCountry data={creator.youtubeData.audienceByCountry} title={active !== "all" ? "Top Countries" : "Youtube Top Countries"} />
                    </div>}
                </div>
                {/* </div> */}
            </div>
        </>
    )
}

export default AudienceNewDesign

function GenderDistribution({ title, data }) {
    return (
        <div className=''>
            <Heading text={title} />
            <span className='flex gap-[20px] justify-center'>
                {
                    data?.map((ele)=>{
                        return <Card title={ele.gender} data={ele.distribution} key={ele.distribution} />
                    })
                }
            </span>
        </div>
    )
}


export function AudienceByCountry({ data, title }) {
    return (
        <div className='' >
            <Heading text={title} />
            <div className='max-w-[50%] mx-auto flex flex-col items-center'>
                <div className='px-[30px] flex flex-col gap-[20px]'>
                    <div className='flex border-b pb-[10px] my-[20px]'>
                        <p className='w-[100px]'>Country</p>
                        <p>Progress</p>
                    </div>
                    {
                        data?.map((ele, i) => {
                            return <div className='flex' key={i}>
                                <p className='w-[100px] capitalize'>{ele.category}</p>
                                <span className='bg-[color:var(--light-grey)] w-[200px] relative h-[10px] rounded-md overflow-hidden'>
                                    <span className="bg-[#3CB448] h-full absolute top-0 left-0" style={{ width: ele.value * 100 + "%" }}></span>
                                </span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export function AgeDistribution({ data, title }) {
    return (
        <div className=''>
            <Heading text={title} />
            <div className=' flex flex-col items-center'>
                <div className=' flex flex-col gap-[20px] '>
                    {
                        data?.map((ele) => {
                            return <div className='flex items-center gap-2' key={ele.age}>
                                <p className=' capitalize'>{ele.age}</p>
                                <span className='bg-[color:var(--light-grey)] w-[200px] relative h-[20px] rounded-2xl '>
                                    <span className="bg-[#3CB448] h-full absolute top-0 left-0 rounded-r-2xl" style={{ width: ele.value + "%" }}></span>
                                </span>
                                <p className='whitespace-nowrap capitalize'>{ele.value}%</p>
                            </div>
                        })
                    }
                    <div className='flex items-center gap-2'>
                        <p className=' capitalize'>Age</p>
                        <span className=' w-[180px] relative h-[10px] rounded-md overflow-hidden'></span>
                        <p className=' capitalize'>Percentage</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
