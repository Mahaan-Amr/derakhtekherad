'use client';

import { useState, useRef, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useTheme } from '@/app/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// Available color themes
type ColorTheme = 'default' | 'emerald' | 'rose' | 'blue' | 'amber' | 'ocean' | 'forest' | 'olive' | 'sunset' | 'midnight';

interface ThemeSelectorProps {
  locale: Locale;
  isDarkMode: boolean;
  toggleDarkMode?: () => void;
  className?: string;
  isAdminUser?: boolean;
}

export default function ThemeSelector({ locale, isDarkMode, toggleDarkMode, className, isAdminUser = false }: ThemeSelectorProps) {
  const { isAdminUser: themeAdminUser } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('default');
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === 'fa';
  const { t } = useTranslation();
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0, left: 0 });

  // Initialize theme on component mount
  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('colorTheme') as ColorTheme || 'default';
    setCurrentTheme(savedTheme);
  }, []);

  // Handle theme change
  const changeTheme = (theme: ColorTheme) => {
    // Only allow admin users to change color theme
    if (!themeAdminUser) {
      console.log('Only admin users can change the color theme');
      setIsOpen(false);
      return;
    }
    
    setCurrentTheme(theme);
    localStorage.setItem('colorTheme', theme);
    
    // Remove all theme classes and add the selected one
    document.documentElement.classList.remove(
      'theme-default', 'theme-emerald', 'theme-rose', 'theme-blue', 'theme-amber',
      'theme-ocean', 'theme-forest', 'theme-olive', 'theme-sunset', 'theme-midnight'
    );
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Close dropdown after selection
    setIsOpen(false);
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    if (toggleDarkMode) {
      toggleDarkMode();
    } else {
      // Fallback if toggleDarkMode is not provided
      const newMode = !isDarkMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if ((dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) &&
          (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target as Node))) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Theme options with localized names and colors
  const colorThemes = [
    { 
      id: 'default', 
      name: { de: 'Standard (Rot)', fa: 'پیش‌فرض (قرمز)' }, 
      color: '#dc2626',
      bgClass: 'bg-[#dc2626]'
    },
    { 
      id: 'emerald', 
      name: { de: 'Smaragd', fa: 'زمرد' }, 
      color: 'rgb(var(--emerald))',
      bgClass: 'bg-emerald-500'
    },
    { 
      id: 'rose', 
      name: { de: 'Rose', fa: 'گل سرخ' }, 
      color: '#f43f5e',
      bgClass: 'bg-[#f43f5e]'
    },
    { 
      id: 'blue', 
      name: { de: 'Blau', fa: 'آبی' }, 
      color: '#3b82f6',
      bgClass: 'bg-[#3b82f6]'
    },
    { 
      id: 'amber', 
      name: { de: 'Bernstein', fa: 'کهربایی' }, 
      color: '#f59e0b',
      bgClass: 'bg-[#f59e0b]'
    },
    { 
      id: 'ocean', 
      name: { de: 'Ozean', fa: 'اقیانوس' }, 
      color: '#0EA5E9',
      bgClass: 'bg-[#0EA5E9]'
    },
    { 
      id: 'forest', 
      name: { de: 'Wald', fa: 'جنگل' }, 
      color: '#059669',
      bgClass: 'bg-[#059669]'
    },
    { 
      id: 'olive', 
      name: { de: 'Olive', fa: 'زیتون' }, 
      color: '#708238',
      bgClass: 'bg-[#708238]'
    },
    { 
      id: 'sunset', 
      name: { de: 'Sonnenuntergang', fa: 'غروب' }, 
      color: '#ff7e45',
      bgClass: 'bg-[#ff7e45]'
    },
    { 
      id: 'midnight', 
      name: { de: 'Mitternacht', fa: 'نیمه شب' }, 
      color: '#8a2be2',
      bgClass: 'bg-[#8a2be2]'
    },
  ];

  return (
    <div className="relative">
      <button
        ref={dropdownRef}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={locale === 'de' ? 'Thema und Modus ändern' : 'تغییر تم و حالت'}
      >
        <div className="flex items-center">
          {themeAdminUser && (
            <div 
              className={`w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 ${
                colorThemes.find(t => t.id === currentTheme)?.bgClass || 'bg-gray-500'
              }`}
            />
          )}
          {!themeAdminUser && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isDarkMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
          )}
        </div>
      </button>

      {isOpen && (
        <div 
          ref={dropdownMenuRef}
          className={`absolute z-50 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none ${themeAdminUser ? 'divide-y divide-gray-100 dark:divide-gray-700' : ''}`}
          style={{
            maxHeight: '80vh',
            overflowY: 'auto',
            top: '100%',
            [isRtl ? 'right' : 'left']: 0,
            marginTop: '8px'
          }}
        >
          {/* Color theme selection - only show for admin users */}
          {themeAdminUser && (
            <div>
              <p className="px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                {locale === 'de' ? 'Farbthema (Admin)' : 'رنگ تم (فقط برای مدیران)'}
              </p>
              <div className="grid grid-cols-2 gap-1 p-1">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => changeTheme(theme.id as ColorTheme)}
                    className={`flex items-center px-2 py-2 text-sm rounded-md ${
                      currentTheme === theme.id 
                        ? 'bg-gray-100 dark:bg-gray-700' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full mr-2 rtl:ml-2 rtl:mr-0 ${theme.bgClass}`}
                    />
                    <span className="text-gray-700 dark:text-gray-200 truncate">
                      {locale === 'de' ? theme.name.de : theme.name.fa}
                    </span>
                    {currentTheme === theme.id && (
                      <svg 
                        className={`h-4 w-4 ${isRtl ? 'mr-auto' : 'ml-auto'} text-primary`} 
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
            </div>
          )}
          
          {/* Dark mode toggle - available for all users */}
          <div className="p-2">
            <button
              onClick={handleDarkModeToggle}
              className="w-full flex items-center px-2 py-2 text-sm rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <>
                  <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{locale === 'de' ? 'Heller Modus' : 'حالت روشن'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>{locale === 'de' ? 'Dunkler Modus' : 'حالت تاریک'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 