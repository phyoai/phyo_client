import { ChartColumnIncreasing, Eye, Facebook, Heart, Instagram, ThumbsUp, Youtube } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const InfluencerCard = ({ influencer }) => {
    const router = useRouter()
    function loadImage(url) {
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
    return (
        <div className='bg-[#ffffff] rounded-lg flex justify-between overflow-hidden  shadow-md sm:mx-[350px] cursor-pointer' onClick={() => router.push(`/details/${influencer.user_name}`)}>
            <img src={loadImage(influencer?.image)} alt="profile" width={50} height={50} className='w-[280px] aspect-square rounded-full relative -top-[50px] -left-[50px]' />
            <div className='mr-auto flex flex-col gap-[15px] self-center ml-[50px]'>
                <p className='font-medium text-[24px] relative -left-[30px]'>{influencer?.name}</p>
                <span className='flex items-center gap-[6px]'>
                    <p className='mr-[10px]'>Type</p>
                    <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)]'>{influencer?.categoryYouTube}</p>
                    <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)]'>{influencer?.categoryInstagram}</p>
                    {/* {
                        influencer?.type?.map((type) => {
                            return <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)]'>{type}</p>
                        })
                    } */}
                </span>
                <p>Total Followers <span className='font-semibold'>{influencer?.instagramData?.followers + influencer?.youtubeData?.followers}</span></p>
                <p>Followers</p>
                <span className='flex gap-4'>
                    <p className='flex gap-2 bg-[color:var(--dark-green)] px-4 py-2 rounded-md text-white'>
                        <Youtube />
                        {influencer?.youtubeData?.followers}
                    </p>
                    <p className='flex gap-2 bg-[color:var(--dark-green)] px-4 py-2 rounded-md text-white'>
                        <Instagram />
                        {influencer?.instagramData?.followers}
                    </p>
                </span>
            </div>

            <div className='bg-[#F5F5F5] px-[41px] py-[30px] flex flex-col justify-end relative'>
                <Heart className='absolute top-[5%] right-[5%] text-[color:var(--green)]' />
                <span>
                    <p className='font-medium text-[12px] text-[#86848B] flex items-center gap-2'>Engagement Rate <ThumbsUp size={18} /></p>
                    <p className='font-semibold text-[20px] text-[#312F39]'>{influencer?.instagramData?.averageEngagement}</p>
                </span>
                <span>
                    <p className='font-medium text-[12px] text-[#86848B] flex gap-2 items-center'>Average Likes <ChartColumnIncreasing size={18} /></p>
                    <p className='font-semibold text-[20px] text-[#312F39]'>{influencer?.instagramData?.averageLikes}</p>
                </span>
                <span>
                    <p className='font-medium text-[12px] text-[#86848B] flex gap-2 items-center'>View rate <Eye size={18} /></p>
                    <p className='font-semibold text-[20px] text-[#312F39]'>{influencer?.instagramData?.averageViews}</p>
                </span>
            </div>
        </div>
    )
}

export default InfluencerCard






