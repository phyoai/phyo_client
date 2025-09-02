import React from 'react';
import { motion, useInView } from 'framer-motion';

const ComparisonTable = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const comparisonData = [
    {
      feature: "Turnaround Time",
      others: "1-2 days for campaign completion",
      phyo: "30-minute campaign setup and execution"
    },
    {
      feature: "Data Sources",
      others: "Outdated or estimated data",
      phyo: "Real-time data via Meta & Google partnerships"
    },
    {
      feature: "Influencer Analytics",
      others: "Basic follower/engagement metrics",
      phyo: "In-depth analytics (ROI, virality, content affinity)"
    },
    {
      feature: "Content Affinity Insights",
      others: "Not available",
      phyo: "Analyzes audience preferences for content types"
    },
    {
      feature: "AI Matchmaking",
      others: "Manual searches or basic filters",
      phyo: "AI-driven recommendations based on brands"
    },
    {
      feature: "Influencer Database",
      others: "Limited creators (under 50k)",
      phyo: "300,000+ vetted influencers globally"
    },
    {
      feature: "Global Reach",
      others: "Limited to local markets",
      phyo: "Influencers across 15+ countries"
    },
    {
      feature: "Performance Estimation",
      others: "No predictive tools",
      phyo: "Predicts campaign success with AI"
    },
    {
      feature: "Campaign Reports",
      others: "Basic engagement summaries",
      phyo: "Detailed reports (ROI, audience sentiment, platform-wise sharing)"
    },
    {
      feature: "Language Support",
      others: "Limited to major languages",
      phyo: "Supports 95+ languages for global campaigns"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
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

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const tableHeaderVariants = {
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

  const rowVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cellVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-6 bg-white" ref={ref}>
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Header */}
        <motion.div 
          className="text-center space-y-6 mb-16"
          variants={headerVariants}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium"
            variants={badgeVariants}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#374151",
              transition: { duration: 0.2 }
            }}
          >
            <motion.span 
              className="w-2 h-2 bg-green-400 rounded-full mr-2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.span>
            Comparison
          </motion.div>
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto"
            variants={titleVariants}
          >
            Comparison Reveals
            <br />
            Differences And Similarities.
          </motion.h2>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          className="bg-white rounded-md shadow-xl overflow-hidden border border-gray-100"
          variants={tableVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Table Header */}
          <motion.div 
            className="grid grid-cols-3 bg-green-50"
            variants={tableHeaderVariants}
          >
            <motion.div 
              className="p-6 font-bold text-lg text-gray-900 border-r border-gray-200"
              variants={cellVariants}
              whileHover={{ backgroundColor: "#f0fdf4", transition: { duration: 0.2 } }}
            >
              Feature
            </motion.div>
            <motion.div 
              className="p-6 font-bold text-lg text-center text-gray-700 border-r border-gray-200 bg-green-100"
              variants={cellVariants}
              whileHover={{ backgroundColor: "#dcfce7", transition: { duration: 0.2 } }}
            >
              Other Platforms
            </motion.div>
            <motion.div 
              className="p-6 font-bold text-lg text-center text-gray-900 bg-green-200"
              variants={cellVariants}
              whileHover={{ backgroundColor: "#bbf7d0", transition: { duration: 0.2 } }}
            >
              Phyo
            </motion.div>
          </motion.div>

          {/* Table Rows */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.8
                }
              }
            }}
          >
            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                className={`grid grid-cols-3 border-b border-gray-100 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
                variants={rowVariants}
                whileHover={{ 
                  backgroundColor: "#f9fafb",
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                layout
              >
                <motion.div 
                  className="p-6 font-semibold text-gray-900 border-r border-gray-200"
                  variants={cellVariants}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  {row.feature}
                </motion.div>
                <motion.div 
                  className="p-6 text-center text-gray-600 border-r border-gray-200 bg-green-50/50 relative"
                  variants={cellVariants}
                  whileHover={{ 
                    backgroundColor: "#fef3c7",
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Cross icon for "others" column */}
                  <motion.div
                    className="absolute top-2 right-2 w-4 h-4 text-red-400 opacity-30"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  {row.others}
                </motion.div>
                <motion.div 
                  className="p-6 text-center text-gray-800 font-medium bg-green-100/50 relative"
                  variants={cellVariants}
                  whileHover={{ 
                    backgroundColor: "#dcfce7",
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Check icon for "phyo" column */}
                  <motion.div
                    className="absolute top-2 right-2 w-4 h-4 text-green-500"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {row.phyo}
                  </motion.span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating elements for visual appeal */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
              style={{
                left: `${15 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ComparisonTable;