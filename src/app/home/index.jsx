"use client"

import { MoveRight } from 'lucide-react'
import React, { useState } from 'react'
import Plans from './Plans'
import WhyPhyo from './WhyPhyo'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Feature from './Feature'
import Faq from './Faq'
import Testimonials from './Testimonials'
import Hero from './Hero'
import How from './How'
import { InfluencersList } from './Search'
import axios from 'axios'
import Brands from './Brands'
import CTA from './CTA'
import Benefits from './Benefits'
import Image from 'next/image'
import Comparison from './Comparison'
import HowItWorks from './HowItWorks'
import CompaignPhases from './CompaignPhases'
import CaseStudies from './CaseStudies'


const index = () => {
    const [influencers, setInfluencers] = useState([])
    const [fetchingState, setFetchingState] = useState("idle")

    const getInfluencers = async (prompt) => {
        setFetchingState("loading")
        try {
            const res = await axios({
                method: "post",
                // baseURL: "https://api.phyo.ai",
                baseURL: "https://api.phyo.ai",
                url: "/api/ask",
                data: {
                    prompt
                }
            })
            if (res.data.data.length < 1) {
                setFetchingState("notFound")
            } else {
                setInfluencers(res.data.data)
                setFetchingState("success")
            }

        } catch (error) {
            alert("Could not fetch the influencers")
            setFetchingState("error")
            console.log(error);
        }
    }
    return (
        <div className=''>
            <div className='pt-[52px] relative z-10'>
                <Navbar />
                {/* <Header /> */}
                <div className='mt-[60px]'>
                    <Hero handleSubmit={getInfluencers} fetchingState={fetchingState} />
                </div>
                <InfluencersList influencers={influencers} fetchingState={fetchingState} />
                <ImageGroup />

                <Brands />
                <CTA audience={"Brands"} headline={"Search Influencers in seconds for your next influencer campaign."} text={"With low TAT and cost-effectiveness your next influencer campaign is ready to get high ROI, we help you with Shortlisting Ideation Brief consultation Scripting Shooting Going Live Making the process seamless and easy."} />
                {/* <HowItWorks /> */}
                <CompaignPhases />
                <Comparison />
                {/* <Benefits /> */}
                <CTA audience={"Agencies"} headline={"Ready to take your influencer campaigns to the next level?"} text={"Phyo streamlines influencer marketing for agencies. Manage client accounts in a single dashboard, assign tasks with role-based access, and negotiate better deals using historical cost data. Save time with bulk searches, automated reports, and global influencer access. Ideal for agencies focused on efficiency and ROI."} />
                {/*<Feature />
                <WhyPhyo />
                <How /> */}
                {/* <Cards /> */}
                <Faq />
                <Plans />
                {/* <CaseStudies /> */}
                <Testimonials />
                <Footer />
                {/* <div className='h-[200px] bg-black'></div> */}
            </div>

            {/* <div className='h-[400px] w-full max-w-[300px] rounded-full bg-[color:var(--green)] blur-[180px] shadow-2xl absolute right-[0px] top-[20vh]'></div> */}

        </div>
    )
}

const ImageGroup = () => {
    return (
        <div className='relative max-w-[80%] mx-auto mb-[50px]'>

            <Image src={"/dashboard.png"} width={850} height={550} alt='Dashboard' className='w-[60vw] h-[220px] sm:h-[550px]' />
            <Image src={"/table.png"} width={450} height={550} alt='Table' className='absolute top-[12%] -right-[5vw] w-[200px] h-[120px] sm:w-[450px] sm:h-[40%]' />
            <Image src={"/table1.png"} width={350} height={550} alt='Table' className='absolute -bottom-[15%] -right-[5vw] w-[200px] h-[120px] sm:w-[40vw] sm:h-[70%]' />
        </div>
    )
}

const Header = () => {
    return (
        <div className=''>
            <h1 className='text-white font-semibold text-[64px] text-center max-w-[70%] mx-auto'>Lorem ipsum sectetur dolor sit amet,con. </h1>
            <h2 className='text-white text-[16px] text-center max-w-[50%] mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et. </h2>
            <div className='mt-[55px] border-2 border-[color:var(--dark-green)] flex p-2 pl-[40px] rounded-xl '>
                <input type="text" placeholder="Example: I want to find best influencer fashion industry" className='outline-none bg-transparent border-none flex-grow py-2 text-white' />
                <button className='bg-white px-6 py-2 rounded-md'>Find</button>
            </div>
        </div>
    )
}


export default index