'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeName } from '@/app/context/ThemeContext';
import { Locale } from '@/app/i18n/settings';

interface ThemeSwitcherProps {
  locale: Locale;
}

export default function ThemeSwitcher({ locale }: ThemeSwitcherProps) {
  const { theme, isDarkMode, isAdminUser, setTheme, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === 'fa';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Theme options with localized names and colors
  const themes: { id: ThemeName; name: { de: string; fa: string }; color: string }[] = [
    { id: 'default', name: { de: 'Standard', fa: 'پیش فرض' }, color: '#800000' },
    { id: 'ocean', name: { de: 'Ozean', fa: 'اقیانوس' }, color: '#0064a4' },
    { id: 'forest', name: { de: 'Wald', fa: 'جنگل' }, color: '#2e8b57' },
    { id: 'olive', name: { de: 'Olive', fa: 'زیتون' }, color: '#708238' },
    { id: 'sunset', name: { de: 'Sonnenuntergang', fa: 'غروب' }, color: '#ff7e45' },
    { id: 'midnight', name: { de: 'Mitternacht', fa: 'نیمه شب' }, color: '#8a2be2' },
  ];

  // Toggle dark mode text based on current state and locale
  const darkModeText = isDarkMode
    ? locale === 'de' ? 'Zum hellen Modus wechseln' : 'تغییر به حالت روشن'
    : locale === 'de' ? 'Zum dunklen Modus wechseln' : 'تغییر به حالت تاریک';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={locale === 'de' ? 'Theme ändern' : 'تغییر تم'}
      >
        {isAdminUser ? (
          <div 
            className="w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0 border dark:border-white border-gray-400" 
            style={{ backgroundColor: themes.find(t => t.id === theme)?.color }}
          />
        ) : null}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isDarkMode ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${isRtl ? 'right-0' : 'left-0'} mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 ${isAdminUser ? 'divide-y divide-gray-100 dark:divide-gray-700' : ''} z-50`}
        >
          {/* Color theme selection - only for admin users */}
          {isAdminUser && (
            <div className="py-1">
              <p className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                {locale === 'de' ? 'Farbschema (Admin)' : 'رنگ تم (فقط برای مدیران)'}
              </p>
              {themes.map(themeOption => (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                    theme === themeOption.id 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' 
                      : 'text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-2 rtl:ml-2 rtl:mr-0" 
                    style={{ backgroundColor: themeOption.color }}
                  />
                  <span>{locale === 'de' ? themeOption.name.de : themeOption.name.fa}</span>
                  {theme === themeOption.id && (
                    <svg 
                      className={`h-4 w-4 ${isRtl ? 'mr-auto' : 'ml-auto'}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
          {/* Dark mode toggle - available for all users */}
          <div className="py-1">
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <svg 
                  className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg 
                  className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
              {darkModeText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 