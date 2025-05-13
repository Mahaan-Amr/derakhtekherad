'use client';

import Link from 'next/link';
import { Locale } from '../../i18n/settings';
import { useTheme } from '@/app/context/ThemeContext';
import { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  locale: Locale;
  className?: string;
  textSize?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
}

export default function Logo({ 
  locale, 
  className = '',
  textSize = 'md',
  variant = 'dark',
  showText = true
}: LogoProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  
  // For theme detection
  const { isDarkMode } = useTheme();
  
  // Text size classes
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  };

  // Variant styles
  const variantClasses = {
    dark: 'text-primary hover:text-primary-dark',
    light: 'text-white hover:text-gray-200'
  };

  // Display the appropriate text based on locale
  const logoText = locale === 'fa' ? 'درخت خرد' : 'Derakhte Kherad';
  
  return (
    <Link 
      href={`/${locale}`} 
      className={`font-bold transition-colors duration-200 tracking-tight flex items-center ${textSizeClasses[textSize]} ${variantClasses[variant]} ${className}`}
    >
      <div 
        className="w-[58px] h-[58px] flex items-center justify-center rounded-full bg-white transition-colors duration-300 overflow-hidden"
      >
        <Image
          src="/site-logo/logo.svg"
          alt="Derakhte Kherad Logo" 
          width={56}
          height={56}
          priority
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            console.error("Logo failed to load");
          }}
        />
      </div>
      
      {showText && <span className={locale === 'fa' ? 'mr-5 md:mr-6' : 'ml-3 md:ml-4'}>{logoText}</span>}
    </Link>
  );
} 