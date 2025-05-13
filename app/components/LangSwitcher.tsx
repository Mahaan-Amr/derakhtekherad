'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, locales } from '../i18n/settings';

export default function LangSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  
  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname?.replace(`/${locale}`, '') || '';
  
  return (
    <div className="flex justify-end p-2" style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${pathnameWithoutLocale}`}
          style={{
            padding: '0.5rem 0.75rem',
            margin: '0 0.25rem',
            borderRadius: '0.25rem',
            backgroundColor: locale === loc ? '#800000' : '#e2e8f0',
            color: locale === loc ? 'white' : '#4b5563',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
} 