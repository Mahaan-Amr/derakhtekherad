import { Metadata } from 'next';
import { getDictionary } from '@/app/i18n';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import StudentsManagementWrapper from '@/app/StudentsManagementWrapper';

// Generate metadata
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params;
  const dict = await getDictionary(locale);
  
  return {
    title: locale === 'de' ? 'Schüler verwalten | Derakht-e Kherad' : 'مدیریت دانش‌آموزان | درخت خرد',
    description: locale === 'de' 
      ? 'Verwalten Sie die Schüler für Derakht-e Kherad'
      : 'مدیریت دانش‌آموزان برای درخت خرد',
  };
}

// Define the Admin Students Page component
export default async function AdminStudentsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  
  // Common fallbacks for translations
  const commonFallbacks = {
    de: {
      title: "Schüler verwalten",
      newStudent: "Neuer Schüler",
      editStudent: "Schüler bearbeiten",
      search: "Suchen...",
      noDataFound: "Keine Schüler gefunden",
      confirmDelete: "Möchten Sie diesen Schüler wirklich löschen?",
      deleteSuccess: "Schüler erfolgreich gelöscht",
      updateSuccess: "Schüler erfolgreich aktualisiert",
      createSuccess: "Schüler erfolgreich erstellt",
      deleteFailed: "Fehler beim Löschen des Schülers",
      saveFailed: "Fehler beim Speichern des Schülers",
      loadingUsers: "Benutzer werden geladen...",
      selectUser: "Benutzer auswählen",
      courseCount: "Kurse",
      noCourses: "Keine Kurse",
      showCourses: "Kurse anzeigen",
      headers: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon",
        courses: "Kurse",
        createdAt: "Erstellt am",
        actions: "Aktionen"
      },
      fields: {
        user: "Benutzer",
        phone: "Telefonnummer",
        photo: "Foto URL"
      },
      actions: {
        edit: "Bearbeiten",
        delete: "Löschen",
        save: "Speichern",
        cancel: "Abbrechen"
      },
      errors: {
        userRequired: "Bitte wählen Sie einen Benutzer aus"
      }
    },
    fa: {
      title: "مدیریت دانش‌آموزان",
      newStudent: "دانش‌آموز جدید",
      editStudent: "ویرایش دانش‌آموز",
      search: "جستجو...",
      noDataFound: "هیچ دانش‌آموزی یافت نشد",
      confirmDelete: "آیا مطمئن هستید که می‌خواهید این دانش‌آموز را حذف کنید؟",
      deleteSuccess: "دانش‌آموز با موفقیت حذف شد",
      updateSuccess: "دانش‌آموز با موفقیت به‌روزرسانی شد",
      createSuccess: "دانش‌آموز با موفقیت ایجاد شد",
      deleteFailed: "خطا در حذف دانش‌آموز",
      saveFailed: "خطا در ذخیره دانش‌آموز",
      loadingUsers: "در حال بارگذاری کاربران...",
      selectUser: "انتخاب کاربر",
      courseCount: "دوره",
      noCourses: "بدون دوره",
      showCourses: "نمایش دوره‌ها",
      headers: {
        name: "نام",
        email: "ایمیل",
        phone: "تلفن",
        courses: "دوره‌ها",
        createdAt: "تاریخ ایجاد",
        actions: "عملیات"
      },
      fields: {
        user: "کاربر",
        phone: "شماره تلفن",
        photo: "آدرس تصویر"
      },
      actions: {
        edit: "ویرایش",
        delete: "حذف",
        save: "ذخیره",
        cancel: "لغو"
      },
      errors: {
        userRequired: "لطفا یک کاربر انتخاب کنید"
      }
    }
  };
  
  // Get language-specific translations (fallback to default if not available)
  const studentTranslations = commonFallbacks[locale];
  
  // Build the full translations object
  const translations = {
    navigation: {
      home: dict.navigation?.home || '',
      about: dict.navigation?.about || '',
      courses: dict.navigation?.courses || '',
      teachers: dict.navigation?.teachers || '',
      blog: dict.navigation?.blog || '',
      contact: dict.navigation?.contact || '',
      login: dict.navigation?.login || '',
      darkMode: dict.navigation?.darkMode || '',
      lightMode: dict.navigation?.lightMode || '',
    },
    footer: {
      address: dict.footer?.address || '',
      phone: dict.footer?.phone || '',
      email: dict.footer?.email || '',
      rights: dict.footer?.rights || '',
    },
    dashboard: {
      title: dict.dashboard?.title || '',
      welcome: dict.dashboard?.welcome || '',
      overview: dict.dashboard?.overview || '',
      users: dict.dashboard?.users || '',
      courses: dict.dashboard?.courses || '',
      teachers: dict.dashboard?.teachers || '',
      students: dict.dashboard?.students || '',
      enrollments: dict.dashboard?.enrollments || '',
      payments: dict.dashboard?.payments || '',
      settings: dict.dashboard?.settings || '',
      blog: dict.dashboard?.blog || '',
    },
    ...studentTranslations
  };
  
  return (
    <DashboardLayout locale={locale} translations={translations} role="admin">
      <StudentsManagementWrapper locale={locale} translations={translations} />
    </DashboardLayout>
  );
} 