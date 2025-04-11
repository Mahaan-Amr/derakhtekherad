'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/app/i18n/settings';

interface LangSwitcherProps {
  locale: Locale;
  className?: string;
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({ locale, className = '' }) => {
  const pathname = usePathname();
  
  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/home';
  
  // List of available locales with their flags and alt text
  const locales: { locale: Locale; flag: string; alt: string; }[] = [
    { locale: 'de', flag: '/flags/germany.png', alt: 'German Flag' },
    { locale: 'fa', flag: '/flags/iran.png', alt: 'Iran Flag' },
  ];

  return (
    <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
      {locales.map((item) => (
        <Link
          key={item.locale}
          href={`/${item.locale}${pathnameWithoutLocale}`}
          className={`relative p-1 rounded-md transition-all ${
            locale === item.locale
              ? 'scale-110 shadow-md z-10'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          aria-current={locale === item.locale ? 'page' : undefined}
        >
          <div className="overflow-hidden rounded-full w-7 h-7 border border-gray-200 shadow-sm">
            <Image 
              src={item.flag} 
              alt={item.alt} 
              width={28} 
              height={28} 
              className="object-cover"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LangSwitcher; 