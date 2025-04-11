'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Locale } from '@/app/i18n/settings';

interface Charter {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  iconName?: string;
  orderIndex: number;
}

interface ChartersTimelineProps {
  locale: Locale;
  charters: Charter[];
  translations: {
    title: string;
    subtitle: string;
  };
}

export default function ChartersTimeline({ locale, charters, translations }: ChartersTimelineProps) {
  const [activeCharter, setActiveCharter] = useState<string | null>(null);
  const isRtl = locale === 'fa';
  
  // Sort charters by orderIndex
  const sortedCharters = [...charters].sort((a, b) => a.orderIndex - b.orderIndex);
  
  const handleChapterClick = (id: string) => {
    setActiveCharter(id === activeCharter ? null : id);
  };
  
  // Set first charter as active by default when component mounts
  useEffect(() => {
    if (sortedCharters.length > 0 && !activeCharter) {
      setActiveCharter(sortedCharters[0].id);
    }
  }, [sortedCharters, activeCharter]);
  
  return (
    <section className={`py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {translations.title}
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {translations.subtitle}
          </motion.p>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-1 bg-primary-light dark:bg-primary-dark"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          ></motion.div>
          
          {/* Timeline Items */}
          <div className="relative space-y-24">
            {sortedCharters.map((charter, index) => (
              <TimelineItem 
                key={charter.id}
                charter={charter}
                locale={locale}
                index={index}
                isActive={charter.id === activeCharter}
                alignRight={index % 2 === 0}
                onClick={() => handleChapterClick(charter.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  charter: Charter;
  locale: Locale;
  index: number;
  isActive: boolean;
  alignRight: boolean;
  onClick: () => void;
}

function TimelineItem({ charter, locale, index, isActive, alignRight, onClick }: TimelineItemProps) {
  const title = locale === 'de' ? charter.title : charter.titleFa;
  const description = locale === 'de' ? charter.description : charter.descriptionFa;
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  
  // Animate when in view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      },
    },
  };
  
  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.2 + 0.3,
      },
    },
  };
  
  const contentVariants = {
    hidden: { opacity: 0, x: alignRight ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.2 + 0.2,
      },
    },
  };
  
  return (
    <motion.div
      ref={ref}
      className="relative z-10"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Timeline Dot */}
      <motion.div 
        className={`absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 ${
          isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
        }`}
        variants={dotVariants}
        whileHover={{ scale: 1.2 }}
        onClick={onClick}
      ></motion.div>
      
      {/* Content */}
      <motion.div 
        className={`${
          alignRight 
            ? 'text-left pr-10 md:pr-0 md:pl-10 md:ml-auto md:mr-[calc(50%+2rem)]' 
            : 'text-right pl-10 md:pl-0 md:pr-10 md:ml-[calc(50%+2rem)] md:mr-auto'
        } max-w-md w-full relative pt-8`}
        variants={contentVariants}
      >
        <div 
          className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
            isActive 
              ? 'bg-primary-light dark:bg-primary-dark text-gray-900 dark:text-white scale-105' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
          }`}
          onClick={onClick}
        >
          <div className="flex items-center mb-3">
            {charter.iconName && (
              <span className={`mr-2 ${isActive ? 'text-primary-dark dark:text-white' : 'text-primary'}`}>
                <i className={charter.iconName}></i>
              </span>
            )}
            <h3 className={`text-xl font-bold ${
              isActive ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-100'
            }`}>
              {title}
            </h3>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-96' : 'max-h-20'}`}>
            <p 
              className={`text-base ${
                isActive ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
              }`}
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
          </div>
          
          <button 
            className={`mt-4 text-sm font-medium ${
              isActive ? 'text-primary-dark dark:text-white' : 'text-primary'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {isActive 
              ? (locale === 'de' ? 'Weniger anzeigen' : 'نمایش کمتر') 
              : (locale === 'de' ? 'Mehr anzeigen' : 'نمایش بیشتر')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 