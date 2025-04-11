import { ReactNode } from 'react';
import { Locale } from '../../i18n/settings';
import Logo from '../ui/Logo';
import LangSwitcher from '../common/LangSwitcher';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
  locale: Locale;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export default function AuthLayout({
  children,
  locale,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo locale={locale} textSize="lg" className="h-12 w-auto" />
        </div>
        <div className="absolute top-4 right-4">
          <LangSwitcher locale={locale} />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        
        {footerText && footerLinkText && footerLinkHref && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {footerText}{' '}
              <Link 
                href={footerLinkHref}
                className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 