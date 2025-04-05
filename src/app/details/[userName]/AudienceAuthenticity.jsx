import React from 'react'
import { Heading } from './ContentTypeDistribution'

const AudienceAuthenticity = ({ creator }) => {
    return (
        <div>
            <Heading text={"Audience authenticity"} />
            <div className='bg-white px-[40px] py-[13px] rounded-xl text-center max-w-[250px] shadow-sm mt-[20px]'>
                <p className='font-medium text-[14px] text-[#86848B]'>Authentic Followers</p>
                <p className='font-bold text-[24px]'>{(100 - creator?.pctFakeFollowers).toFixed(2) + "%"}</p>
            </div>
        </div>
    )
}

export default AudienceAuthenticity