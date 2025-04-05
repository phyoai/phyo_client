import React from 'react'
import { Heading } from './ContentTypeDistribution'
import Chart from 'react-google-charts';
import { audienceByCountry, GenderAgeDistributionData, GenderAgeDistributionOptions } from '../../data/data';
import { convertGenderAgeDistributionData } from '../../utils/convertData';

const Audience = ({ creator }) => {
    return (
        <div className='flex flex-col gap-[15px]'>
            <h1 className='font-bold text-[32px] text-[color:var(--dark-green)]'>Audience</h1>
            <Heading text="Instagram audience analysis" />
            <div className='flex gap-[20px]'>
                <GenderAgeDistribution data={creator?.membersGendersAges?.data} />
                <AudienceByCountry data={creator?.membersCountries} />
            </div>
        </div>
    )
}


export function GenderAgeDistribution({ data }) {
    return (
        <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={convertGenderAgeDistributionData(data)}
            options={GenderAgeDistributionOptions}
        />
    );
}
export function AudienceByCountry({ data }) {
    return (
        <div className='bg-white  py-[20px] rounded-xl'>
            <p className='font-bold text-[26px] px-[30px]'>Audience By country</p>
            <div className='flex border-b px-[30px] pb-[10px] my-[20px]'>
                <p className='w-[100px]'>Country</p>
                <p>Progress</p>
            </div>
            <div className='px-[30px] flex flex-col gap-[20px]'>
                {
                    data.map((ele) => {
                        return <div className='flex'>
                            <p className='w-[100px] capitalize'>{ele.category}</p>
                            <span className='bg-[color:var(--light-grey)] w-[200px] relative h-[10px] rounded-md overflow-hidden'>
                                <span className="bg-[#3CB448] h-full absolute top-0 left-0" style={{ width: ele.value * 100 + "%" }}></span>
                            </span>
                        </div>
                    })
                }
            </div>
        </div>
    );
}


export default Audience