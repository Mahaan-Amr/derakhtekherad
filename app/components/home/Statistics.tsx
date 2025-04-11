'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { motion } from 'framer-motion';

interface Statistic {
  id: string;
  title: string;
  titleFa: string;
  value: string;
  orderIndex: number;
  isActive: boolean;
}

export default function Statistics({ locale }: { locale: Locale }) {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics?active=true');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Title based on locale
  const getTitle = (stat: Statistic) => locale === 'de' ? stat.title : stat.titleFa;

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // If no statistics are available, don't render the section
  if (!loading && (!statistics || statistics.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <div className="w-20 h-12 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))
          ) : (
            // Render actual statistics when loaded
            statistics.map((stat) => (
              <motion.div 
                key={stat.id} 
                className="flex flex-col items-center justify-center p-6 text-center"
                variants={itemVariants}
              >
                <span className="text-4xl md:text-5xl font-bold text-primary mb-3">
                  {stat.value}
                </span>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {getTitle(stat)}
                </h3>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
} 