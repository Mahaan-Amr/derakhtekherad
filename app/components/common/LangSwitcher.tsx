'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { Locale } from '@/app/i18n/settings';

interface LangSwitcherProps {
  locale: Locale;
  className?: string;
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({ locale, className = '' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  
  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/home';
  
  // Flag codes
  const flagCodes = {
    de: 'DE',
    fa: 'IR'
  };

  // Switch to the other language
  const toggleLanguage = () => {
    if (isSwitching) return; // Prevent multiple clicks during transition
    
    setIsSwitching(true);
    const newLocale = locale === 'de' ? 'fa' : 'de';
    
    // Small delay to allow animation to complete
    setTimeout(() => {
      router.push(`/${newLocale}${pathnameWithoutLocale}`);
    }, 250);
  };

  // Reset switching state when component unmounts
  useEffect(() => {
    return () => setIsSwitching(false);
  }, []);

  // Calculate whether we need a left-to-right or right-to-left layout
  const isRtl = locale === 'fa';
  
  // Language names in their native form
  const languageLabels = {
    de: 'Deutsch',
    fa: 'فارسی'
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={locale === 'de' ? 'Switch to Persian language' : 'تغییر به زبان آلمانی'}
      role="region"
    >
      <div
        className={`relative h-10 w-24 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer shadow-md overflow-hidden transition-all duration-300 ${
          isHovering ? 'ring-2 ring-primary/30' : ''
        } ${isSwitching ? 'opacity-70' : ''}`}
        onClick={toggleLanguage}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLanguage();
          }
        }}
        aria-pressed={false}
      >
        {/* Slider track */}
        <div className="flex items-center justify-between h-full px-2">
          {/* German flag and label */}
          <div className={`z-10 flex flex-col items-center justify-center w-8 h-8 transition-opacity duration-300 ${
            locale === 'de' ? 'opacity-100 scale-105' : 'opacity-60'
          }`}>
            <ReactCountryFlag 
              countryCode="DE" 
              svg 
              style={{
                width: '1.5em',
                height: '1.5em',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
              title="Germany"
              aria-label="German language"
            />
            <span className="text-[9px] mt-0.5 font-medium text-gray-600 dark:text-gray-300">
              DE
            </span>
          </div>
          
          {/* Iran flag and label */}
          <div className={`z-10 flex flex-col items-center justify-center w-8 h-8 transition-opacity duration-300 ${
            locale === 'fa' ? 'opacity-100 scale-105' : 'opacity-60'
          }`}>
            <ReactCountryFlag 
              countryCode="IR" 
              svg 
              style={{
                width: '1.5em',
                height: '1.5em',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
              title="Iran"
              aria-label="Persian language"
            />
            <span className="text-[9px] mt-0.5 font-medium text-gray-600 dark:text-gray-300">
              FA
            </span>
          </div>
        </div>
        
        {/* Slider thumb */}
        <div 
          className={`absolute top-1 w-10 h-8 bg-white dark:bg-gray-800 rounded-md shadow-md transform transition-all duration-300 ${
            isHovering ? 'shadow-lg' : 'shadow-md'
          } ${isSwitching ? 'scale-95' : ''} ${
            locale === 'de' 
              ? 'left-1' 
              : 'right-1'
          }`}
          aria-hidden="true"
        ></div>
        
        {/* Active language indicator (Screen reader only) */}
        <span className="sr-only">
          {locale === 'de' 
            ? 'Currently in German. Click to switch to Persian.' 
            : 'در حال حاضر به فارسی. برای تغییر به آلمانی کلیک کنید.'}
        </span>
      </div>
      
      {/* Tooltip on hover */}
      {isHovering && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow whitespace-nowrap">
          {locale === 'de' 
            ? 'Switch to Persian' 
            : 'تغییر به آلمانی'}
        </div>
      )}
    </div>
  );
};

export default LangSwitcher; 