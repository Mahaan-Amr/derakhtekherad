'use client';

import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import AboutPageManager from '@/app/components/admin/about/AboutPageManager';

// Define the about page management component
export default function AboutPageManagement({
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
      title: locale === 'de' ? 'Über-Seite Verwaltung' : 'مدیریت صفحه درباره ما',
      welcome: locale === 'de' ? 'Willkommen in der Über-Seite Verwaltung' : 'به مدیریت صفحه درباره ما خوش آمدید',
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
    aboutManager: {
      title: locale === 'de' ? 'Über-Seite Verwaltung' : 'مدیریت صفحه درباره ما',
      mainTitle: locale === 'de' ? 'Haupttitel' : 'عنوان اصلی',
      storySection: locale === 'de' ? 'Geschichte Sektion' : 'بخش داستان',
      missionSection: locale === 'de' ? 'Mission Sektion' : 'بخش ماموریت',
      valuesSection: locale === 'de' ? 'Werte Sektion' : 'بخش ارزش‌ها',
      saveButton: locale === 'de' ? 'Speichern' : 'ذخیره',
      cancelButton: locale === 'de' ? 'Abbrechen' : 'لغو',
      resetButton: locale === 'de' ? 'Zurücksetzen' : 'بازنشانی',
      loading: locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Daten' : 'خطا در بارگیری داده‌ها',
      success: locale === 'de' ? 'Erfolgreich gespeichert' : 'با موفقیت ذخیره شد',
      german: locale === 'de' ? 'Deutsch' : 'آلمانی',
      persian: locale === 'de' ? 'Persisch' : 'فارسی',
      uploadImage: locale === 'de' ? 'Bild hochladen' : 'آپلود تصویر',
      removeImage: locale === 'de' ? 'Bild entfernen' : 'حذف تصویر',
      storyTitle: locale === 'de' ? 'Geschichte Titel' : 'عنوان داستان',
      storyContent: locale === 'de' ? 'Geschichte Inhalt' : 'محتوای داستان',
      missionTitle: locale === 'de' ? 'Mission Titel' : 'عنوان ماموریت',
      missionContent: locale === 'de' ? 'Mission Inhalt' : 'محتوای ماموریت',
      valuesTitle: locale === 'de' ? 'Werte Titel' : 'عنوان ارزش‌ها',
      value1Title: locale === 'de' ? 'Wert 1 Titel' : 'عنوان ارزش ۱',
      value1Content: locale === 'de' ? 'Wert 1 Inhalt' : 'محتوای ارزش ۱',
      value2Title: locale === 'de' ? 'Wert 2 Titel' : 'عنوان ارزش ۲',
      value2Content: locale === 'de' ? 'Wert 2 Inhalt' : 'محتوای ارزش ۲',
      value3Title: locale === 'de' ? 'Wert 3 Titel' : 'عنوان ارزش ۳',
      value3Content: locale === 'de' ? 'Wert 3 Inhalt' : 'محتوای ارزش ۳',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <h1 className="text-2xl font-bold mb-6">
        {translations.aboutManager.title}
      </h1>
      <AboutPageManager locale={locale} translations={translations.aboutManager} />
    </DashboardLayout>
  );
} 