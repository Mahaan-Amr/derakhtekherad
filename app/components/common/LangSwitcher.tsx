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

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={locale === 'de' ? 'Switch to Persian language' : 'تغییر به زبان آلمانی'}
      role="region"
    >
      <div
        className={`relative h-9 w-24 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer shadow-md overflow-hidden transition-all duration-300 ${
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
        {/* Flag container - flags in fixed positions */}
        <div className="absolute inset-0 flex items-center justify-between px-2.5 z-10">
          {/* FA flag (left) */}
          <div className={`flex flex-col items-center justify-center w-7 transition-all duration-300 ${
            locale === 'fa' ? 'opacity-100 scale-110' : 'opacity-60'
          }`}>
            <ReactCountryFlag 
              countryCode="IR" 
              svg 
              style={{
                width: '1.4em',
                height: '1.4em',
                borderRadius: '3px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
              title="Iran"
              aria-label="Persian language"
            />
            <span className="text-[8px] mt-0.5 font-medium text-gray-600 dark:text-gray-300">
              FA
            </span>
          </div>
          
          {/* DE flag (right) */}
          <div className={`flex flex-col items-center justify-center w-7 transition-all duration-300 ${
            locale === 'de' ? 'opacity-100 scale-110' : 'opacity-60'
          }`}>
            <ReactCountryFlag 
              countryCode="DE" 
              svg 
              style={{
                width: '1.4em',
                height: '1.4em',
                borderRadius: '3px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
              title="Germany"
              aria-label="German language"
            />
            <span className="text-[8px] mt-0.5 font-medium text-gray-600 dark:text-gray-300">
              DE
            </span>
          </div>
        </div>
        
        {/* Slider thumb - positioned based on current language */}
        <div 
          className={`absolute top-0.5 w-[46%] h-8 bg-gray-800/10 dark:bg-white/10 rounded-md transform transition-all duration-300 ${
            isHovering ? 'shadow-sm' : ''
          } ${isSwitching ? 'scale-95' : ''} ${
            locale === 'fa' 
              ? 'left-0.5' 
              : 'right-0.5'
          }`}
          aria-hidden="true"
        ></div>
        
        {/* Screen reader only text */}
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