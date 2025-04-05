import React from 'react'
import { Heading } from './ContentTypeDistribution'
import { tags } from '../../data/data'



const ContentAnalysis = () => {
  return (
    <div>
        <h1 className='font-bold text-[32px] text-[color:var(--dark-green)] mb-[28px]'>Content Analysis</h1>
        <Heading text={"Instagram sponsered post analysis"} />
        <Table />
    </div>
  )
}

const Table = () => {
    return (
        <div className='bg-white p-8 rounded-3xl mt-[28px]'>
            <h1 className='font-bold text-[32px] mb-[28px]'>Check Table</h1>
            <table className='mt-[30px]'>
                <thead>
                    <tr>
                        <th className='text-[#86848B] text-[12px] pr-[50px] text-left'>Tags</th>
                        <th className='text-[#86848B] text-[12px] px-[100px] text-left'>Rank</th>
                        <th className='text-[#86848B] text-[12px] px-[100px] text-left'>Usage Count</th>
                        <th className='text-[#86848B] text-[12px] px-[100px] text-left'>Engagement</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tags.map((tag) => {
                            return <tr>
                                <td className='text-left font-bold py-4  '>{tag.tag}</td>
                                <td className='text-left font-bold py-4 px-[11%]'>{tag.rank}</td>
                                <td className='text-left font-bold py-4 px-[11%]'>{tag.count}</td>
                                <td className='text-left font-bold py-4 px-[11%]'>{tag.engagement}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ContentAnalysis