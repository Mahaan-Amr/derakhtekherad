'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import ThemeSelector from '../ui/ThemeSelector';
import { useAuth } from '@/app/context/AuthContext';
import AuthModal from '../auth/AuthModal';
import { Locale } from '@/app/i18n/settings';

interface HeaderProps {
  locale: Locale;
  items: {
    home: string;
    about: string;
    courses: string;
    blog: string;
    contact: string;
    consultation: string;
    login: string;
    signup: string;
  };
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  isOpen?: boolean;
  toggleDropdown?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  locale,
  items,
  darkMode,
  toggleDarkMode,
  isOpen,
  toggleDropdown,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const router = useRouter();
  const isRtl = locale === 'fa';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (toggleDropdown) {
          toggleDropdown();
        } else {
          setIsProfileDropdownOpen(false);
        }
      }
    }
    
    // Only add the listener when the dropdown is open
    if ((isOpen !== undefined ? isOpen : isProfileDropdownOpen)) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [toggleDropdown, isOpen, isProfileDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLanguage = () => {
    // Remove the current locale prefix and replace with the new one
    const newLocale = locale === 'de' ? 'fa' : 'de';
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const handleToggleProfileDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleDropdown) {
      toggleDropdown();
    } else {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
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

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/home`);
  };

  const navigateToDashboard = () => {
    if (user) {
      // Convert the role to lowercase and ensure it matches the expected route pattern
      const roleForRoute = user.role.toLowerCase();
      console.log(`Navigating to dashboard with role: ${roleForRoute}, user:`, user);
      
      const dashboardPath = `/${locale}/${roleForRoute}/dashboard`;
      router.push(dashboardPath);
      
      if (toggleDropdown) {
        toggleDropdown();
      } else {
        setIsProfileDropdownOpen(false);
      }
    }
  };

  const navigateToProfile = () => {
    router.push(`/${locale}/profile`);
    if (toggleDropdown) {
      toggleDropdown();
    } else {
      setIsProfileDropdownOpen(false);
    }
  };

  const navigationItems = [
    { href: `/home`, label: items.home },
    { href: `/about`, label: items.about },
    { href: `/courses`, label: items.courses },
    { href: `/consultation`, label: items.consultation },
    { href: `/blog`, label: items.blog },
    { href: `/contact`, label: items.contact },
  ];

  const getDashboardText = () => {
    if (locale === 'de') {
      return user?.role === 'ADMIN' 
        ? 'Admin-Dashboard' 
        : user?.role === 'TEACHER'
          ? 'Lehrer-Dashboard'
          : 'Schüler-Dashboard';
    } else {
      return user?.role === 'ADMIN' 
        ? 'پنل مدیریت' 
        : user?.role === 'TEACHER'
          ? 'پنل آموزگار'
          : 'داشبورد دانش‌آموز';
    }
  };

  const getProfileText = () => {
    return locale === 'de' ? 'Profil' : 'پروفایل';
  };

  const getSettingsText = () => {
    return locale === 'de' ? 'Einstellungen' : 'تنظیمات';
  };

  const getLogoutText = () => {
    return locale === 'de' ? 'Abmelden' : 'خروج';
  };

  // Language switch translations
  const languageTranslations = {
    switchToGerman: 'Deutsch',
    switchToPersian: 'فارسی',
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Logo locale={locale} className="h-10 w-auto" />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-4 rtl:space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:text-white dark:hover:bg-gray-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Theme switcher and auth buttons */}
          <div className="hidden md:flex md:items-center">
            {/* Language switcher */}
            <button
              onClick={switchLanguage}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100 dark:bg-gray-800 transition-all hover:scale-110 mr-2"
              aria-label={locale === 'de' ? languageTranslations.switchToPersian : languageTranslations.switchToGerman}
            >
              <span className="sr-only">
                {locale === 'de' ? languageTranslations.switchToPersian : languageTranslations.switchToGerman}
              </span>
              <div className="relative w-5 h-5 overflow-hidden">
                <svg 
                  className="w-5 h-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {locale === 'de' ? 'فا' : 'DE'}
                </span>
              </div>
            </button>

            {/* Theme selector */}
            <div className="mr-4">
              <ThemeSelector locale={locale} isDarkMode={darkMode || false} />
            </div>
            
            {user ? (
              <div className="ml-4 relative" ref={dropdownRef}>
                <button
                  onClick={handleToggleProfileDropdown}
                  className="flex items-center space-x-1 rtl:space-x-reverse bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                  <svg 
                    className={`h-4 w-4 text-gray-500 transition-transform ${isOpen !== undefined ? isOpen : isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User dropdown menu */}
                {(isOpen !== undefined ? isOpen : isProfileDropdownOpen) && (
                  <div className="fixed inset-0 z-50" onClick={handleToggleProfileDropdown}>
                    <div 
                      className={`absolute z-50 ${isRtl ? 'right-0' : 'left-0'} mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5`}
                      style={{ 
                        top: '60px', 
                        [isRtl ? 'right' : 'left']: '16px',
                        transform: 'none',
                        pointerEvents: 'auto'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToDashboard();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {getDashboardText()}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProfile();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {getProfileText()}
                      </button>
                      <Link
                        href={`/${locale}/settings`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (toggleDropdown) {
                            toggleDropdown();
                          } else {
                            setIsProfileDropdownOpen(false);
                          }
                        }}
                      >
                        {getSettingsText()}
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {getLogoutText()}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`ml-4 flex items-center ${isRtl ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openLoginModal}
                  className="mr-2"
                >
                  {items.login}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={openRegisterModal}
                >
                  {items.signup}
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
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
              {/* Language Switcher */}
              <button
                onClick={switchLanguage}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none flex items-center gap-2"
                aria-label={locale === 'de' ? languageTranslations.switchToPersian : languageTranslations.switchToGerman}
              >
                <svg 
                  className="w-5 h-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
                  />
                </svg>
                <span className="text-sm">
                  {locale === 'de' ? languageTranslations.switchToPersian : languageTranslations.switchToGerman}
                </span>
              </button>
              
              {/* Theme selector */}
              <div className="text-gray-500 dark:text-gray-400">
                <ThemeSelector locale={locale} isDarkMode={darkMode || false} />
              </div>
            </div>
            
            {!user && (
              <div className="px-3 py-2 space-y-2">
                <button
                  onClick={() => {
                    openLoginModal();
                    setIsMenuOpen(false);
                  }}
                  className="w-full block px-3 py-2 rounded-md text-base font-medium text-center text-white bg-primary hover:bg-primary-dark"
                >
                  {items.login}
                </button>
                <button
                  onClick={() => {
                    openRegisterModal();
                    setIsMenuOpen(false);
                  }}
                  className="w-full block px-3 py-2 rounded-md text-base font-medium text-center text-primary-dark border border-primary-dark hover:bg-primary-light hover:text-white"
                >
                  {items.signup}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
        locale={locale}
      />
    </header>
  );
};

export default Header; 