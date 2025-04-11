'use client';

import React from 'react';
import parse from 'html-react-parser';
import { Locale } from '@/app/i18n/settings';

interface HtmlContentProps {
  content: string;
  className?: string;
  locale?: Locale;
}

/**
 * A component for safely rendering HTML content with styling
 */
const HtmlContent: React.FC<HtmlContentProps> = ({
  content,
  className = '',
  locale = 'de'
}) => {
  const isRtl = locale === 'fa';
  
  // Apply base styles for rich content
  const baseClass = `
    prose 
    prose-headings:font-bold 
    prose-h1:text-2xl 
    prose-h2:text-xl 
    prose-h3:text-lg
    prose-p:mb-4 
    prose-a:text-primary 
    prose-a:no-underline 
    hover:prose-a:underline 
    prose-img:rounded-md 
    prose-img:mx-auto
    prose-strong:font-bold
    prose-ul:list-disc 
    prose-ol:list-decimal
    max-w-none
    dark:prose-invert
    dark:prose-a:text-primary-light
    dark:prose-headings:text-white
    dark:prose-pre:bg-gray-800
    dark:prose-code:text-gray-300
    dark:prose-blockquote:text-gray-300
    dark:prose-blockquote:border-gray-700
  `;
  
  // Apply RTL styles if needed
  const rtlClass = isRtl ? 'rtl font-vazirmatn' : 'ltr';
  
  return (
    <div className={`${baseClass} ${rtlClass} ${className}`}>
      {parse(content || '')}
    </div>
  );
};

export default HtmlContent; 