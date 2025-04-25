import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import TeacherAssignmentsWrapper from '@/app/components/dashboard/teacher/TeacherAssignmentsWrapper';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Teacher Assignments | Derakhte Kherad',
  description: 'Manage your course assignments at Derakhte Kherad language school',
};

// Define the teacher assignments page component
export default async function TeacherAssignmentsPage({
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
      title: locale === 'de' ? 'Aufgabenverwaltung' : 'مدیریت تکالیف',
      welcome: locale === 'de' ? 'Verwalten Sie Aufgaben für Ihre Kurse' : 'مدیریت تکالیف برای دوره‌های شما',
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
      // Custom translations for Assignments Management
      assignmentTitleLabel: locale === 'de' ? 'Titel' : 'عنوان',
      assignmentDescriptionLabel: locale === 'de' ? 'Beschreibung' : 'توضیحات',
      courseName: locale === 'de' ? 'Kurs' : 'دوره',
      createAssignment: locale === 'de' ? 'Neue Aufgabe erstellen' : 'ایجاد تکلیف جدید',
      editAssignment: locale === 'de' ? 'Aufgabe bearbeiten' : 'ویرایش تکلیف',
      deleteAssignment: locale === 'de' ? 'Aufgabe löschen' : 'حذف تکلیف',
      assignmentDetails: locale === 'de' ? 'Aufgabendetails' : 'جزئیات تکلیف',
      submissions: locale === 'de' ? 'Einreichungen' : 'ارسال‌ها',
      noSubmissions: locale === 'de' ? 'Keine Einreichungen gefunden' : 'هیچ ارسالی یافت نشد',
      noAssignments: locale === 'de' ? 'Keine Aufgaben gefunden' : 'هیچ تکلیفی یافت نشد',
      dueDate: locale === 'de' ? 'Fälligkeitsdatum' : 'تاریخ تحویل',
      courseFilter: locale === 'de' ? 'Nach Kurs filtern' : 'فیلتر بر اساس دوره',
      allCourses: locale === 'de' ? 'Alle Kurse' : 'همه دوره‌ها',
      loading: locale === 'de' ? 'Laden...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Aufgaben' : 'خطا در بارگذاری تکالیف',
      retryButton: locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد',
      save: locale === 'de' ? 'Speichern' : 'ذخیره',
      cancel: locale === 'de' ? 'Abbrechen' : 'انصراف',
      confirmDelete: locale === 'de' ? 'Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?' : 'آیا مطمئن هستید که می‌خواهید این تکلیف را حذف کنید؟',
      submissionCount: locale === 'de' ? 'Anzahl der Einreichungen' : 'تعداد ارسال‌ها',
      viewSubmissions: locale === 'de' ? 'Einreichungen anzeigen' : 'مشاهده ارسال‌ها',
      close: locale === 'de' ? 'Schließen' : 'بستن',
      selectCourse: locale === 'de' ? 'Kurs auswählen' : 'انتخاب دوره',
      created: locale === 'de' ? 'Erstellt' : 'ایجاد شده',
      status: locale === 'de' ? 'Status' : 'وضعیت',
      student: locale === 'de' ? 'Schüler' : 'دانش‌آموز',
      grade: locale === 'de' ? 'Note' : 'نمره',
      feedback: locale === 'de' ? 'Feedback' : 'بازخورد',
      submittedOn: locale === 'de' ? 'Eingereicht am' : 'ارسال شده در',
      late: locale === 'de' ? 'Verspätet' : 'با تاخیر',
      onTime: locale === 'de' ? 'Pünktlich' : 'به موقع',
      graded: locale === 'de' ? 'Bewertet' : 'نمره داده شده',
      ungraded: locale === 'de' ? 'Nicht bewertet' : 'نمره داده نشده',
      gradingForm: locale === 'de' ? 'Bewertungsformular' : 'فرم نمره‌دهی',
      submitGrade: locale === 'de' ? 'Note einreichen' : 'ثبت نمره',
      studentSubmission: locale === 'de' ? 'Einreichung des Schülers' : 'ارسال دانش‌آموز',
      enterGrade: locale === 'de' ? 'Note eingeben (0-100)' : 'نمره را وارد کنید (0-100)',
      enterFeedback: locale === 'de' ? 'Feedback eingeben' : 'بازخورد را وارد کنید',
      downloadAttachment: locale === 'de' ? 'Anhang herunterladen' : 'دانلود فایل پیوست',
      noAttachment: locale === 'de' ? 'Kein Anhang' : 'بدون فایل پیوست',
      editGrade: locale === 'de' ? 'Note bearbeiten' : 'ویرایش نمره',
      attachment: locale === 'de' ? 'Anhang' : 'پیوست',
      fileUploaded: locale === 'de' ? 'Datei hochgeladen' : 'فایل آپلود شد',
      actions: locale === 'de' ? 'Aktionen' : 'عملیات',
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="teacher"
    >
      <TeacherAssignmentsWrapper 
        locale={locale} 
        translations={translations.dashboard} 
      />
    </DashboardLayout>
  );
} 