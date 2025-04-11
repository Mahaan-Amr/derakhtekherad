import { Metadata } from 'next';
import { getDictionary } from '@/app/i18n';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import TeachersManagementWrapper from '@/app/TeachersManagementWrapper';

// Generate metadata
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params;
  const dict = await getDictionary(locale);
  
  return {
    title: locale === 'de' ? 'Lehrer verwalten | Derakht-e Kherad' : 'مدیریت آموزگاران | درخت خرد',
    description: locale === 'de' 
      ? 'Verwalten Sie die Lehrer für Derakht-e Kherad'
      : 'مدیریت آموزگاران برای درخت خرد',
  };
}

// Define the Admin Teachers Page component
export default async function AdminTeachersPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  
  // Common fallbacks for translations
  const commonFallbacks = {
    de: {
      title: "Lehrer verwalten",
      newTeacher: "Neuer Lehrer",
      editTeacher: "Lehrer bearbeiten",
      search: "Suchen...",
      noDataFound: "Keine Lehrer gefunden",
      confirmDelete: "Möchten Sie diesen Lehrer wirklich löschen?",
      deleteSuccess: "Lehrer erfolgreich gelöscht",
      updateSuccess: "Lehrer erfolgreich aktualisiert",
      createSuccess: "Lehrer erfolgreich erstellt",
      deleteFailed: "Fehler beim Löschen des Lehrers",
      saveFailed: "Fehler beim Speichern des Lehrers",
      loadingUsers: "Benutzer werden geladen...",
      selectUser: "Benutzer auswählen",
      coursesCount: "Kurse",
      noCourses: "Keine Kurse",
      showCourses: "Kurse anzeigen",
      headers: {
        name: "Name",
        email: "E-Mail",
        specialties: "Spezialgebiete",
        courses: "Kurse",
        createdAt: "Erstellt am",
        actions: "Aktionen"
      },
      fields: {
        user: "Benutzer",
        bio: "Biografie",
        bioFa: "Biografie (Persisch)",
        specialties: "Spezialgebiete",
        photo: "Foto URL"
      },
      actions: {
        edit: "Bearbeiten",
        delete: "Löschen",
        save: "Speichern",
        cancel: "Abbrechen"
      },
      errors: {
        userRequired: "Bitte wählen Sie einen Benutzer aus",
        bioRequired: "Bitte geben Sie eine Biografie ein",
        bioFaRequired: "Bitte geben Sie eine persische Biografie ein"
      }
    },
    fa: {
      title: "مدیریت آموزگاران",
      newTeacher: "آموزگار جدید",
      editTeacher: "ویرایش آموزگار",
      search: "جستجو...",
      noDataFound: "هیچ آموزگاری یافت نشد",
      confirmDelete: "آیا مطمئن هستید که می‌خواهید این آموزگار را حذف کنید؟",
      deleteSuccess: "آموزگار با موفقیت حذف شد",
      updateSuccess: "آموزگار با موفقیت به‌روزرسانی شد",
      createSuccess: "آموزگار با موفقیت ایجاد شد",
      deleteFailed: "خطا در حذف آموزگار",
      saveFailed: "خطا در ذخیره آموزگار",
      loadingUsers: "در حال بارگذاری کاربران...",
      selectUser: "انتخاب کاربر",
      coursesCount: "دوره",
      noCourses: "بدون دوره",
      showCourses: "نمایش دوره‌ها",
      headers: {
        name: "نام",
        email: "ایمیل",
        specialties: "تخصص‌ها",
        courses: "دوره‌ها",
        createdAt: "تاریخ ایجاد",
        actions: "عملیات"
      },
      fields: {
        user: "کاربر",
        bio: "بیوگرافی",
        bioFa: "بیوگرافی (فارسی)",
        specialties: "تخصص‌ها",
        photo: "آدرس تصویر"
      },
      actions: {
        edit: "ویرایش",
        delete: "حذف",
        save: "ذخیره",
        cancel: "لغو"
      },
      errors: {
        userRequired: "لطفا یک کاربر انتخاب کنید",
        bioRequired: "لطفا یک بیوگرافی وارد کنید",
        bioFaRequired: "لطفا یک بیوگرافی فارسی وارد کنید"
      }
    }
  };
  
  // Get language-specific translations (fallback to default if not available)
  const teacherTranslations = commonFallbacks[locale];
  
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
    ...teacherTranslations
  };
  
  return (
    <DashboardLayout locale={locale} translations={translations} role="admin">
      <TeachersManagementWrapper locale={locale} translations={translations} />
    </DashboardLayout>
  );
} 