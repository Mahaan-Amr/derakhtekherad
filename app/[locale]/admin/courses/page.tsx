import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import CourseManagement from '@/app/components/dashboard/admin/courses/CourseManagement';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Course Management | Derakhte Kherad',
  description: 'Manage courses and modules for Derakhte Kherad language school',
};

// Define the admin courses management page component
export default async function AdminCoursesPage({
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
      title: locale === 'de' ? 'Kursverwaltung' : 'مدیریت دوره‌ها',
      welcome: locale === 'de' ? 'Willkommen in der Kursverwaltung' : 'به بخش مدیریت دوره‌ها خوش آمدید',
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
    },
    courses: {
      title: locale === 'de' ? 'Kursverwaltung' : 'مدیریت دوره‌ها',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      modules: locale === 'de' ? 'Module' : 'ماژول‌ها',
      newCourse: locale === 'de' ? 'Neuer Kurs' : 'دوره جدید',
      newModule: locale === 'de' ? 'Neues Modul' : 'ماژول جدید',
      activeStatus: locale === 'de' ? 'Status' : 'وضعیت',
      active: locale === 'de' ? 'Aktiv' : 'فعال',
      inactive: locale === 'de' ? 'Inaktiv' : 'غیرفعال',
      edit: locale === 'de' ? 'Bearbeiten' : 'ویرایش',
      delete: locale === 'de' ? 'Löschen' : 'حذف',
      confirmDelete: locale === 'de' ? 'Sind Sie sicher, dass Sie diesen Kurs löschen möchten?' : 'آیا مطمئن هستید که می‌خواهید این دوره را حذف کنید؟',
      thumbnailUpload: locale === 'de' ? 'Bild hochladen' : 'آپلود تصویر',
      titleLabel: locale === 'de' ? 'Titel' : 'عنوان',
      titleFaLabel: locale === 'de' ? 'Titel (Farsi)' : 'عنوان (فارسی)',
      descriptionLabel: locale === 'de' ? 'Beschreibung' : 'توضیحات',
      descriptionFaLabel: locale === 'de' ? 'Beschreibung (Farsi)' : 'توضیحات (فارسی)',
      levelLabel: locale === 'de' ? 'Level' : 'سطح',
      capacityLabel: locale === 'de' ? 'Kapazität' : 'ظرفیت',
      startDateLabel: locale === 'de' ? 'Startdatum' : 'تاریخ شروع',
      endDateLabel: locale === 'de' ? 'Enddatum' : 'تاریخ پایان',
      timeSlotLabel: locale === 'de' ? 'Zeitraum' : 'زمان‌بندی',
      locationLabel: locale === 'de' ? 'Ort' : 'مکان',
      teacherLabel: locale === 'de' ? 'Lehrer' : 'استاد',
      selectTeacher: locale === 'de' ? 'Lehrer auswählen' : 'استاد را انتخاب کنید',
      save: locale === 'de' ? 'Speichern' : 'ذخیره',
      cancel: locale === 'de' ? 'Abbrechen' : 'انصراف',
      priceLabel: locale === 'de' ? 'Preis' : 'قیمت',
      createdAt: locale === 'de' ? 'Erstellt am' : 'تاریخ ایجاد',
      updatedAt: locale === 'de' ? 'Aktualisiert am' : 'تاریخ بروزرسانی',
      actions: locale === 'de' ? 'Aktionen' : 'اقدامات',
      search: locale === 'de' ? 'Suchen' : 'جستجو',
      filterBy: locale === 'de' ? 'Filtern nach' : 'فیلتر بر اساس',
      teacher: locale === 'de' ? 'Lehrer' : 'استاد',
      level: locale === 'de' ? 'Level' : 'سطح',
      noDataFound: locale === 'de' ? 'Keine Daten gefunden' : 'داده‌ای یافت نشد',
      moduleTitle: locale === 'de' ? 'Modultitel' : 'عنوان ماژول',
      moduleTitleFa: locale === 'de' ? 'Modultitel (Farsi)' : 'عنوان ماژول (فارسی)',
      orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب',
      lessonCount: locale === 'de' ? 'Lektionen' : 'درس‌ها',
      dragToReorder: locale === 'de' ? 'Ziehen Sie, um die Reihenfolge zu ändern' : 'برای تغییر ترتیب بکشید',
      featuredLabel: locale === 'de' ? 'Empfohlen' : 'پیشنهاد ویژه',
      featuredStatus: locale === 'de' ? 'Auf der Startseite präsentieren' : 'نمایش در صفحه اصلی',
      featuredYes: locale === 'de' ? 'Ja' : 'بله',
      featuredNo: locale === 'de' ? 'Nein' : 'خیر',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <CourseManagement locale={locale} translations={translations.courses} />
    </DashboardLayout>
  );
} 