import React from 'react'

const ContentTypeDistribution = () => {
    const contentTypes = [
        {
            category: "Travel",
            share: 67,
        },
        {
            category: "Food",
            share: 27,
        },
        {
            category: "Technology",
            share: 6,
        },
    ]
    return (
        <div>
            <Heading text={"Instagram content type distribution"} />
            <div className='flex gap-[20px] mt-[14px]'>
                {
                    contentTypes.map((type) => {
                        return <Card title={type.category} data={type.share} />
                    })
                }
            </div>
        </div>
    )
}

export default ContentTypeDistribution


export const Heading = ({ text }) => {
    return (
        <h2 className='font-medium text-[20px] text-[color:var(--dark-green)]'>{text}</h2>
    )
}

export const Card = ({ title, data }) => {
    return (
        <div className='bg-[color:var(--dark-green)] px-[40px] py-[13px] rounded-xl text-center w-[150px] shadow-sm'>
            <p className='font-medium text-[14px] text-white'>{title}</p>
            <p className='font-bold text-[24px] text-white'>{data}%</p>
        </div>
    )
}