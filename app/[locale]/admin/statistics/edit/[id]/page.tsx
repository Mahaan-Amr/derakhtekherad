'use client';

import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import StatisticForm from '@/app/components/admin/statistics/StatisticForm';
import Link from 'next/link';

export default function EditStatisticPage({
  params
}: {
  params: { locale: Locale; id: string }
}) {
  const { locale, id } = params;
  
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
      title: locale === 'de' ? 'Statistik bearbeiten' : 'ویرایش آمار',
      backToList: locale === 'de' ? 'Zurück zur Übersicht' : 'بازگشت به لیست',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      welcome: locale === 'de' ? 'Willkommen' : 'خوش آمدید',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
    },
    form: {
      title: locale === 'de' ? 'Titel (DE)' : 'عنوان (آلمانی)',
      titleFa: locale === 'de' ? 'Titel (FA)' : 'عنوان (فارسی)',
      value: locale === 'de' ? 'Wert' : 'مقدار',
      orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب',
      orderIndexHelp: locale === 'de' ? 'Niedrigere Zahlen werden zuerst angezeigt' : 'اعداد کمتر ابتدا نمایش داده می‌شوند',
      isActive: locale === 'de' ? 'Aktiv' : 'فعال',
      required: locale === 'de' ? 'Pflichtfeld' : 'فیلد ضروری',
      titlePlaceholder: locale === 'de' ? 'z.B. Zufriedene Studenten' : 'مثال: رضایت دانشجویان',
      titleFaPlaceholder: locale === 'de' ? 'z.B. رضایت دانشجویان' : 'مثال: Zufriedene Studenten',
      valuePlaceholder: locale === 'de' ? 'z.B. 98%, +10, 25, +1500' : 'مثال: ٪۹۸، +۱۰، ۲۵، +۱۵۰۰',
      valueHelp: locale === 'de' ? 'Geben Sie hier den angezeigten Wert ein (z.B. "98%", "+10", "25", "+1500")' : 'مقدار نمایش داده شده را وارد کنید (مثال: "٪۹۸"، "+۱۰"، "۲۵"، "+۱۵۰۰")',
      cancel: locale === 'de' ? 'Abbrechen' : 'لغو',
      create: locale === 'de' ? 'Erstellen' : 'ایجاد',
      update: locale === 'de' ? 'Aktualisieren' : 'به‌روزرسانی',
      saving: locale === 'de' ? 'Speichern...' : 'در حال ذخیره...',
      createSuccess: locale === 'de' ? 'Statistik erfolgreich erstellt' : 'آمار با موفقیت ایجاد شد',
      updateSuccess: locale === 'de' ? 'Statistik erfolgreich aktualisiert' : 'آمار با موفقیت به‌روزرسانی شد',
      saveFailed: locale === 'de' ? 'Fehler beim Speichern der Statistik' : 'خطا در ذخیره آمار',
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
          {translations.dashboard.title}
        </h1>
        <Link 
          href={`/${locale}/admin/statistics`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        >
          ← {translations.dashboard.backToList}
        </Link>
      </div>
      
      <StatisticForm 
        locale={locale} 
        translations={translations} 
        mode="edit" 
        statisticId={id}
      />
    </DashboardLayout>
  );
} 