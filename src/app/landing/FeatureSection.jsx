import React from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const FeatureSection = () => {
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  
  const isInView1 = useInView(ref1, { once: true, margin: "-100px" });
  const isInView2 = useInView(ref2, { once: true, margin: "-100px" });
  const isInView3 = useInView(ref3, { once: true, margin: "-100px" });

  // Animation variants for left to right
  const leftToRightVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for right to left
  const rightToLeftVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for images with scale
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  // Badge animation
  const badgeVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* First Section - Find Creators */}
      <section className="py-20 px-6" ref={ref1}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content - animates from left */}
          <motion.div 
            className="space-y-6"
            variants={leftToRightVariants}
            initial="hidden"
            animate={isInView1 ? "visible" : "hidden"}
          >
            <motion.div 
              className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-gray-600 backdrop-blur-sm"
              variants={badgeVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Search Instantly
            </motion.div>
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Creators
              <br />
              <motion.span 
                className="text-green-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                in Seconds
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              No more scrolling for hours. Just type your niche, and our AI 
              shows you the best and Right Influencers in seconds.
            </motion.p>
          </motion.div>
          
          {/* Image - animates from right */}
          <motion.div 
            className="relative"
            variants={rightToLeftVariants}
            initial="hidden"
            animate={isInView1 ? "visible" : "hidden"}
          >
            <motion.div 
              className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300"
              variants={imageVariants}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.3 }
              }}
            >
              <Image
                src="/feature4.png"
                alt="Creator search interface"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl transform rotate-3 opacity-20"
              initial={{ scale: 0, rotate: 0 }}
              animate={isInView1 ? { scale: 1, rotate: 3 } : { scale: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Second Section - Campaign Tracking */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-green-100" ref={ref2}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Image - animates from left */}
          <motion.div 
            className="relative order-2 lg:order-1"
            variants={leftToRightVariants}
            initial="hidden"
            animate={isInView2 ? "visible" : "hidden"}
          >
            <motion.div 
              className="relative z-10 bg-gray-50 rounded-2xl shadow-2xl p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
              variants={imageVariants}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.3 }
              }}
            >
              <Image
                src="/landing/feature1.png"
                alt="Campaign tracking dashboard"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl transform -rotate-3 opacity-20"
              initial={{ scale: 0, rotate: 0 }}
              animate={isInView2 ? { scale: 1, rotate: -3 } : { scale: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </motion.div>
          
          {/* Text content - animates from right */}
          <motion.div 
            className="space-y-6 order-1 lg:order-2"
            variants={rightToLeftVariants}
            initial="hidden"
            animate={isInView2 ? "visible" : "hidden"}
          >
            <motion.div 
              className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-600"
              variants={badgeVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Real Results
            </motion.div>
            <motion.h2 
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Tracking your
              <br />
              <motion.span 
                className="text-blue-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Campaigns Live
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              See clear performance reports and accurate ROI 
              tracking from start to finish.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Third Section - Fully Managed */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-green-100" ref={ref3}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content - animates from left */}
          <motion.div 
            className="space-y-6"
            variants={leftToRightVariants}
            initial="hidden"
            animate={isInView3 ? "visible" : "hidden"}
          >
            <motion.div 
              className="inline-block px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium"
              variants={badgeVariants}
              whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
              transition={{ duration: 0.2 }}
            >
              Zero Hassle
            </motion.div>
            <motion.h2 
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fully Managed
              <br />
              <motion.span 
                className="text-gray-700"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Campaigns
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              From Delhi to Dubai, LA to London get access to 300k+ real 
              influencers across 15+ Countries and 95+ languages.
            </motion.p>
          </motion.div>
          
          {/* Image - animates from right */}
          <motion.div 
            className="relative"
            variants={rightToLeftVariants}
            initial="hidden"
            animate={isInView3 ? "visible" : "hidden"}
          >
            <motion.div 
              className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300"
              variants={imageVariants}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.3 }
              }}
            >
              <Image
                src="/feature3.png"
                alt="Campaign management interface"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl transform rotate-3 opacity-20"
              initial={{ scale: 0, rotate: 0 }}
              animate={isInView3 ? { scale: 1, rotate: 3 } : { scale: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSection;