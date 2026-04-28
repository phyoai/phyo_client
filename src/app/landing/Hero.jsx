"use client";
import Searchbar from "./components/searchBar";

const milestoneCardData = [
  { title: "50K", description: "Authentic Influencers" },
  { title: "15+", description: "Countries Covered" },
  { title: "300+", description: "Brands Trust To Scale Fast" },
  { title: "97.8%", description: "Average TAT Reduced" },
];

const aboutLines = [
  { text: "Phyo simplifies influencer", width: "w-[601px]" }, // 8:1475
  { text: "discover, analysis &", width: "w-[443px]" },       // 8:1476
  { text: "compaign launches", width: "w-[438px]" },          // 8:1480
  { text: "so you", width: "w-[152px]" },                     // 8:1477
  { text: "spend less time", width: "w-[355px]" },            // 8:1478
  { text: "planning & more", width: "w-[372px]" },            // 8:1479
  { text: "time scaling.", width: "w-[282px]" },              // 8:1481
];

const AboutText = () => {
  return (
    <div className="mt-[32px] w-fit">
      <div className="flex flex-col gap-[4px]">
        {aboutLines.map((line, index) => (
          <div key={index} className={`${line.width} overflow-hidden`}>
            <p
              className='w-fit whitespace-nowrap font-["Bricolage_Grotesque"] text-[48px] font-[400] leading-[132%] tracking-[0px] text-[#565656] transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-[#16A34A] hover:to-[#DDF4E6] hover:bg-clip-text hover:text-transparent'
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              {line.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <div className="mx-[260px] mt-[80px] self-stretch">
      <div className='mx-auto max-w-[918px] text-center font-["Bricolage_Grotesque"] text-[56px] font-[400] leading-[120%] capitalize bg-gradient-to-r from-[#16A34A] via-[#FFFFFF] to-[#16A34A] bg-clip-text text-transparent'>
        World's First AI Powered Influencer Search Engine
      </div>

      <div
        className="mt-[16px] text-center font-inter text-[16px] font-[400] capitalize leading-[120%] text-[#9B9B9B]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Search Influencers in Seconds with Phyo and Reach the Right Audience
        Faster.
      </div>

      <div className="mt-[40px] flex justify-center">
        <Searchbar />
      </div>

      <div className="mt-[48px] flex flex-nowrap justify-center gap-[16px]">
        {milestoneCardData.map((item, index) => (
          <div
            key={index}
            className="flex h-[139px] w-[285px] shrink-0 flex-col items-center justify-center rounded-[24px] border border-[#16A34A] bg-black px-[10px]"
          >
            <div className='text-center font-["Bricolage_Grotesque"] text-[36px] font-[600] leading-[120%] text-[#4E4D4D]'>
              {item.title}
            </div>
            <div className='mt-[4px] text-center font-["Inter"] text-[16px] font-[400] leading-[160%] text-[#4E4D4D]'>
              {item.description}
            </div>
          </div>
        ))}
      </div>

      <AboutText />
    </div>
  );
};

export default Hero;
