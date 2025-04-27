'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

interface ProfileButtonProps {
  locale: string;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ locale }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/home`);
    setIsDropdownOpen(false);
    
    // Remove the welcome shown flag when logging out
    localStorage.removeItem('welcomeShown');
    
    // Show toast notification for successful logout
    toast.success(locale === 'de' ? 'Erfolgreich abgemeldet!' : 'با موفقیت خارج شدید!', {
      position: 'bottom-center',
      duration: 3000,
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show welcome toast only once after login
  useEffect(() => {
    // Check if user exists and welcome hasn't been shown yet in this session
    const welcomeShown = localStorage.getItem('welcomeShown');
    
    if (user && !welcomeShown) {
      toast.success(
        locale === 'de' 
          ? `Willkommen zurück, ${user.name}!` 
          : `${user.name}، خوش آمدید!`, 
        {
          position: 'bottom-center',
          duration: 3000,
        }
      );
      
      // Set flag in localStorage to prevent showing the welcome message again
      localStorage.setItem('welcomeShown', 'true');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return null;
  }
  
  // Get role-specific dashboard path
  const getDashboardPath = () => {
    switch (user.role) {
      case 'ADMIN':
        return `/${locale}/admin/dashboard`;
      case 'TEACHER':
        return `/${locale}/teacher/dashboard`;
      case 'STUDENT':
        return `/${locale}/student/dashboard`;
      default:
        return `/${locale}/home`;
    }
  };

  // Translations
  const t = {
    profile: locale === 'de' ? 'Mein Profil' : 'پروفایل من',
    dashboard: locale === 'de' ? 'Dashboard' : 'داشبورد',
    settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
    logout: locale === 'de' ? 'Abmelden' : 'خروج',
    adminDashboard: locale === 'de' ? 'Admin-Dashboard' : 'پنل مدیریت',
    teacherDashboard: locale === 'de' ? 'Lehrer-Dashboard' : 'پنل آموزگار',
    studentDashboard: locale === 'de' ? 'Schüler-Dashboard' : 'پنل دانش‌آموز',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary-light/15 dark:hover:bg-primary-dark/20 transition-colors"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out transform origin-top-right">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="py-1">
            <Link 
              href={`/${locale}/profile`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t.profile}
            </Link>

            <Link
              href={getDashboardPath()}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {t.dashboard}
            </Link>

            <Link
              href={`/${locale}/settings`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.settings}
            </Link>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton; 