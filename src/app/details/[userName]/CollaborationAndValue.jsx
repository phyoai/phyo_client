import React from 'react'
import { Heading } from './ContentTypeDistribution'
import { collabEstimate, mentionedBrands } from '../../data/data'

const CollaborationAndValue = () => {
  return (
    <div>
      <h1 className='font-bold text-[32px] text-[color:var(--dark-green)]'>Collaboration and value</h1>
      <div className='flex'>
        <InstaCollabValueEstimate />
        <MentionedBrands />
      </div>
    </div>
  )
}

export default CollaborationAndValue


const InstaCollabValueEstimate = () => {
  return (
    <div className='flex-grow'>
      <Heading text={"Instagram collaboration value estimate"} />
      <div className='flex flex-col gap-[20px] items-center mt-[20px]'>

        {Object.keys(collabEstimate).map((key) => {
          return <Card text={collabEstimate[key].label} data={collabEstimate[key]?.value?.toString() || `$${collabEstimate[key].low} - $${collabEstimate[key].high}`} />
        })}
      </div>
    </div>
  )
}

const Card = ({ text, data }) => {
  return (
    <div className='bg-white rounded-xl shadow w-[300px] py-[12px] text-center'>
      <p className='font-bold'>{data}</p>
      <p className='font-medium text-[12px] text-[#86848B]'>{text}</p>
    </div>
  )
}



const MentionedBrands = () => {
  return (
    <div className='flex-grow'>
      <Heading text={"Mentioned Brands"} />
      <div className='bg-white rounded-xl mt-[20px]'>
        <table className='w-full'>
          <thead>
            <tr className='border-b '>
              <th className='text-left pl-[32px] pt-[32px]'>Brand name</th>
              <th className='text-left pr-[32px] pt-[32px]'>Mentions</th>
            </tr>
          </thead>
          <tbody>
            {
              mentionedBrands.map((brand) => {
                return <tr>
                  <td className='my-[12px] mx-[10px] '>
                    <span className='flex items-center gap-2 pl-[32px] my-[12px]' >
                      <img src={brand.image} alt="profile" height={30} width={30} className='rounded-full' />
                      {brand.brandName}
                    </span>
                  </td>
                  <td className='my-[12px] mx-[12px] pr-[32px] '>{brand.noOfMentions}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}