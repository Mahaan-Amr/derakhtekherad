'use client';

import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import FeatureForm from '@/app/components/admin/features/FeatureForm';
import Link from 'next/link';

export default function EditFeaturePage({
  params
}: {
  params: { locale: Locale; id: string }
}) {
  const { locale, id } = params;
  
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
      title: locale === 'de' ? 'Feature bearbeiten' : 'ویرایش ویژگی',
      backToList: locale === 'de' ? 'Zurück zur Übersicht' : 'بازگشت به لیست',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      welcome: locale === 'de' ? 'Willkommen' : 'خوش آمدید',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
    },
    form: {
      title: locale === 'de' ? 'Titel (DE)' : 'عنوان (آلمانی)',
      titleFa: locale === 'de' ? 'Titel (FA)' : 'عنوان (فارسی)',
      description: locale === 'de' ? 'Beschreibung (DE)' : 'توضیحات (آلمانی)',
      descriptionFa: locale === 'de' ? 'Beschreibung (FA)' : 'توضیحات (فارسی)',
      iconName: locale === 'de' ? 'Icon Name' : 'نام آیکون',
      orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب',
      orderIndexHelp: locale === 'de' ? 'Niedrigere Zahlen werden zuerst angezeigt' : 'اعداد کمتر ابتدا نمایش داده می‌شوند',
      isActive: locale === 'de' ? 'Aktiv' : 'فعال',
      required: locale === 'de' ? 'Pflichtfeld' : 'فیلد ضروری',
      titlePlaceholder: locale === 'de' ? 'z.B. Qualifizierte Lehrkräfte' : 'مثال: معلمان واجد شرایط',
      titleFaPlaceholder: locale === 'de' ? 'z.B. معلمان واجد شرایط' : 'مثال: Qualifizierte Lehrkräfte',
      descriptionPlaceholder: locale === 'de' ? 'z.B. Unsere Lehrkräfte sind hochqualifiziert...' : 'مثال: معلمان ما بسیار واجد شرایط هستند...',
      descriptionFaPlaceholder: locale === 'de' ? 'z.B. معلمان ما بسیار واجد شرایط هستند...' : 'مثال: Unsere Lehrkräfte sind hochqualifiziert...',
      cancel: locale === 'de' ? 'Abbrechen' : 'لغو',
      create: locale === 'de' ? 'Erstellen' : 'ایجاد',
      update: locale === 'de' ? 'Aktualisieren' : 'به‌روزرسانی',
      saving: locale === 'de' ? 'Speichern...' : 'در حال ذخیره...',
      createSuccess: locale === 'de' ? 'Feature erfolgreich erstellt' : 'ویژگی با موفقیت ایجاد شد',
      updateSuccess: locale === 'de' ? 'Feature erfolgreich aktualisiert' : 'ویژگی با موفقیت به‌روزرسانی شد',
      saveFailed: locale === 'de' ? 'Fehler beim Speichern des Features' : 'خطا در ذخیره ویژگی',
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
          href={`/${locale}/admin/features`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        >
          ← {translations.dashboard.backToList}
        </Link>
      </div>
      
      <FeatureForm 
        locale={locale} 
        translations={translations} 
        mode="edit" 
        featureId={id}
      />
    </DashboardLayout>
  );
} 