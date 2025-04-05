import React from 'react'

const Brands = () => {
    return (
        <section className='flex flex-col gap-[56px] py-[64px]'>
            {/* <h2 className='text-[32px] md:text-[42px] font-bold w-full text-[#183244] text-center mx-auto text-balance Quicksand'>Trusted by Millions of changemakers at Orgs like yours</h2> */}
            <div className='brands_container whitespace-nowrap overflow-hidden relative'>
                <div className='w-[200px] h-full absolute left-0 top-0 bg-gradient-to-r from-[#D9D9D9] to-white'></div>
                <div className='inline-block brands'>
                    <img src="/brands/mpl.png" alt="brand_1"  className='px-4'/>
                    <img src="/brands/bajaj-finserv.png" alt="brand_1" />
                    <img src="/brands/Netflix.png" alt="brand_1" />
                    <img src="/brands/NordVPN.png" alt="brand_1" />
                    <img src="/brands/unacademy.png" alt="brand_1" />
                    <img src="/brands/zupee.png" alt="brand_1" />
                </div>
                <div className='inline-block brands '>
                    <img src="/brands/mpl.png" alt="brand_1" />
                    <img src="/brands/bajaj-finserv.png" alt="brand_1" />
                    <img src="/brands/Netflix.png" alt="brand_1" />
                    <img src="/brands/NordVPN.png" alt="brand_1" />
                    <img src="/brands/unacademy.png" alt="brand_1" />
                    <img src="/brands/zupee.png" alt="brand_1" />
                </div>
                <div className='w-[200px] h-full absolute right-0 top-0 bg-gradient-to-l from-[#D9D9D9] to-white -z-10'></div>
            </div>
        </section>
    )
}

export default Brands