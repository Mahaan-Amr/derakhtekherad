import React from 'react';

interface TabProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
  className?: string;
}

const Tab: React.FC<TabProps> = ({ isActive, label, onClick, className = '' }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
        ${isActive 
          ? 'bg-primary text-white shadow-sm' 
          : 'bg-gray-100 text-gray-700 hover:bg-primary-light/20 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-primary-dark/20'
        } ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Tab; 