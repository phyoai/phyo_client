import Image from 'next/image'
import React, { useState } from 'react'

export const Sidebar = () => {
    return (
        <div className='bg-white h-screen fixed left-0 w-[20vw] sm:flex flex-col py-[42px] hidden'>
            {/* <p className='px-[30px] font-semibold text-[24px]'>PyroMedia</p> */}
            <Image src={"/logo.png"} width={200} height={50} alt={"Logo"} className='px-[30px]' />
            <NavLinksComponent /> 
            <NotificationCard />
        </div>
    )
}


const NavLinksComponent = () => {
    const [active, setActive] = useState("overview")
    const navLinks = [
        {
            label: "Overview",
            link: "overview"
        },
        {
            label: "About",
            link: "about"
        },
        {
            label: "Collaboration Charges",
            link: "collab-charges"
        }
    ]
    return (
        <ul className='mt-[80px] flex flex-col gap-[16px]'>
            {
                navLinks.map((ele) => {
                    return <li key={ele.link} className={`px-[50px] cursor-pointer ${active === ele.link ? "font-bold text-[color:var(--dark-green)] border-r-4 border-[color:var(--dark-green)]" : "font-medium text-[color:var(--grey)]"}`} onClick={e => setActive(ele.link)}>
                        {ele.label}
                    </li>
                })
            }
        </ul>
    )
}


const NotificationCard = () => {
    return (
        <div className='mt-auto mx-auto bg-green-400 rounded-3xl flex flex-col items-center justify-center px-[20px] h-[200px] text-white relative'>
            <div className='absolute top-[-40px] left-[calc(50% - 40px)] bg-green-400 rounded-full w-[80px] h-[80px] border-4 flex items-center justify-center'>
                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0923 27.3033H30.8176V36.3143H10.0923V27.3033Z" fill="white" />
                    <path d="M31.5385 29.1956C31.5385 26.2322 30.3707 23.3901 28.2922 21.2947C26.2136 19.1992 23.3945 18.022 20.4549 18.022C17.5154 18.022 14.6963 19.1992 12.6177 21.2947C10.5392 23.3901 9.37143 26.2322 9.37143 29.1956L20.4549 29.1956H31.5385Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.5 31.989C26.8452 31.989 31.989 26.8452 31.989 20.5C31.989 14.1548 26.8452 9.01099 20.5 9.01099C14.1548 9.01099 9.01099 14.1548 9.01099 20.5C9.01099 26.8452 14.1548 31.989 20.5 31.989ZM20.5 41C31.8218 41 41 31.8218 41 20.5C41 9.17816 31.8218 0 20.5 0C9.17816 0 0 9.17816 0 20.5C0 31.8218 9.17816 41 20.5 41Z" fill="white" />
                </svg>

            </div>
            <p className='font-bold text-[16px]'>Upgrade to PRO</p>
            <p className='font-medium text-[14px]'>to get access all the features!</p>
        </div>
    )
}
