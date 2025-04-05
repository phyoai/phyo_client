import React, { useEffect, useState } from 'react';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles

const How = () => {
  const [dotPosition, setDotPosition] = useState(0); // Track the vertical position of the ball
  const [activeStep, setActiveStep] = useState(null); // Track which step the ball is near

  const stepPositions = [10, 35, 60, 85]; // Percentage positions of steps

  useEffect(() => {
    // Initialize AOS when the component mounts
    AOS.init({
      duration: 1000, // Animation duration for the text
      once: false, // Allow animation to trigger every time it comes into view
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / maxHeight) * 100; // Convert scroll position to percentage

      // Directly update the ball's position based on scroll
      setDotPosition(scrollPercent);

      // Determine which step is active based on scroll percent
      if (scrollPercent < stepPositions[0]) {
        setActiveStep(1);
      } else if (scrollPercent >= stepPositions[0] && scrollPercent < stepPositions[1]) {
        setActiveStep(1);
      } else if (scrollPercent >= stepPositions[1] && scrollPercent < stepPositions[2]) {
        setActiveStep(2);
      } else if (scrollPercent >= stepPositions[2] && scrollPercent < stepPositions[3]) {
        setActiveStep(3);
      } else if (scrollPercent >= stepPositions[3]) {
        setActiveStep(4);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      <h1 className="text-center text-4xl my-8">How it works</h1>

      <div className="flex flex-col items-center relative">
        {/* Vertical Dotted Line */}
        <div className="absolute left-[40%] h-full border-l-2 border-dotted border-gray-300"></div>

        {/* Animated Dot that moves with scroll */}
        <div
          className={`absolute w-[100px] h-[100px] border-[30px] border-[#E3FFDE] rounded-full`}
          style={{
            top: `${dotPosition}%`, // Move the ball directly with the scroll position
            left: '36.4%',
            backgroundColor: 'black',
          }}
        ></div>

        {/* Step 01 */}
        <div className="flex flex-col items-center justify-center gap-4 mt-[270px]" data-aos="fade-down">
         <div className='flex items-center'>
            <h1
                className={`font-bold text-[96px] ${
                  activeStep === 1 ? 'text-black' : 'text-[#00674F]'
                }`}
                data-aos="fade-down"
              >
                01
              </h1>
              <div>
                <h3 className="font-bold text-[20px] text-[#59565F]" data-aos="fade-down">
                  Set preferences
                </h3>
                <p className="text-[14px] text-[#59565F] mt-[15px]" data-aos="fade-down">
                  Define your audience, niche, and budget.
                </p>
              </div>
         </div>
          <img src='/Img-1.png' alt='img' className='w-100 h-[200px] ml-[320px] hidden sm:block'/>
        </div>

        {/* Step 02 */}
        <div className="flex flex-col items-center mt-[270px] justify-center gap-4" data-aos="fade-down">
          <div className='flex items-center'>
              <h1
                className={`font-bold text-[96px] ${
                  activeStep === 2 ? 'text-black' : 'text-[#00674F]'
                }`}
                data-aos="fade-down"
              >
                02
              </h1>
              <div>
                <h3 className="font-bold text-[20px] text-[#59565F]" data-aos="fade-down">
                  Choose a strategy
                </h3>
                <p className="text-[14px] text-[#59565F] mt-[15px]" data-aos="fade-down">
                  Select the best strategy based on your goals.
                </p>
              </div>
          </div>
              <img src='/Img-1.png' alt='img' className='w-100 h-[200px] ml-[320px] hidden sm:block'/>

        </div>

        {/* Step 03 */}
        <div className="flex flex-col items-center mt-[270px] justify-center gap-4" data-aos="fade-down">
          <div className='flex items-center'>
                <h1
                    className={`font-bold text-[96px] ${
                      activeStep === 3 ? 'text-black' : 'text-[#00674F]'
                    }`}
                    data-aos="fade-down"
                  >
                    03
                  </h1>
                  <div>
                    <h3 className="font-bold text-[20px] text-[#59565F]" data-aos="fade-down">
                      Launch your campaign
                    </h3>
                    <p className="text-[14px] text-[#59565F] mt-[15px]" data-aos="fade-down">
                      Start your campaign and monitor performance.
                    </p>
                  </div>
          </div>
          <img src='/Img-1.png' alt='img' className='w-100 h-[200px] ml-[320px] hidden sm:block'/>
        </div>

        {/* Step 04 */}
        <div className="flex flex-col items-center mt-[270px] justify-center gap-4" data-aos="fade-down">
          <div className='flex items-center'>
              <h1
                className={`font-bold text-[96px] ${
                  activeStep === 4 ? 'text-black' : 'text-[#00674F]'
                }`}
                data-aos="fade-down"
              >
                04
              </h1>
              <div>
                <h3 className="font-bold text-[20px] text-[#59565F]" data-aos="fade-down">
                  Optimize results
                </h3>
                <p className="text-[14px] text-[#59565F] mt-[15px]" data-aos="fade-down">
                  Improve based on performance insights.
                </p>
              </div>
          </div>
          <img src='/Img-1.png' alt='img' className='w-100 h-[200px] ml-[320px] hidden sm:block'/>
        </div>
      </div>
    </div>
  );
};

export default How;
