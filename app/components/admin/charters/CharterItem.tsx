'use client';

import React from 'react';
import { truncateText } from '@/lib/utils';

interface Charter {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  iconName?: string;
  orderIndex: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

interface CharterItemProps {
  charter: Charter;
  locale: string;
  translations: {
    actions: string;
    edit: string;
    delete: string;
    active: string;
    inactive: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onReorder: (id: string, newIndex: number) => void;
}

const CharterItem: React.FC<CharterItemProps> = ({
  charter,
  locale,
  translations,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}) => {
  const title = locale === 'de' ? charter.title : charter.titleFa;
  const description = locale === 'de' ? charter.description : charter.descriptionFa;
  
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {charter.iconName && (
              <span className="mr-2 text-primary">
                <i className={charter.iconName}></i>
              </span>
            )}
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <span 
              className={`ml-3 px-2 py-1 text-xs rounded-full ${
                charter.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {charter.isActive ? translations.active : translations.inactive}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {truncateText(description, 150)}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Order: {charter.orderIndex}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(charter.updatedAt).toLocaleDateString(locale === 'de' ? 'de-DE' : 'fa-IR')}
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="flex flex-col space-y-2 mr-4">
            <button
              onClick={() => onReorder(charter.id, Math.max(0, charter.orderIndex - 1))}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Move up"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => onReorder(charter.id, charter.orderIndex + 1)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Move down"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={onToggleActive}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={charter.isActive ? 'Deactivate' : 'Activate'}
          >
            {charter.isActive ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharterItem; 