import React, { useState, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const StatsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const stats = [
    {
      number: "50K",
      animatedNumber: 50000,
      suffix: "K",
      description: "Authentic Influencers on PHYO",
      bgColor: "bg-green-50",
      textColor: "text-gray-800"
    },
    {
      number: "15+",
      animatedNumber: 15,
      suffix: "+",
      description: "Countries | Find Influencers around the world 15+ Countries covered",
      bgColor: "bg-green-500",
      textColor: "text-white"
    },
    {
      number: "300+",
      animatedNumber: 300,
      suffix: "+",
      description: "Brands Trust Phyo to Scale Fast.",
      bgColor: "bg-green-50",
      textColor: "text-gray-800"
    },
    {
      number: "97.8%",
      animatedNumber: 97.8,
      suffix: "%",
      description: "Average TAT Reduced by 97.8%",
      bgColor: "bg-green-50",
      textColor: "text-gray-800"
    }
  ];

  // Counter component for animated numbers
  const AnimatedCounter = ({ end, suffix, duration = 2, isInView }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      let startTime;
      let animationId;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * end);
        
        setCount(currentCount);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [end, duration, isInView]);

    const formatNumber = (num) => {
      if (suffix === "K" && num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1);
      }
      if (suffix === "%" && num !== end) {
        return num.toFixed(1);
      }
      return num;
    };

    return (
      <span>
        {formatNumber(count)}{suffix}
      </span>
    );
  };

  // Container animation variants
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

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Number animation variants
  const numberVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  // Description animation variants
  const descriptionVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  return (
    <section className="py-16 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${stat.bgColor} rounded-3xl p-8 text-center transform transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden relative`}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background decoration */}
              <motion.div
                className="absolute inset-0 opacity-10"
                initial={{ scale: 0, rotate: 0 }}
                animate={isInView ? { scale: 1, rotate: 360 } : { scale: 0, rotate: 0 }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              >
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full absolute -top-16 -right-16"></div>
              </motion.div>

              <div className={`${stat.textColor} space-y-4 relative z-10`}>
                {/* Animated Number */}
                <motion.h3 
                  className="text-4xl lg:text-5xl font-bold"
                  variants={numberVariants}
                >
                  <motion.span
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={isInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.6, delay: index * 0.3 + 0.5 }}
                  >
                    <AnimatedCounter 
                      end={stat.animatedNumber}
                      suffix={stat.suffix}
                      duration={2.5}
                      isInView={isInView}
                    />
                  </motion.span>
                </motion.h3>

                {/* Animated Description */}
                <motion.p 
                  className="text-sm lg:text-base font-medium leading-relaxed"
                  variants={descriptionVariants}
                >
                  {stat.description}
                </motion.p>

                {/* Animated underline */}
                <motion.div
                  className={`h-1 mx-auto rounded-full ${stat.bgColor === 'bg-green-500' ? 'bg-white/30' : 'bg-green-500'}`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '60%' } : { width: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 1 }}
                />
              </div>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
                }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Optional: Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;