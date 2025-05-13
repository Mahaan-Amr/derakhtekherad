'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { useAuth } from '@/app/context/AuthContext';
import AuthModal from '../auth/AuthModal';
import ProfileButton from '../auth/ProfileButton';
import { Locale } from '@/app/i18n/settings';
import ThemeSelector from '../ui/ThemeSelector';
import Image from 'next/image';
import LangSwitcher from '../common/LangSwitcher';

interface HeaderProps {
  locale: Locale;
  translations: {
    home: string;
    about: string;
    courses: string;
    teachers: string;
    blog: string;
    contact: string;
    login: string;
    signup?: string;
    darkMode: string;
    lightMode: string;
    switchToGerman?: string;
    switchToPersian?: string;
    consultation?: string;
    charters?: string;
  };
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  locale,
  translations,
  darkMode,
  toggleDarkMode,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { user } = useAuth();
  const isRtl = locale === 'fa';
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchLanguage = () => {
    // Remove the current locale prefix and replace with the new one
    const newLocale = locale === 'de' ? 'fa' : 'de';
    const pathWithoutLocale = pathname?.replace(`/${locale}`, '') || '';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navigationItems = [
    { href: `/home`, label: translations.home },
    { href: `/about`, label: translations.about },
    { href: `/courses`, label: translations.courses },
    { href: `/charters`, label: translations.charters || (locale === 'de' ? 'Grundsätze' : 'منشورها') },
    { href: `/consultation`, label: translations.consultation || (locale === 'de' ? 'Beratung' : 'مشاوره') },
    { href: `/blog`, label: translations.blog },
    { href: `/contact`, label: translations.contact },
  ];

  // Default translations if not provided
  const languageTranslations = {
    switchToGerman: translations.switchToGerman || 'Deutsch',
    switchToPersian: translations.switchToPersian || 'فارسی',
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Logo locale={locale} variant={darkMode ? 'light' : 'dark'} showText={false} className="md:hidden" />
              <Logo locale={locale} variant={darkMode ? 'light' : 'dark'} className="hidden md:flex" />
            </div>
            
            {/* Mobile-only important links */}
            <div className="flex md:hidden ml-4 rtl:mr-4 rtl:ml-0">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Link
                  href={`/${locale}/about`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {locale === 'fa' ? 'درباره ما' : 'Über'}
                </Link>
                <Link
                  href={`/${locale}/courses`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {locale === 'fa' ? 'دوره‌ها' : 'Kurse'}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-4 rtl:space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors relative"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
                  }`}
                ></span>
              </div>
            </button>
          </div>
          
          {/* Header controls: Language switcher, Dark mode toggle, Auth */}
          <div className="hidden md:flex md:items-center space-x-4 rtl:space-x-reverse">
            {/* Theme selector */}
            <div className="mr-2">
              <ThemeSelector locale={locale} isDarkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>

            {/* Language switcher */}
            <div className="mx-2">
              <LangSwitcher locale={locale} />
            </div>

            {user ? (
              <ProfileButton locale={locale} />
            ) : (
              <div className={`flex items-center ${isRtl ? 'space-x-reverse space-x-2' : 'space-x-3'}`}>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={openLoginModal}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-300"
                >
                  {translations.login}
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  onClick={openRegisterModal}
                  className="shadow-sm hover:shadow"
                >
                  {translations.signup || (locale === 'de' ? 'Registrieren' : 'ثبت نام')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems
              .filter(item => 
                !((item.href === '/about' || item.href === '/courses'))
              )
              .map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center justify-between px-3 py-2">
              {/* Theme selector */}
              <div className="text-gray-500 dark:text-gray-400">
                <ThemeSelector locale={locale} isDarkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </div>
              
              {/* Language Switcher */}
              <div className="flex items-center">
                <LangSwitcher locale={locale} />
                <span className="text-sm ml-2">
                  {locale === 'de' ? languageTranslations.switchToPersian : languageTranslations.switchToGerman}
                </span>
              </div>
            </div>
            
            {user ? (
              <div className="px-3 py-2">
                <ProfileButton locale={locale} />
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={openLoginModal}
                  className="w-full mb-2"
                >
                  {translations.login}
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  onClick={openRegisterModal}
                  className="w-full"
                >
                  {translations.signup || (locale === 'de' ? 'Registrieren' : 'ثبت نام')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        locale={locale}
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
        showRoleSelector={false}
      />
    </header>
  );
};

export default Header; 