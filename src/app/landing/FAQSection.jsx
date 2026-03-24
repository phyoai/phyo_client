'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: "How do Credits work?",
      answer: "Credits are used all around PHYO for Transparent usage and maximum flexibility."
    },
    {
      question: "Can I try Phyo before subscribing?",
      answer: "Yes, we offer a free trial period where you can explore all features and see how Phyo can help grow your brand before committing to a subscription."
    },
    {
      question: "How Secure is my data on Phyo?",
      answer: "Your data security is our top priority. We use enterprise-grade encryption, secure servers, and follow industry best practices to ensure your information is always protected."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time with no hidden fees or penalties. Your account will remain active until the end of your current billing period."
    },
    {
      question: "Can Phyo actually help me grow my brand fast?",
      answer: "Yes! Our platform is designed to accelerate brand growth through strategic influencer partnerships, advanced analytics, and automated campaign management that delivers measurable results."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

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

  const leftSideVariants = {
    hidden: { opacity: 0, x: -100, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const rightSideVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const faqItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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

  return (
    <section className="py-20 px-6" ref={ref}>
      <motion.div 
        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Left Side - Illustration */}
        <motion.div 
          className="relative mt-40"
          variants={leftSideVariants}
        >
          <motion.div 
            className="bg-green-100 rounded-3xl p-12 relative overflow-hidden flex items-center justify-center min-h-[340px]"
            whileHover={{ 
              scale: 1.02,
              rotate: 1,
              transition: { duration: 0.3 }
            }}
          >
            {/* Floating background elements */}
            <motion.div
              className="absolute top-4 right-4 w-8 h-8 bg-green-300 rounded-full opacity-40"
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-6 left-6 w-6 h-6 bg-green-400 rounded-full opacity-50"
              animate={{
                y: [10, -10, 10],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            <motion.img 
              src="/faq.png" 
              alt="FAQ Illustration" 
              className="w-full h-full object-contain max-h-72 rounded-2xl shadow-lg" 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
        </motion.div>

        {/* Right Side - FAQ Content */}
        <motion.div 
          className="space-y-8"
          variants={rightSideVariants}
        >
          <div className="space-y-4">
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
              FAQs
            </motion.div>
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              variants={titleVariants}
            >
              Frequently asked questions
            </motion.h2>
          </div>

          {/* FAQ Accordion */}
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4
                }
              }
            }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'bg-green-500 text-white shadow-lg' : 'bg-white hover:border-green-300'
                }`}
                variants={faqItemVariants}
                whileHover={{
                  scale: openIndex === index ? 1 : 1.02,
                  y: openIndex === index ? 0 : -2,
                  transition: { duration: 0.2 }
                }}
                layout
              >
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="font-semibold text-lg"
                    animate={{ 
                      color: openIndex === index ? "#ffffff" : "#111827"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.question}
                  </motion.span>
                  <motion.div
                    animate={{ 
                      rotate: openIndex === index ? 180 : 0,
                      scale: openIndex === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    )}
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div 
                      className="px-6 pb-5 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        height: { duration: 0.4, ease: "easeInOut" },
                        opacity: { duration: 0.3, delay: 0.1 }
                      }}
                    >
                      <motion.div 
                        className="border-t border-green-400 pt-4"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <motion.p 
                          className="text-green-50 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQSection;