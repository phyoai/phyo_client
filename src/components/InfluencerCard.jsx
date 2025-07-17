'use client'
import { ChartColumnIncreasing, Eye, Heart, Instagram, ThumbsUp, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const InfluencerCard = ({ influencer }) => {
    const router = useRouter()
    function loadImage(url) {
        if (!url) return '';
        
        let p = url?.split("/") || [""];
        let t = '';
        for (let i = 0; i < p.length; i++) {
            if (i == 2) {
                t += p[i].replaceAll('-', '--').replaceAll('.', '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
            } else {
                if (i != p.length - 1) {
                    t += p[i] + '/';
                } else {
                    t += p[i];
                }
            }
        }
        return encodeURI(t);
    }
    
    // Calculate total followers only if both values exist
    const totalFollowers = 
        influencer?.instagramData?.followers && influencer?.youtubeData?.followers ? 
        influencer.instagramData.followers + influencer.youtubeData.followers : 
        null;
    
    return (
        <div className='bg-white rounded-lg flex justify-between pb-2 overflow-hidden shadow-md sm:mx-96 cursor-pointer' onClick={() => router.push(`/details/${influencer.user_name}`)}>
            {influencer?.image && (
                <img 
                    src={loadImage(influencer.image)} 
                    alt="profile" 
                    width={50} 
                    height={50} 
                    className='w-72 aspect-square rounded-full relative -top-12 -left-12' 
                />
            )}
            <div className='mr-auto flex flex-col gap-4 self-center ml-12'>
                {influencer?.name && (
                    <p className='font-medium text-2xl relative -left-8'>{influencer.name}</p>
                )}
                
                {(influencer?.categoryYouTube || influencer?.categoryInstagram) && (
                    <span className='flex items-center gap-1.5'>
                        <p className='mr-2.5'>Type</p>
                        {influencer?.categoryYouTube && (
                            <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)]'>
                                {influencer.categoryYouTube}
                            </p>
                        )}
                        {influencer?.categoryInstagram && (
                            <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)]'>
                                {influencer.categoryInstagram}
                            </p>
                        )}
                    </span>
                )}
                
                {totalFollowers !== null && (
                    <p>Total Followers <span className='font-semibold'>{totalFollowers}</span></p>
                )}
                
                {(influencer?.youtubeData?.followers || influencer?.instagramData?.followers) && (
                    <>
                        <p>Followers</p>
                        <span className='flex gap-4'>
                            {influencer?.youtubeData?.followers !== null && influencer?.youtubeData?.followers !== undefined && (
                                <p className='flex gap-2 bg-[color:var(--dark-green)] px-4 py-2 rounded-md text-white'>
                                    <Youtube />
                                    {influencer.youtubeData.followers}
                                </p>
                            )}
                            {influencer?.instagramData?.followers !== null && influencer?.instagramData?.followers !== undefined && (
                                <p className='flex gap-2 bg-[color:var(--dark-green)] px-4 py-2 rounded-md text-white'>
                                    <Instagram />
                                    {influencer.instagramData.followers}
                                </p>
                            )}
                        </span>
                    </>
                )}
            </div>

            {/* <div className='bg-gray-100 px-10 py-8 flex flex-col justify-end relative'>
                <Heart className='absolute top-[5%] right-[5%] text-[color:var(--green)]' />
                
                {influencer?.instagramData?.averageEngagement !== null && influencer?.instagramData?.averageEngagement !== undefined && (
                    <span>
                        <p className='font-medium text-xs text-gray-500 flex items-center gap-2'>Engagement Rate <ThumbsUp size={18} /></p>
                        <p className='font-semibold text-xl text-gray-800'>{influencer.instagramData.averageEngagement}</p>
                    </span>
                )}
                
                {influencer?.instagramData?.averageLikes !== null && influencer?.instagramData?.averageLikes !== undefined && (
                    <span>
                        <p className='font-medium text-xs text-gray-500 flex gap-2 items-center'>Average Likes <ChartColumnIncreasing size={18} /></p>
                        <p className='font-semibold text-xl text-gray-800'>{influencer.instagramData.averageLikes}</p>
                    </span>
                )}
                
                {influencer?.instagramData?.averageViews !== null && influencer?.instagramData?.averageViews !== undefined && (
                    <span>
                        <p className='font-medium text-xs text-gray-500 flex gap-2 items-center'>View rate <Eye size={18} /></p>
                        <p className='font-semibold text-xl text-gray-800'>{influencer.instagramData.averageViews}</p>
                    </span>
                )}
            </div> */}
        </div>
    )
}

export default InfluencerCard