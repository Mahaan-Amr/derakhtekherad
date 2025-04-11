import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import TeacherStudentsWrapper from '@/app/components/dashboard/teacher/TeacherStudentsWrapper';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Teacher Students | Derakhte Kherad',
  description: 'Manage your students at Derakhte Kherad language school',
};

// Define the teacher students page component
export default async function TeacherStudentsPage({
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
      title: locale === 'de' ? 'Meine Schüler' : 'دانش‌آموزان من',
      welcome: locale === 'de' ? 'Verwalten Sie Ihre Schüler' : 'مدیریت دانش‌آموزان شما',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      courses: locale === 'de' ? 'Meine Kurse' : 'دوره‌های من',
      students: locale === 'de' ? 'Meine Schüler' : 'دانش‌آموزان من',
      assignments: locale === 'de' ? 'Aufgaben' : 'تکالیف',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      users: locale === 'de' ? 'Benutzer' : 'کاربران',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      enrollments: locale === 'de' ? 'Einschreibungen' : 'ثبت‌نام‌ها',
      payments: locale === 'de' ? 'Zahlungen' : 'پرداخت‌ها',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      
      // TeacherStudentsManagement component translations
      myStudents: locale === 'de' ? 'Meine Schüler' : 'دانش‌آموزان من',
      allCourses: locale === 'de' ? 'Alle Kurse' : 'همه دوره‌ها',
      searchStudents: locale === 'de' ? 'Schüler suchen' : 'جستجوی دانش‌آموز',
      loading: locale === 'de' ? 'Laden...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler' : 'خطا',
      retryButton: locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد',
      noStudents: locale === 'de' ? 'Keine Schüler gefunden' : 'هیچ دانش‌آموزی یافت نشد',
      noStudentsInCourse: locale === 'de' ? 'Keine Schüler in diesem Kurs gefunden' : 'هیچ دانش‌آموزی در این دوره یافت نشد',
      viewAllStudents: locale === 'de' ? 'Alle Schüler anzeigen' : 'مشاهده همه دانش‌آموزان',
      student: locale === 'de' ? 'Schüler' : 'دانش‌آموز',
      contact: locale === 'de' ? 'Kontakt' : 'تماس',
      enrolledCourses: locale === 'de' ? 'Eingeschriebene Kurse' : 'دوره‌های ثبت‌نام شده',
      actions: locale === 'de' ? 'Aktionen' : 'عملیات',
      viewDetails: locale === 'de' ? 'Details anzeigen' : 'مشاهده جزئیات',
      studentInfo: locale === 'de' ? 'Schülerinformationen' : 'اطلاعات دانش‌آموز',
      performance: locale === 'de' ? 'Leistung' : 'عملکرد',
      totalAssignments: locale === 'de' ? 'Gesamtzahl der Aufgaben' : 'کل تکالیف',
      submittedAssignments: locale === 'de' ? 'Eingereichte Aufgaben' : 'تکالیف ارسال شده',
      gradedAssignments: locale === 'de' ? 'Benotete Aufgaben' : 'تکالیف نمره‌دهی شده',
      pendingAssignments: locale === 'de' ? 'Ausstehende Aufgaben' : 'تکالیف در انتظار',
      avgGrade: locale === 'de' ? 'Durchschnittsnote' : 'میانگین نمره',
      completionRate: locale === 'de' ? 'Abschlussquote' : 'نرخ تکمیل',
      status: locale === 'de' ? 'Status' : 'وضعیت',
      recentSubmissions: locale === 'de' ? 'Neueste Einreichungen' : 'ارسال‌های اخیر',
      noSubmissions: locale === 'de' ? 'Keine Einreichungen gefunden' : 'هیچ ارسالی یافت نشد',
      assignment: locale === 'de' ? 'Aufgabe' : 'تکلیف',
      course: locale === 'de' ? 'Kurs' : 'دوره',
      submissionDate: locale === 'de' ? 'Einreichungsdatum' : 'تاریخ ارسال',
      grade: locale === 'de' ? 'Note' : 'نمره',
      graded: locale === 'de' ? 'Benotet' : 'نمره‌دهی شده',
      ungraded: locale === 'de' ? 'Unbenotet' : 'نمره‌دهی نشده',
      close: locale === 'de' ? 'Schließen' : 'بستن',
      submissions: locale === 'de' ? 'Einreichungen' : 'ارسال‌ها'
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="teacher"
    >
      <TeacherStudentsWrapper locale={locale} translations={translations.dashboard} />
    </DashboardLayout>
  );
} 