import React from 'react';
import { motion, useInView } from 'framer-motion';

const FeatureText = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const text = "Phyo simplifies influencer discovery, analysis and campaign launches so you spend less time planning and more time scaling.";
  const words = text.split(' ');
  
  const greenWords = "Phyo simplifies influencer".split(' ');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const getWordColor = (index) => {
    return index < greenWords.length ? 'text-green-500' : 'text-gray-500';
  };

  return (
    <div className='py-[100px] px-4'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className='font-bold text-center text-[32px] md:text-[42px] lg:text-[52px] leading-tight'
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className={`inline-block ${getWordColor(index)} mr-2 md:mr-3`}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>
        
        {/* Optional decorative elements */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureText;