'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathnameWithoutLocale = pathname?.replace(`/${locale}`, '') || '/home';
  
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
  
  // Debug current locale
  console.log("Current locale:", locale);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main language switcher container */}
      <div
        className={`relative h-9 w-24 rounded-lg bg-gray-200 dark:bg-gray-700 cursor-pointer shadow-md overflow-hidden transition-all duration-300 ${
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
      >
        {/* Simple two-column layout */}
        <div className="flex h-full">
          {/* Persian (FA) side - Left */}
          <div 
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${
              locale === 'fa' 
                ? 'bg-primary/20 dark:bg-primary/30' 
                : 'bg-transparent hover:bg-primary-light/15 dark:hover:bg-primary-dark/20'
            }`}
          >
            <div className={`flex flex-col items-center ${locale === 'fa' ? 'scale-110' : ''}`}>
              <ReactCountryFlag 
                countryCode="IR" 
                svg 
                style={{
                  width: '1.4em',
                  height: '1.4em',
                  borderRadius: '3px',
                  boxShadow: locale === 'fa' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
                title="Iran"
              />
              <span className={`text-[8px] mt-0.5 font-medium ${
                locale === 'fa' 
                  ? 'text-primary dark:text-primary-light' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                FA
              </span>
            </div>
          </div>
          
          {/* German (DE) side - Right */}
          <div
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${
              locale === 'de' 
                ? 'bg-primary/20 dark:bg-primary/30' 
                : 'bg-transparent hover:bg-primary-light/15 dark:hover:bg-primary-dark/20'
            }`}
          >
            <div className={`flex flex-col items-center ${locale === 'de' ? 'scale-110' : ''}`}>
              <ReactCountryFlag 
                countryCode="DE" 
                svg 
                style={{
                  width: '1.4em',
                  height: '1.4em',
                  borderRadius: '3px',
                  boxShadow: locale === 'de' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
                title="Germany"
              />
              <span className={`text-[8px] mt-0.5 font-medium ${
                locale === 'de' 
                  ? 'text-primary dark:text-primary-light' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                DE
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip on hover */}
      {isHovering && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow whitespace-nowrap z-50">
          {locale === 'de' 
            ? 'Switch to Persian' 
            : 'تغییر به آلمانی'}
        </div>
      )}
    </div>
  );
};

export default LangSwitcher; 