import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import AdminSettingsContent from '@/app/components/dashboard/admin/AdminSettingsContent';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Admin Settings | Derakhte Kherad',
  description: 'Administrative settings for Derakhte Kherad language school',
};

// Define the admin settings page component
export default async function AdminSettingsPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
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
      title: locale === 'de' ? 'Admin-Dashboard' : 'پنل مدیریت',
      dashboard: locale === 'de' ? 'Dashboard' : 'داشبورد',
      welcome: locale === 'de' ? 'Willkommen in Ihrem Admin-Dashboard' : 'به پنل مدیریت خود خوش آمدید',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      users: locale === 'de' ? 'Benutzer' : 'کاربران',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      students: locale === 'de' ? 'Schüler' : 'دانش‌آموزان',
      enrollments: locale === 'de' ? 'Einschreibungen' : 'ثبت‌نام‌ها',
      payments: locale === 'de' ? 'Zahlungen' : 'پرداخت‌ها',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ'
    },
    settings: {
      title: locale === 'de' ? 'Admin-Einstellungen' : 'تنظیمات مدیریت',
      generalSettings: locale === 'de' ? 'Allgemeine Einstellungen' : 'تنظیمات عمومی',
      siteName: locale === 'de' ? 'Website-Name' : 'نام سایت',
      siteDescription: locale === 'de' ? 'Website-Beschreibung' : 'توضیحات سایت',
      maintenance: locale === 'de' ? 'Wartungsmodus' : 'حالت تعمیر و نگهداری',
      enableMaintenance: locale === 'de' ? 'Wartungsmodus aktivieren' : 'فعال کردن حالت تعمیر و نگهداری',
      maintenanceMessage: locale === 'de' ? 'Wartungsnachricht' : 'پیام تعمیر و نگهداری',
      notificationSettings: locale === 'de' ? 'Benachrichtigungseinstellungen' : 'تنظیمات اطلاع‌رسانی',
      emailNotifications: locale === 'de' ? 'E-Mail-Benachrichtigungen' : 'اطلاع‌رسانی‌های ایمیلی',
      newUserNotification: locale === 'de' ? 'Neue Benutzer-Benachrichtigung' : 'اطلاع‌رسانی کاربر جدید',
      newEnrollmentNotification: locale === 'de' ? 'Neue Einschreibungs-Benachrichtigung' : 'اطلاع‌رسانی ثبت‌نام جدید',
      backupSettings: locale === 'de' ? 'Sicherungseinstellungen' : 'تنظیمات پشتیبان‌گیری',
      createBackup: locale === 'de' ? 'Sicherung erstellen' : 'ایجاد پشتیبان',
      backupFrequency: locale === 'de' ? 'Sicherungshäufigkeit' : 'تناوب پشتیبان‌گیری',
      daily: locale === 'de' ? 'Täglich' : 'روزانه',
      weekly: locale === 'de' ? 'Wöchentlich' : 'هفتگی',
      monthly: locale === 'de' ? 'Monatlich' : 'ماهانه',
      restoreBackup: locale === 'de' ? 'Sicherung wiederherstellen' : 'بازیابی از پشتیبان',
      securitySettings: locale === 'de' ? 'Sicherheitseinstellungen' : 'تنظیمات امنیتی',
      passwordPolicy: locale === 'de' ? 'Passwortrichtlinie' : 'سیاست رمز عبور',
      minimumPasswordLength: locale === 'de' ? 'Mindestlänge des Passworts' : 'حداقل طول رمز عبور',
      requireSpecialCharacters: locale === 'de' ? 'Sonderzeichen erforderlich' : 'نیاز به نویسه‌های ویژه',
      requireNumbers: locale === 'de' ? 'Zahlen erforderlich' : 'نیاز به اعداد',
      sessionTimeout: locale === 'de' ? 'Sitzungs-Timeout (Minuten)' : 'زمان انقضای نشست (دقیقه)',
      save: locale === 'de' ? 'Speichern' : 'ذخیره',
      cancel: locale === 'de' ? 'Abbrechen' : 'لغو',
      saved: locale === 'de' ? 'Gespeichert' : 'ذخیره شد',
      error: locale === 'de' ? 'Fehler' : 'خطا',
      loading: locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <AdminSettingsContent locale={locale} translations={translations.settings} />
    </DashboardLayout>
  );
} 