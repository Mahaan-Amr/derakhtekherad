'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineItem {
  id: string;
  title: string;
  content: string;
  iconName?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  isRtl?: boolean;
}

const Timeline = ({ items, isRtl = false }: TimelineProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return "🔆";
    
    const iconMap: Record<string, string> = {
      'quality': '✨',
      'culture': '🌍',
      'innovation': '💡',
      'support': '🤝',
      'global': '🌐',
      'growth': '📈',
      'practice': '⚙️',
      'community': '👥',
    };
    
    return iconMap[iconName] || "🔆";
  };

  return (
    <div className={`py-16 px-4 ${isRtl ? 'rtl' : 'ltr'} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-3xl mx-auto">
        <ol className="relative border-l-2 border-primary-500">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const number = (index + 1).toString().padStart(2, '0');
            
            return (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-10 ml-6"
              >
                {/* Circle marker */}
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 bg-primary-500 text-white">
                  {number}
                </span>
                
                {/* Timeline content */}
                <motion.div 
                  layoutId={`card-${item.id}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center mb-1 gap-3">
                    <span className="text-lg text-primary-500">
                      {getIconComponent(item.iconName)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {item.title}
                    </h3>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
                      >
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Expand/collapse indicator */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 right-4 w-5 h-5 flex items-center justify-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className="w-5 h-5 text-primary-500"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default Timeline; 