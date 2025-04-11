'use client';

import { ReactNode } from 'react';
import { Locale } from '../../i18n/settings';
import Logo from '../ui/Logo';
import LangSwitcher from '../LangSwitcher';
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo locale={locale} textSize="lg" className="h-12 w-auto" />
        </div>
        <div className="absolute top-4 right-4">
          <LangSwitcher locale={locale} />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        
        {footerText && footerLinkText && footerLinkHref && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {footerText}{' '}
              <Link 
                href={footerLinkHref}
                className="font-medium text-primary hover:text-primary-dark"
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