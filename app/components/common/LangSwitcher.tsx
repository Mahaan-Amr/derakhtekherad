'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/app/i18n/settings';

interface LangSwitcherProps {
  locale: Locale;
  className?: string;
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({ locale, className = '' }) => {
  const pathname = usePathname();
  
  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/home';
  
  // List of available locales and their display names
  const locales: { locale: Locale; label: string; }[] = [
    { locale: 'de', label: 'DE' },
    { locale: 'fa', label: 'فا' },
  ];

  return (
    <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
      {locales.map((item) => (
        <Link
          key={item.locale}
          href={`/${item.locale}${pathnameWithoutLocale}`}
          className={`px-2 py-1 text-sm rounded-md font-medium ${
            locale === item.locale
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
          aria-current={locale === item.locale ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default LangSwitcher; 