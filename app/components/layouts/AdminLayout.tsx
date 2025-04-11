'use client';

import React from 'react';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from './DashboardLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: Locale;
  breadcrumbs?: { label: string; href: string }[];
  pageTitle?: string;
}

// Default translations based on locale
const getDefaultTranslations = (locale: Locale) => ({
  navigation: {
    home: locale === 'de' ? 'Startseite' : 'صفحه اصلی',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    darkMode: locale === 'de' ? 'Dunkler Modus' : 'حالت تاریک',
    lightMode: locale === 'de' ? 'Heller Modus' : 'حالت روشن',
  },
  footer: {
    address: locale === 'de' ? 'Adresse' : 'آدرس',
    phone: locale === 'de' ? 'Telefon' : 'تلفن',
    email: locale === 'de' ? 'E-Mail' : 'ایمیل',
    rights: locale === 'de' ? 'Alle Rechte vorbehalten' : 'تمامی حقوق محفوظ است',
  },
  dashboard: {
    title: locale === 'de' ? 'Admin-Dashboard' : 'پنل مدیریت',
    welcome: locale === 'de' ? 'Willkommen im Admin-Dashboard' : 'به پنل مدیریت خوش آمدید',
    overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
    users: locale === 'de' ? 'Benutzer' : 'کاربران',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
    students: locale === 'de' ? 'Studenten' : 'دانشجویان',
    enrollments: locale === 'de' ? 'Anmeldungen' : 'ثبت نام‌ها',
    payments: locale === 'de' ? 'Zahlungen' : 'پرداخت‌ها',
    settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
    totalUsers: locale === 'de' ? 'Gesamtbenutzer' : 'کل کاربران',
    activeCourses: locale === 'de' ? 'Aktive Kurse' : 'دوره‌های فعال',
    newStudents: locale === 'de' ? 'Neue Studenten' : 'دانشجویان جدید',
    revenue: locale === 'de' ? 'Einnahmen' : 'درآمد',
    blog: locale === 'de' ? 'Blog verwalten' : 'مدیریت وبلاگ',
  },
});

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  locale,
  breadcrumbs,
  pageTitle,
}) => {
  // Get default translations for the current locale
  const translations = getDefaultTranslations(locale);

  return (
    <DashboardLayout locale={locale} translations={translations} role="admin">
      {pageTitle && (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{pageTitle}</h1>
      )}
      
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && (
                  <li className="text-gray-400">
                    <span className="mx-2">/</span>
                  </li>
                )}
                <li>
                  <a
                    href={item.href}
                    className={`${
                      index === breadcrumbs.length - 1
                        ? 'text-gray-700 dark:text-gray-300 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}
      
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout; 