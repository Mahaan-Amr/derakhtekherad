import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import TeacherDashboardContent from '@/app/components/dashboard/teacher/TeacherDashboardContent';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Teacher Dashboard | Derakhte Kherad',
  description: 'Teacher dashboard for Derakhte Kherad language school',
};

// Define the teacher dashboard page component
export default async function TeacherDashboardPage({
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
      title: locale === 'de' ? 'Lehrer-Dashboard' : 'پنل آموزگار',
      welcome: locale === 'de' ? 'Willkommen in Ihrem Lehrer-Dashboard' : 'به پنل آموزگار خود خوش آمدید',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      courses: locale === 'de' ? 'Meine Kurse' : 'دوره‌های من',
      students: locale === 'de' ? 'Meine Schüler' : 'دانش‌آموزان من',
      assignments: locale === 'de' ? 'Aufgaben' : 'تکالیف',
      materials: locale === 'de' ? 'Lernmaterialien' : 'مطالب آموزشی',
      schedule: locale === 'de' ? 'Zeitplan' : 'برنامه زمانی',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      totalStudents: locale === 'de' ? 'Anzahl der Schüler' : 'تعداد دانش‌آموزان',
      activeCourses: locale === 'de' ? 'Aktive Kurse' : 'دوره‌های فعال',
      pendingAssignments: locale === 'de' ? 'Ausstehende Aufgaben' : 'تکالیف در انتظار',
      upcomingClasses: locale === 'de' ? 'Anstehende Klassen' : 'کلاس‌های پیش رو',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="teacher"
    >
      <TeacherDashboardContent locale={locale} translations={translations.dashboard} />
    </DashboardLayout>
  );
} 