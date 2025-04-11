import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import AdminDashboardContent from '@/app/components/dashboard/admin/AdminDashboardContent';
import { AdminDashboardAnalytics } from '@/app/components/dashboard/admin/AdminDashboardAnalytics';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Admin Dashboard | Derakhte Kherad',
  description: 'Administrative dashboard for Derakhte Kherad language school',
};

// Define the admin dashboard page component
export default async function AdminDashboardPage({
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
      totalUsers: locale === 'de' ? 'Gesamtbenutzer' : 'کل کاربران',
      activeCourses: locale === 'de' ? 'Aktive Kurse' : 'دوره‌های فعال',
      newStudents: locale === 'de' ? 'Neue Schüler' : 'دانش‌آموزان جدید',
      revenue: locale === 'de' ? 'Einnahmen' : 'درآمد',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      analytics: locale === 'de' ? 'Analytik' : 'تحلیل‌ها',
      loading: locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Daten' : 'خطا در بارگیری داده‌ها',
    },
    analytics: {
      title: locale === 'de' ? 'Admin-Dashboard' : 'پنل مدیریت',
      analyticsTitle: locale === 'de' ? 'Analytik & Statistiken' : 'تحلیل‌ها و آمار',
      monthlyUsers: locale === 'de' ? 'Benutzer über Zeit' : 'کاربران در طول زمان',
      enrollmentsByMonth: locale === 'de' ? 'Einschreibungen nach Monat' : 'ثبت‌نام‌ها بر اساس ماه',
      submissionStatus: locale === 'de' ? 'Aufgabenabgaben Status' : 'وضعیت ارسال تکالیف',
      coursesByLevel: locale === 'de' ? 'Kursverteilung nach Niveau' : 'توزیع دوره‌ها بر اساس سطح',
      loading: locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Daten' : 'خطا در بارگیری داده‌ها',
      retryButton: locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد'
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <AdminDashboardContent locale={locale} translations={translations.dashboard} />
      <AdminDashboardAnalytics locale={locale} translations={translations.analytics} />
    </DashboardLayout>
  );
} 