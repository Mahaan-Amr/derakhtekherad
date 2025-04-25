'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { motion } from 'framer-motion';

interface Charter {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  iconName?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export default function ChartersList({ locale }: { locale: Locale }) {
  const [charters, setCharters] = useState<Charter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharters = async () => {
      try {
        const response = await fetch('/api/public/charters');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCharters(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching charters:', err);
        setError(locale === 'de' ? 'Fehler beim Laden der Charters' : 'خطا در بارگذاری منشور');
        setLoading(false);
      }
    };

    fetchCharters();
  }, [locale]);

  const isRtl = locale === 'fa';
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد'}
        </button>
      </div>
    );
  }

  if (charters.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>{locale === 'de' ? 'Keine Charters gefunden' : 'هیچ منشوری یافت نشد'}</p>
      </div>
    );
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {charters.map((charter) => {
        const title = locale === 'de' ? charter.title : charter.titleFa;
        const description = locale === 'de' ? charter.description : charter.descriptionFa;
        
        return (
          <motion.div 
            key={charter.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full border-b-4 border-primary hover:shadow-lg transition-shadow duration-300"
            variants={item}
          >
            <div className="p-6 flex-grow">
              <div className="flex items-center mb-4">
                {charter.iconName && (
                  <div className="text-primary text-2xl mr-3">
                    <i className={charter.iconName}></i>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <div 
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
} 