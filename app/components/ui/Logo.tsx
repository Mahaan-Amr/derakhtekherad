'use client';

import Link from 'next/link';
import { Locale } from '../../i18n/settings';
import { useTheme } from '@/app/context/ThemeContext';
import { useEffect, useState } from 'react';

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
  // For theme detection
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
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
  
  // Effect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Always use solid white background
  const bgColorClass = 'bg-white';

  // Display the appropriate text based on locale
  const logoText = locale === 'fa' ? 'درخت خرد' : 'Derakhte Kherad';

  // Hard-coded version number for extreme cache-busting
  // Increment this whenever you update the logo
  const logoVersion = "v1234567890";

  return (
    <Link 
      href={`/${locale}`} 
      className={`font-bold transition-colors duration-200 tracking-tight flex items-center ${textSizeClasses[textSize]} ${variantClasses[variant]} ${className}`}
    >
      <div className={`w-[58px] h-[58px] flex items-center justify-center rounded-full ${bgColorClass} transition-colors duration-300`}>
        <img 
          src="/logo.png"
          alt="Derakhte Kherad Logo"
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      {showText && <span className={locale === 'fa' ? 'mr-5 md:mr-6' : 'ml-3 md:ml-4'}>{logoText}</span>}
    </Link>
  );
} 