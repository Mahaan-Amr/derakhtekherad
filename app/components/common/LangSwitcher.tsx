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
  
  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/home';
  
  // Flag codes
  const flagCodes = {
    de: 'DE',
    fa: 'IR'
  };

  // Switch to the other language
  const toggleLanguage = () => {
    const newLocale = locale === 'de' ? 'fa' : 'de';
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  // Calculate whether we need a left-to-right or right-to-left layout
  const isRtl = locale === 'fa';

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="relative h-9 w-20 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer shadow-inner overflow-hidden"
        onClick={toggleLanguage}
      >
        {/* Slider track */}
        <div className="flex items-center justify-between h-full px-1.5">
          {/* German flag */}
          <div className={`z-10 flex items-center justify-center w-7 h-7 ${locale === 'de' ? 'opacity-100' : 'opacity-60'}`}>
            <ReactCountryFlag 
              countryCode="DE" 
              svg 
              style={{
                width: '1.5em',
                height: '1.5em',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
              title="Germany"
            />
          </div>
          
          {/* Iran flag */}
          <div className={`z-10 flex items-center justify-center w-7 h-7 ${locale === 'fa' ? 'opacity-100' : 'opacity-60'}`}>
            <ReactCountryFlag 
              countryCode="IR" 
              svg 
              style={{
                width: '1.5em',
                height: '1.5em',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
              title="Iran"
            />
          </div>
        </div>
        
        {/* Slider thumb */}
        <div 
          className={`absolute top-1 w-8 h-7 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ${
            isHovering ? 'scale-105' : ''
          } ${
            locale === 'de' 
              ? 'left-1.5' 
              : 'right-1.5'
          }`}
        ></div>
        
        {/* Text labels (optional) */}
        <div className="sr-only">
          {locale === 'de' ? 'Switch to Persian' : 'Switch to German'}
        </div>
      </div>
    </div>
  );
};

export default LangSwitcher; 