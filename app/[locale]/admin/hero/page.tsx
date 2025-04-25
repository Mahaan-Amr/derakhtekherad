'use client';

import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import HeroSlideManager from '@/app/components/admin/hero/HeroSlideManager';

// Define the hero slides management page component
export default function HeroSlidesPage({
  params
}: {
  params: { locale: Locale };
}) {
  // Access locale
  const { locale } = params;
  
  // Define translations
  const translations = {
    navigation: {
      home: locale === 'de' ? 'Startseite' : 'خانه',
      about: locale === 'de' ? 'Über' : 'درباره ما',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      login: locale === 'de' ? 'Anmelden' : 'ورود',
      darkMode: locale === 'de' ? 'Dunkelmodus' : 'حالت تاریک',
      lightMode: locale === 'de' ? 'Hellmodus' : 'حالت روشن'
    },
    footer: {
      address: locale === 'de' ? 'Adresse' : 'آدرس',
      phone: locale === 'de' ? 'Telefon' : 'تلفن',
      email: locale === 'de' ? 'E-Mail' : 'ایمیل',
      rights: locale === 'de' ? 'Alle Rechte vorbehalten' : 'تمامی حقوق محفوظ است'
    },
    dashboard: {
      title: locale === 'de' ? 'Hero-Banner Verwaltung' : 'مدیریت بنر اصلی',
      welcome: locale === 'de' ? 'Willkommen in der Hero-Banner Verwaltung' : 'به مدیریت بنر اصلی خوش آمدید',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      users: locale === 'de' ? 'Benutzer' : 'کاربران',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      students: locale === 'de' ? 'Schüler' : 'دانش‌آموزان',
      enrollments: locale === 'de' ? 'Einschreibungen' : 'ثبت‌نام‌ها',
      payments: locale === 'de' ? 'Zahlungen' : 'پرداخت‌ها',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    },
    heroManager: {
      title: locale === 'de' ? 'Hero-Banner Verwaltung' : 'مدیریت بنر اصلی',
      noSlides: locale === 'de' ? 'Keine Slides gefunden' : 'اسلایدی یافت نشد',
      createButton: locale === 'de' ? 'Neues Slide erstellen' : 'ایجاد اسلاید جدید',
      editButton: locale === 'de' ? 'Bearbeiten' : 'ویرایش',
      deleteButton: locale === 'de' ? 'Löschen' : 'حذف',
      german: locale === 'de' ? 'Deutsch' : 'آلمانی',
      persian: locale === 'de' ? 'Persisch' : 'فارسی',
      active: locale === 'de' ? 'Aktiv' : 'فعال',
      inactive: locale === 'de' ? 'Inaktiv' : 'غیرفعال',
      confirmDelete: locale === 'de' ? 'Sind Sie sicher, dass Sie dieses Slide löschen möchten?' : 'آیا مطمئن هستید که می‌خواهید این اسلاید را حذف کنید؟',
      cancel: locale === 'de' ? 'Abbrechen' : 'لغو',
      confirm: locale === 'de' ? 'Bestätigen' : 'تایید',
      orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب',
      status: locale === 'de' ? 'Status' : 'وضعیت',
      actions: locale === 'de' ? 'Aktionen' : 'عملیات',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <h1 className="text-2xl font-bold mb-6">
        {translations.heroManager.title}
      </h1>
      <HeroSlideManager locale={locale} translations={translations.heroManager} />
    </DashboardLayout>
  );
} 