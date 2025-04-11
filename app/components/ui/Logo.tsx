import Link from 'next/link';
import Image from 'next/image';
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
  
  // Determine background based on theme
  // For dark mode or light variant -> use light background
  // For light mode or dark variant -> use dark background
  const useLight = mounted && (isDarkMode || variant === 'light');
  const bgColorClass = useLight 
    ? 'bg-white/10' 
    : 'bg-gray-900/20';

  return (
    <Link 
      href={`/${locale}`} 
      className={`font-bold transition-colors duration-200 tracking-tight flex items-center ${textSizeClasses[textSize]} ${variantClasses[variant]} ${className}`}
    >
      <div className={`w-[58px] h-[58px] flex items-center justify-center rounded-full ${bgColorClass} transition-colors duration-300`}>
        <Image 
          src="/logo.png"
          alt="Derakhte Kherad Logo"
          width={50}
          height={50}
          className="object-contain"
          unoptimized
        />
      </div>
      {showText && <span className="ml-2">Derakhte Kherad</span>}
    </Link>
  );
} 