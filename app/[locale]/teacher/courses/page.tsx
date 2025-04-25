import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import TeacherCoursesManagement from '@/app/components/dashboard/teacher/TeacherCoursesManagement';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Teacher Courses | Derakhte Kherad',
  description: 'Manage your courses at Derakhte Kherad language school',
};

// Define the teacher courses page component
export default async function TeacherCoursesPage({
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
      title: locale === 'de' ? 'Meine Kurse' : 'دوره‌های من',
      welcome: locale === 'de' ? 'Verwalten Sie Ihre Kurse' : 'مدیریت دوره‌های شما',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      courses: locale === 'de' ? 'Meine Kurse' : 'دوره‌های من',
      students: locale === 'de' ? 'Meine Schüler' : 'دانش‌آموزان من',
      assignments: locale === 'de' ? 'Aufgaben' : 'تکالیف',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      users: '',
      teachers: '',
      enrollments: '',
      payments: '',
      blog: '',
      // Custom translations for TeacherCoursesManagement
      courseDetails: locale === 'de' ? 'Kursdetails' : 'جزئیات دوره',
      studentList: locale === 'de' ? 'Schülerliste' : 'لیست دانش‌آموزان',
      enrolledStudents: locale === 'de' ? 'Eingeschriebene Schüler' : 'دانش‌آموزان ثبت‌نام شده',
      noStudents: locale === 'de' ? 'Keine Schüler eingeschrieben' : 'هیچ دانش‌آموزی ثبت‌نام نشده است',
      noCourses: locale === 'de' ? 'Keine Kurse gefunden' : 'هیچ دوره‌ای یافت نشد',
      level: locale === 'de' ? 'Niveau' : 'سطح',
      capacity: locale === 'de' ? 'Kapazität' : 'ظرفیت',
      startDate: locale === 'de' ? 'Startdatum' : 'تاریخ شروع',
      endDate: locale === 'de' ? 'Enddatum' : 'تاریخ پایان',
      studentCount: locale === 'de' ? 'Anzahl der Schüler' : 'تعداد دانش‌آموزان',
      moduleCount: locale === 'de' ? 'Anzahl der Module' : 'تعداد ماژول‌ها',
      assignmentCount: locale === 'de' ? 'Anzahl der Aufgaben' : 'تعداد تکالیف',
      showDetails: locale === 'de' ? 'Details anzeigen' : 'نمایش جزئیات',
      close: locale === 'de' ? 'Schließen' : 'بستن',
      loading: locale === 'de' ? 'Laden...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Kurse' : 'خطا در بارگذاری دوره‌ها',
      retryButton: locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد',
      viewAssignments: locale === 'de' ? 'Aufgaben anzeigen' : 'مشاهده تکالیف',
      createAssignment: locale === 'de' ? 'Aufgabe erstellen' : 'ایجاد تکلیف جدید',
    }
  };

  // Create a copy of translations.dashboard with only the keys needed by TeacherCoursesManagement
  const coursesTranslations = {
    title: translations.dashboard.title,
    welcome: translations.dashboard.welcome,
    courses: translations.dashboard.courses,
    noCourses: translations.dashboard.noCourses,
    loading: translations.dashboard.loading,
    error: translations.dashboard.error,
    retryButton: translations.dashboard.retryButton,
    courseDetails: translations.dashboard.courseDetails,
    showDetails: translations.dashboard.showDetails,
    close: translations.dashboard.close,
    level: translations.dashboard.level,
    capacity: translations.dashboard.capacity,
    startDate: translations.dashboard.startDate,
    endDate: translations.dashboard.endDate,
    studentCount: translations.dashboard.studentCount,
    moduleCount: translations.dashboard.moduleCount,
    assignmentCount: translations.dashboard.assignmentCount,
    studentList: translations.dashboard.studentList,
    enrolledStudents: translations.dashboard.enrolledStudents,
    noStudents: translations.dashboard.noStudents,
    viewAssignments: translations.dashboard.viewAssignments,
    createAssignment: translations.dashboard.createAssignment,
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="teacher"
    >
      <TeacherCoursesManagement locale={locale} translations={coursesTranslations} />
    </DashboardLayout>
  );
} 