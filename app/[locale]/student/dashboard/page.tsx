import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import StudentDashboardContent from '@/app/components/dashboard/student/StudentDashboardContent';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Student Dashboard | Derakhte Kherad',
  description: 'Manage your courses and assignments',
};

// Define the student dashboard page component
export default async function StudentDashboardPage({
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
      title: locale === 'de' ? 'Student Dashboard' : 'داشبورد دانش‌آموز',
      welcome: locale === 'de' ? 'Willkommen zurück!' : 'خوش آمدید!',
      overview: locale === 'de' ? 'Übersicht' : 'خلاصه',
      courses: locale === 'de' ? 'Meine Kurse' : 'دوره‌های من',
      students: locale === 'de' ? 'Studenten' : 'دانش‌آموزان',
      enrollments: locale === 'de' ? 'Einschreibungen' : 'ثبت‌نام‌ها',
      assignments: locale === 'de' ? 'Aufgaben' : 'تکالیف',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      enrolledCourses: locale === 'de' ? 'Eingeschriebene Kurse' : 'دوره‌های ثبت‌نام شده',
      completedAssignments: locale === 'de' ? 'Erledigte Aufgaben' : 'تکالیف تکمیل شده',
      averageGrade: locale === 'de' ? 'Durchschnittsnote' : 'میانگین نمرات',
      upcomingDeadlines: locale === 'de' ? 'Bevorstehende Fristen' : 'مهلت‌های پیش رو'
    }
  };
  
  return (
    <DashboardLayout 
      locale={locale} 
      role="student"
      translations={translations}
    >
      <StudentDashboardContent 
        locale={locale} 
        translations={translations.dashboard} 
      />
    </DashboardLayout>
  );
} 