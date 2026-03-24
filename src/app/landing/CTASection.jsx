import React from 'react';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const CTASection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const leftSideVariants = {
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

  const rightSideVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const dashboardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 2,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.8,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-20 px-6" ref={ref}>
      <motion.div 
        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Left Side - Content */}
        <motion.div 
          className="space-y-8"
          variants={leftSideVariants}
        >
          <motion.h1 
            className="text-[48px] font-bold text-gray-900 leading-tight"
            variants={titleVariants}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI Search, Verified
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Influencers, Live Tracking.
            </motion.span>
            <br />
            <motion.span 
              className="text-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              We've Got Everything For
            </motion.span>
            <br />
            <motion.span 
              className="text-green-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 200 }}
            >
              Your Brand To Win.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 leading-relaxed max-w-lg"
            variants={paragraphVariants}
          >
            You don't need luck. You need data, speed and a tool that actually 
            works Phyo is that weapon.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={buttonContainerVariants}
          >
            <motion.button 
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              Start with Free Trial
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            
            <motion.button 
              className="inline-flex items-center px-8 py-4 border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-colors duration-200 group"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#16a34a",
                color: "#ffffff"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="mr-2"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="w-5 h-5" />
              </motion.div>
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side - Dashboard Preview */}
        <motion.div 
          className="relative"
          variants={rightSideVariants}
        >
          {/* Decorative Background Elements */}
          <motion.div 
            className="absolute -top-8 -left-8 w-32 h-32 bg-green-200 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-12 -right-12 w-40 h-40 bg-green-300 rounded-full opacity-15"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute top-1/2 -right-16 w-24 h-24 bg-green-400 rounded-full opacity-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
              y: [-10, 10, -10]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          {/* Main Dashboard Container */}
          <motion.div 
            className="relative bg-green-500 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
            variants={dashboardVariants}
            whileHover={{ 
              rotate: 0, 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            {/* Dashboard Content */}
            <motion.div 
              className="bg-white rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/free-trial.png"
                alt="Phyo Dashboard Interface"
                width={700}
                height={500}
                className="w-full h-auto"
                priority
              />
            </motion.div>
            
            {/* Get PHYO Badge */}
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              variants={badgeVariants}
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)"
              }}
            >
              <motion.div 
                className="bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <motion.div 
                    className="font-bold text-gray-900 text-lg"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    Get PHYO
                  </motion.div>
                  <motion.div 
                    className="text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    Simple, Fast & Feature rich,
                    <br />
                    premium features.
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Sparkle effects around dashboard */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;