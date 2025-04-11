'use client';

import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import HeroSlideForm from '@/app/components/admin/hero/HeroSlideForm';
import Link from 'next/link';

// Define the create hero slide page component
export default function CreateHeroSlidePage({
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
      about: locale === 'de' ? 'Über uns' : 'درباره ما',
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
      title: locale === 'de' ? 'Hero-Banner erstellen' : 'ایجاد بنر اصلی',
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
    form: {
      title: locale === 'de' ? 'Neues Hero-Slide erstellen' : 'ایجاد اسلاید جدید',
      titleLabel: locale === 'de' ? 'Titel (Deutsch)' : 'عنوان (آلمانی)',
      titleFaLabel: locale === 'de' ? 'Titel (Farsi)' : 'عنوان (فارسی)',
      descriptionLabel: locale === 'de' ? 'Beschreibung (Deutsch)' : 'توضیحات (آلمانی)',
      descriptionFaLabel: locale === 'de' ? 'Beschreibung (Farsi)' : 'توضیحات (فارسی)',
      imageUrlLabel: locale === 'de' ? 'Bild-URL' : 'آدرس تصویر',
      buttonOneTextLabel: locale === 'de' ? 'Button 1 Text (Deutsch)' : 'متن دکمه ۱ (آلمانی)',
      buttonOneFaLabel: locale === 'de' ? 'Button 1 Text (Farsi)' : 'متن دکمه ۱ (فارسی)',
      buttonOneLinkLabel: locale === 'de' ? 'Button 1 Link' : 'لینک دکمه ۱',
      buttonTwoTextLabel: locale === 'de' ? 'Button 2 Text (Deutsch)' : 'متن دکمه ۲ (آلمانی)',
      buttonTwoFaLabel: locale === 'de' ? 'Button 2 Text (Farsi)' : 'متن دکمه ۲ (فارسی)',
      buttonTwoLinkLabel: locale === 'de' ? 'Button 2 Link' : 'لینک دکمه ۲',
      isActiveLabel: locale === 'de' ? 'Aktiv' : 'فعال',
      submitButton: locale === 'de' ? 'Speichern' : 'ذخیره',
      cancelButton: locale === 'de' ? 'Abbrechen' : 'لغو',
      requiredField: locale === 'de' ? 'Pflichtfeld' : 'فیلد ضروری',
      imageHelp: locale === 'de' ? 'URL des Bildes (empfohlene Größe: 1920x1080px)' : 'آدرس تصویر (اندازه پیشنهادی: ۱۹۲۰×۱۰۸۰ پیکسل)',
      createSuccess: locale === 'de' ? 'Slide erfolgreich erstellt' : 'اسلاید با موفقیت ایجاد شد',
      createError: locale === 'de' ? 'Fehler beim Erstellen des Slides' : 'خطا در ایجاد اسلاید',
      backToList: locale === 'de' ? 'Zurück zur Übersicht' : 'بازگشت به لیست',
      uploadButton: locale === 'de' ? 'Bild hochladen' : 'بارگذاری تصویر',
      uploadingImage: locale === 'de' ? 'Wird hochgeladen...' : 'در حال بارگذاری...',
      uploadError: locale === 'de' ? 'Fehler beim Hochladen des Bildes' : 'خطا در بارگذاری تصویر',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations.form.title}
        </h1>
        <Link 
          href={`/${locale}/admin/hero`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        >
          ← {translations.form.backToList}
        </Link>
      </div>
      
      <HeroSlideForm 
        locale={locale} 
        translations={translations.form} 
        mode="create" 
      />
    </DashboardLayout>
  );
} 