import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '../../i18n/settings';

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

  return (
    <Link 
      href={`/${locale}`} 
      className={`font-bold transition-colors duration-200 tracking-tight flex items-center ${textSizeClasses[textSize]} ${variantClasses[variant]} ${className}`}
    >
      <Image 
        src="/logo.png"
        alt="Derakhte Kherad Logo"
        width={60}
        height={60}
        className="object-contain"
        unoptimized
      />
      {showText && <span className="ml-2">Derakhte Kherad</span>}
    </Link>
  );
} 