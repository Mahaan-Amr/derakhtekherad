'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import Logo from '../ui/Logo';

interface DashboardLayoutProps {
  children: ReactNode;
  locale: Locale;
  translations: {
    navigation: {
      home: string;
      about: string;
      courses: string;
      teachers: string;
      blog: string;
      contact: string;
      login: string;
      darkMode: string;
      lightMode: string;
    };
    footer: {
      address: string;
      phone: string;
      email: string;
      rights: string;
    };
    dashboard: {
      title: string;
      welcome: string;
      overview: string;
      users?: string;
      courses: string;
      teachers?: string;
      students?: string;
      enrollments?: string;
      payments?: string;
      settings: string;
      totalUsers?: string;
      activeCourses?: string;
      newStudents?: string;
      revenue?: string;
      blog?: string;
    };
  };
  role: 'admin' | 'teacher' | 'student';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  locale,
  translations,
  role
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const isRtl = locale === 'fa';

  // Check authorization in useEffect instead of during render
  useEffect(() => {
    // If user is not logged in, redirect to home
    if (user === null) {
      router.push(`/${locale}/home`);
      return;
    }

    // If user doesn't have the required role, show error and redirect
    if (user && user.role !== role.toUpperCase()) {
      toast.error(
        locale === 'de'
          ? 'Sie haben keine Berechtigung, auf diese Seite zuzugreifen.'
          : 'شما مجوز دسترسی به این صفحه را ندارید.',
        { duration: 3000 }
      );
      router.push(`/${locale}/home`);
      return;
    }

    // User is authorized
    if (user) {
      setIsAuthorized(true);
    }
  }, [user, role, locale, router]);

  // Show nothing while checking authorization
  if (isAuthorized === null) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // If not authorized, don't render the dashboard
  if (isAuthorized === false) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/home`);
    
    toast.success(
      locale === 'de' 
        ? 'Erfolgreich abgemeldet!' 
        : 'با موفقیت خارج شدید!',
      { duration: 3000 }
    );
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      {
        name: translations.dashboard.overview,
        href: `/${locale}/${role}/dashboard`,
        icon: (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ];

    if (role === 'admin') {
      return [
        ...baseItems,
        {
          name: translations.dashboard.users,
          href: `/${locale}/admin/users`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          name: locale === 'de' ? 'Hero-Slides' : 'اسلایدهای اصلی',
          href: `/${locale}/admin/hero`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          name: locale === 'de' ? 'Grundsätze' : 'منشورها',
          href: `/${locale}/admin/charters`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          name: locale === 'de' ? 'Funktionen' : 'ویژگی‌ها',
          href: `/${locale}/admin/features`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          ),
        },
        {
          name: locale === 'de' ? 'Statistiken' : 'آمار',
          href: `/${locale}/admin/statistics`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.blog ?? 'Blog',
          href: `/${locale}/admin/blog`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.courses,
          href: `/${locale}/admin/courses`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.teachers,
          href: `/${locale}/admin/teachers`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.students,
          href: `/${locale}/admin/students`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.payments,
          href: `/${locale}/admin/payments`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.settings,
          href: `/${locale}/admin/settings`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
      ];
    } else if (role === 'teacher') {
      return [
        ...baseItems,
        {
          name: translations.dashboard.courses,
          href: `/${locale}/teacher/courses`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.students,
          href: `/${locale}/teacher/students`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          name: translations.dashboard.courses,
          href: `/${locale}/student/courses`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          ),
        },
        {
          name: translations.dashboard.enrollments,
          href: `/${locale}/student/enrollments`,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
        },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 flex z-40`}>
        <div className="fixed inset-0" aria-hidden="true" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 ${isRtl ? 'right-0' : 'left-0'}`}>
          <div className="absolute top-0 p-1 -mr-14">
            <button
              className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {renderSidebar()}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {renderSidebar()}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
          <button
            className="md:hidden px-4 text-gray-500 dark:text-gray-400 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{translations.dashboard.title}</h1>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <div className="relative flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || ''}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</span>
                  </div>
                  <Link href={`/${locale}/profile`} className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  function renderSidebar() {
    const t = {
      dashboard: locale === 'de' ? 'Dashboard' : 'داشبورد',
      logout: locale === 'de' ? 'Abmelden' : 'خروج',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      profile: locale === 'de' ? 'Profil' : 'پروفایل',
    };

    return (
      <>
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary dark:bg-primary-dark">
          <Logo locale={locale} variant="light" className="h-9 w-auto" />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className={`mr-3 ${isRtl ? 'order-1 ml-3 mr-0' : ''} text-gray-400`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            ))}
            
            <hr className="border-gray-200 dark:border-gray-700 my-5" />
            
            <Link
              href={`/${locale}/profile`}
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className={`mr-3 ${isRtl ? 'order-1 ml-3 mr-0' : ''} text-gray-400`}>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {t.profile}
            </Link>
            
            <Link
              href={`/${locale}/settings`}
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className={`mr-3 ${isRtl ? 'order-1 ml-3 mr-0' : ''} text-gray-400`}>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {t.settings}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
            >
              <div className={`mr-3 ${isRtl ? 'order-1 ml-3 mr-0' : ''} text-red-500`}>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              {t.logout}
            </button>
          </nav>
        </div>
      </>
    );
  }
};

export default DashboardLayout; 