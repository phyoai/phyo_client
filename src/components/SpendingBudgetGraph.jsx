import React from 'react';

// SVG Path definitions
const svgPaths = {
  p2d6cc200: "M7.333 4L6.39 4.94 9.44667 8 6.39 11.06L7.333 12L11.333 8L7.333 4Z"
};

// Icon Components
function IconArrowUpDoubleLine() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p2d6cc200} fill="#079743" />
      </svg>
    </div>
  );
}

function Percentage({ value = "24%" }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <IconArrowUpDoubleLine />
      <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#067635] text-[12px] tracking-[0.16px]">{value}</p>
    </div>
  );
}

function GrowthPercentage({ percentage = "24%", comparisonText = "last month" }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Percentage value={percentage} />
      <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#808080] text-[12px] tracking-[0.16px]">vs</p>
      <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#808080] text-[12px] tracking-[0.16px]">{comparisonText}</p>
    </div>
  );
}

function LeftValues() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[226px] items-end justify-between leading-[16px] not-italic relative shrink-0 text-[#333] text-[12px] tracking-[0.16px] w-[22px]">
      <p className="relative shrink-0">10K</p>
      <p className="relative shrink-0">8K</p>
      <p className="relative shrink-0">4K</p>
      <p className="relative shrink-0">2K</p>
      <p className="relative shrink-0">0</p>
    </div>
  );
}

function BottomValues({ months = ["July", "Aug", "Sep", "Oct", "Nov", "Dec"] }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between leading-[16px] not-italic pl-[130px] pr-[100px] relative text-[#333] text-[12px] text-center tracking-[0.16px] w-full">
          {months.map((month, index) => (
            <p key={index} className="relative shrink-0 w-[60px]">{month}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Spending Budget Bar Chart Component
export function SpendingBudgetGraph({ 
  title = "₹124,657.80", 
  percentage = "24%",
  barData = [
    { height: 150, color: "#43573b" },
    { height: 140, color: "#3ca67e" },
    { height: 120, color: "#43573b" },
    { height: 140, color: "#3ca67e" },
    { height: 110, color: "#43573b" },
    { height: 85, color: "#3ca67e" },
    { height: 110, color: "#43573b" },
    { height: 115, color: "#3ca67e" }
  ],
  months = ["July", "Aug", "Sep", "Oct", "Nov", "Dec"]
}) {
  // Positions for 8 bars
  const positions = ["2.5%", "15%", "27.5%", "40%", "52.5%", "65%", "77.5%", "90%"];
  const rightPositions = ["90%", "77.5%", "65%", "52.5%", "40%", "27.5%", "15%", "2.5%"];

  return (
    <div className="bg-[#f0f0f0] relative rounded-[12px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e6e6e6] border-[0.5px] border-solid inset-[-0.25px] pointer-events-none rounded-[12.25px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[8px] relative w-full">
        {/* Header */}
        <div className="content-stretch flex gap-[2px] items-end relative shrink-0 w-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px relative">
            <p className="font-['Work_Sans:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#242527] text-[16px] tracking-[0.24px] w-full">{title}</p>
            <GrowthPercentage percentage={percentage} />
          </div>
        </div>

        {/* Graph Container */}
        <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
          <LeftValues />
          <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px overflow-clip relative self-stretch">
            {/* Graph Handles (spacing elements) */}
            {barData.map((_, index) => (
              <div key={index} className="flex-[1_0_0] h-full min-h-px min-w-px" />
            ))}
            
            {/* Bar Graph */}
            <div className="absolute bottom-0 h-[150px] left-0 overflow-clip right-0">
              {barData.map((bar, index) => (
                <div 
                  key={index}
                  className="absolute bottom-0 rounded-tl-[8px] rounded-tr-[8px]"
                  style={{
                    backgroundColor: bar.color,
                    height: `${bar.height}px`,
                    left: positions[index],
                    right: rightPositions[index]
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <BottomValues months={months} />
      </div>
    </div>
  );
}

// Spending Budget Section with Heading
export function SpendingBudget() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {/* Section Heading */}
      <div className="content-stretch flex items-center justify-between pt-[16px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
          <div className="flex flex-col font-['Manrope:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#242527] text-[18px] tracking-[-0.08px] w-full">
            <p className="leading-[26px]">Spending Budget</p>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="mt-4 w-full">
        <SpendingBudgetGraph 
          title="₹124,657.80" 
          percentage="24%"
          barData={[
            { height: 150, color: "#43573b" },
            { height: 140, color: "#3ca67e" },
            { height: 120, color: "#43573b" },
            { height: 140, color: "#3ca67e" },
            { height: 110, color: "#43573b" },
            { height: 85, color: "#3ca67e" },
            { height: 110, color: "#43573b" },
            { height: 115, color: "#3ca67e" }
          ]}
        />
      </div>
    </div>
  );
}

export default SpendingBudget;
