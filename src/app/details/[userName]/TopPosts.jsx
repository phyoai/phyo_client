import React from 'react'
import { Heading } from './ContentTypeDistribution'
import { posts } from '../../data/data'


const TopPosts = () => {
    return (
        <div>
            <div>
                <Heading text={"Instagram sponsered post analysis"} />
                <p className='text-[24px] font-semibold mt-[12px] mb-[28px] bg-white py-[42px] w-[50%] text-center rounded-3xl shadow-lg'>Sponsored post ratio 30%</p>
            </div>
            <Table />
        </div>
    )
}

const Table = () => {
    return (
        <div>
            <Heading text={"Top 3 most engaging content"} />
            <table className='mt-[30px]'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th className='text-[#86848B] text-[12px] px-4'>Avg. engagement rate</th>
                        <th className='text-[#86848B] text-[12px] px-4'>Avg. view rate</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.map((post) => {
                            return <tr>
                                <td className='py-4'><img src={post.image} alt="post" width={70} height={70} className='rounded-lg' /></td>
                                <td className='p-4'><span className=''>
                                    <p className='font-medium'>{post.title}</p>
                                    <p className='text-[14px] text-[#86848B]'>{post.date}</p>
                                </span></td>
                                <td className='p-4 text-center font-bold'>{post.avgEngagementRate}</td>
                                <td className='p-4 text-center font-bold'>{post.avgViewRate}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TopPosts