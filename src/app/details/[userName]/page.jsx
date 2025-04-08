"use client"
import React, { useState } from 'react'
import  {Sidebar}  from '../../../components/Sidebar'
import Navbar from '../../../components/Navbar'
import ProfileCard from './ProfileCard'
// import Audience from './Audience'
// import ContentTypeDistribution from './ContentTypeDistribution'
// import AudienceAuthenticity from './AudienceAuthenticity'
// import CollaborationAndValue from './CollaborationAndValue'
// import TopPosts from './TopPosts'
// import ContentAnalysis from './ContentAnalysis'
import useFetchInstagramStatistics from '../../../hooks/fetchInstagramStatictics'
import { creatorData } from '../../../data/data'
import About from './About'
import AudienceNewDesign from './AudienceNewDesign'
import CollaborationCharges from './CollaborationCharges'
// import { useParams } from 'react-router-dom'
import { useParams } from 'next/navigation'

const page = () => {
  const { userName } = useParams()
  const [url, setUrl] = useState(userName)
  const { data: creator, isLoading } = useFetchInstagramStatistics(creatorData.data, url)
  // const isLoading = false
  // const creator = creatorData.data

  const onChange = (e) => {
    setUrl(e.target.value)
  }

  // const getInfluencerPublicDetails = async (userName) => {
  //   try {
  //     const res = await axios({
  //       method: "get",
  //       url: `https://i.instagram.com/api/v1/users/web_profile_info?username=${encodeURIComponent(userName)}`,
  //       // params: { username: userName }
  //     })
  //   } catch (error) {
  //     alert("Could not fetch public data")
  //   }
  // }

  // useEffect(() => {
  //   console.log({ userName });

  // }, [userName])

  return (
    <div className='flex w-full'>
      <Sidebar />
      <div className='sm:ml-[20vw] bg-[color:var(--light-grey)] w-full min-h-screen px-[30px] py-[30px]'>
        <Navbar onChange={onChange} url={url} />
        {!creator || creator === undefined ? <div className='text-center mt-[60px] text-[22px]'>Creator is not available</div> :
          !isLoading ? <div className='mt-[60px] flex flex-col gap-[40px]'>
            <ProfileCard creator={creator} />
            <About creator={creator} />
            <AudienceNewDesign creator={creator} />
            <CollaborationCharges data={creator?.instagramData.collaborationCharges} />
            {/* <ContentTypeDistribution />
            <Audience creator={creator} />
            <AudienceAuthenticity creator={creator} />
            <CollaborationAndValue />
            <TopPosts />
            <ContentAnalysis /> */}
          </div> :
            <PageLoader />}
      </div>
    </div>
  )
}

const PageLoader = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <svg aria-hidden="true" className="w-10 h-10 text-blue-500 animate-spin dark:text-blue-500 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
    </div>
  )
}

export default page

