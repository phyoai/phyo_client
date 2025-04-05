import { BriefcaseBusiness, CircleCheck } from 'lucide-react';
import React from 'react';

const plansData = [
  {
    id: 1,
    name: "Bronze",
    price: "Free",
    line: "Free plan includes",
    features: ["Creator Search", "Creator insight (Basic)", "Content Inspiration"],
  },
  {
    id: 2,
    name: "Silver",
    price: "$19/Month [50 Credits]",
    line: "Everything on Free plus:",
    features: [
      "Advanced Filters & Audience Based Search",
      "Historical Cost",
      "Pre-Curated List & Brand Analysis",
      "Costing Insights",
      "Open Access To Influencer Database",
      "Campaign Reports",
    ],
  },
  {
    id: 3,
    name: "Gold",
    price: "$79/Month [250 Credits]",
    line: "Everything on Premium plus:",
    features: [
      "Role-Based Access",
      "Volume Based Discount",
      "Training Of The Platform For The Users",
      "Dedicated Customer Success Manager",
    ],
  },
  {
    id: 4,
    name: "Premium",
    price: "$199/Month [Unlimited Credits]",
    line: "Everything on Free plus:",
    features: [
      "Advanced Filters & Audience Based Search",
      "Historical Cost",
      "Pre-Curated List & Brand Analysis",
      "Costing Insights",
      "Open Access To Influencer Database",
      "Campaign Reports",
    ],
  },
];

const Plans = () => {
  return (
    <section className="text-white ">
      <h2 className="text-[50px] text-center font-bold mt-[50px] mb-[100px] text-black">Find your perfect plan</h2>
      <div className="continer mx-auto text-center py-12 sm:px-[100px] px-[40px] bg-[#002B21] relative">
        <span className=' bg-[#002B21] p-4 sm:w-[30%] absolute top-[-3%] left-[25%] sm:top-[-9%] sm:left-[35%] rounded-2xl'>
          <span className='bg-white rounded-full w-[50px] aspect-square absolute left-[-48px] bottom-[4px] sm:left-[-50px] sm:bottom-[12.5px]'>
            <span className='bg-[#002B21] w-[20px] aspect-square absolute bottom-0 right-[-3px] -z-10'></span>
          </span>
          <p className='bg-[color:var(--dark-green)] px-4 py-2 rounded-lg font-bold flex gap-2 justify-center'> <BriefcaseBusiness /> Phyo Pricing</p>
          <span className='bg-white rounded-full w-[50px] aspect-square absolute right-[-48px] bottom-[4px] sm:right-[-50px] sm:bottom-[12.5px]'>
            <span className='bg-[#002B21] w-[20px] aspect-square absolute bottom-0 left-[-3px] -z-10'></span>
          </span>
        </span>

        <p className='sm:max-w-[40%] text-center mx-auto mb-8'> Everything You Need to Run Complex Creator Programs at Scale.For Marketers & Agencies.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 plans_container">
          {plansData.map((plan) => (
            <div key={plan.id} className="bg-[#00674FE3] rounded-lg shadow-lg border border-green-600 flex flex-col plan min-h-[500px] sm:min-h-fit">
              <span className='plan_header p-6'>
                <h3 className="text-[40px] font-bold mb-2 text-left leading-9">{plan.name}</h3>
                <p className="text-[14px] text-left font-medium mb-4">{plan.price}</p>
              </span>
              <p className="text-sm font-semibold mb-2 px-6 text-left mt-[21px]">{plan.line}</p>
              <ul className="text-sm text-left px-6 flex flex-col gap-2 mb-[21px]">
                {plan.features.map((feature, index) => (
                  <li key={index} className="mb-1 flex items-center gap-2"><CircleCheck color='#169B00' /> {feature}</li>
                ))}
              </ul>
              <button className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 m-6 rounded-lg mt-auto">
                {plan.name === "Bronze" ? "Get Started for Free" : "Check Out"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;