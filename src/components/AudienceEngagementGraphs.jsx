import React from 'react';

// SVG Path definitions
const svgPaths = {
  p2d6cc200: "M7.333 4L6.39 4.94 9.44667 8 6.39 11.06L7.333 12L11.333 8L7.333 4Z",
  p2bb8a000: "M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955V192.089H0V126.089Z",
  p2aa18400: "M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955",
  p1f1a2400: "M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8V197.5H0V134Z",
  p27554600: "M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8"
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

// Shared Components
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
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[28px] items-center leading-[16px] not-italic pl-[32px] pr-[20px] relative text-[#333] text-[12px] text-center tracking-[0.16px] w-full">
          {months.map((month, index) => (
            <p key={index} className="relative shrink-0 w-[60px]">{month}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bar Chart Component (for Saves and Views)
export function BarChartGraph({ 
  title = "3.2K saves", 
  percentage = "24%",
  barColor = "#dae3d1",
  barHeights = [150, 110, 120, 70, 110, 90]
}) {
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
            {barHeights.map((_, index) => (
              <div key={index} className="flex-[1_0_0] h-full min-h-px min-w-px" />
            ))}
            
            {/* Bar Graph */}
            <div className="absolute bottom-0 h-[150px] left-[18px] overflow-clip right-[18px]">
              {barHeights.map((height, index) => {
                const positions = ["0", "18.52%", "37.04%", "55.56%", "74.07%", "92.59%"];
                const rightPositions = ["92.59%", "74.07%", "55.56%", "37.04%", "18.52%", "0"];
                return (
                  <div 
                    key={index}
                    className="absolute bottom-0 rounded-tl-[8px] rounded-tr-[8px]"
                    style={{
                      backgroundColor: barColor,
                      height: `${height}px`,
                      left: positions[index],
                      right: rightPositions[index]
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <BottomValues />
      </div>
    </div>
  );
}

// Line Chart Component (for Likes and Comments)
export function LineChartGraph({ 
  title = "9.2K Likes", 
  percentage = "24%",
  strokeColor = "#3D4F36",
  fillColor = "#43573B",
  showLabel = false,
  labelText = "5.4k likes",
  months = ["July", "Aug", "Sep", "Oct", "Nov", "Dec"]
}) {
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
            {/* Graph Handles */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-[1_0_0] h-full min-h-px min-w-px" />
            ))}
            
            {/* Label (if shown) */}
            {showLabel && (
              <div 
                className="absolute flex-[1_0_0] h-full min-h-px min-w-px"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                <div className="absolute flex h-[258px] items-center justify-center left-[calc(50%+0.17px)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-0">
                  <div className="flex-none rotate-[90deg]">
                    <div className="h-0 relative w-[258px]">
                      <div className="absolute inset-[-1px_0_0_0]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 258 1">
                          <line stroke={strokeColor} strokeDasharray="4 4" x2="258" y1="0.5" y2="0.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute content-stretch flex items-center justify-center left-[calc(50%+0.17px)] px-[16px] py-[4px] rounded-[4px] top-[32px] translate-x-[-50%]" style={{ backgroundColor: fillColor }}>
                  <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] overflow-hidden relative shrink-0 text-[12px] text-ellipsis text-white tracking-[0.16px]">{labelText}</p>
                </div>
              </div>
            )}
            
            {/* Line Graph */}
            <div className="absolute h-[126px] left-0 top-[92px] w-[352px]">
              <div className="absolute inset-[-2.06%_-0.27%_0_-0.45%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 354.513 128.589">
                  <g>
                    <path 
                      d={svgPaths.p2bb8a000} 
                      fill={`url(#gradient-${title.replace(/\s/g, '')})`} 
                      fillOpacity="0.4" 
                    />
                    <path 
                      d={svgPaths.p2aa18400} 
                      stroke={strokeColor} 
                      strokeWidth="4" 
                    />
                    <g>
                      <rect fill={fillColor} height="16" rx="8" width="16" x="263.568" y="76.5895" />
                      <circle cx="271.568" cy="84.5895" fill="#ECEEEB" r="5" />
                    </g>
                  </g>
                  <defs>
                    <linearGradient 
                      gradientUnits="userSpaceOnUse" 
                      id={`gradient-${title.replace(/\s/g, '')}`}
                      x1="177.568" 
                      x2="177.568" 
                      y1="2.5895" 
                      y2="192.089"
                    >
                      <stop offset="0.495192" stopColor={fillColor} />
                      <stop offset="1" stopColor="white" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <BottomValues months={months} />
      </div>
    </div>
  );
}

// Combined Audience Engagement Section
export function AudienceEngagement() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {/* Section Heading */}
      <div className="content-stretch flex items-center justify-between pt-[16px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
          <div className="flex flex-col font-['Manrope:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#242527] text-[18px] tracking-[-0.08px] w-full">
            <p className="leading-[26px]">Audience Engagement</p>
          </div>
        </div>
      </div>

      {/* Graph Grid */}
      <div className="gap-[16px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(2,_fit-content(100%))] relative shrink-0 w-full mt-4">
        {/* Saves - Bar Chart (light green) */}
        <BarChartGraph 
          title="3.2K saves" 
          percentage="24%"
          barColor="#dae3d1"
          barHeights={[150, 110, 120, 70, 110, 90]}
        />

        {/* Views - Bar Chart (dark green) */}
        <BarChartGraph 
          title="14K Views" 
          percentage="24%"
          barColor="#43573b"
          barHeights={[150, 110, 120, 70, 110, 90]}
        />

        {/* Likes - Line Chart (with label) */}
        <LineChartGraph 
          title="9.2K Likes" 
          percentage="24%"
          strokeColor="#3D4F36"
          fillColor="#43573B"
          showLabel={true}
          labelText="5.4k likes"
        />

        {/* Comments - Line Chart */}
        <LineChartGraph 
          title="9.2K comments" 
          percentage="24%"
          strokeColor="#3D4F36"
          fillColor="#43573B"
          showLabel={false}
        />
      </div>
    </div>
  );
}

export default AudienceEngagement;
