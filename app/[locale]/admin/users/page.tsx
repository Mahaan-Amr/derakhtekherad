import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import { getDictionary } from '@/app/i18n';
import UsersManagement from '@/app/components/dashboard/admin/users/UsersManagement';

// Dynamic metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.dashboard?.users || 'User Management',
    description: dict.dashboard?.usersDescription || 'Manage users, students, teachers and administrators',
  };
}

// Define the admin users management page component
export default async function AdminUsersPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  const dict = await getDictionary(locale);
  
  // Define common fallback translations
  const commonFallbacks = {
    goBack: locale === 'de' ? 'Zurück' : 'بازگشت',
    noDataFound: locale === 'de' ? 'Keine Daten gefunden' : 'داده‌ای یافت نشد',
    requiredFieldsMissing: locale === 'de' ? 'Pflichtfelder fehlen' : 'فیلدهای ضروری وارد نشده‌اند',
    save: locale === 'de' ? 'Speichern' : 'ذخیره',
    cancel: locale === 'de' ? 'Abbrechen' : 'لغو',
    createdAt: locale === 'de' ? 'Erstellt am' : 'تاریخ ایجاد',
    updatedAt: locale === 'de' ? 'Aktualisiert am' : 'تاریخ بروزرسانی',
    actions: locale === 'de' ? 'Aktionen' : 'عملیات',
    search: locale === 'de' ? 'Suchen' : 'جستجو',
    filterBy: locale === 'de' ? 'Filtern nach' : 'فیلتر بر اساس'
  };
  
  // Access dict.common safely or use fallbacks
  const common = dict.common || commonFallbacks;
  
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
      title: locale === 'de' ? 'Benutzerverwaltung' : 'مدیریت کاربران',
      welcome: locale === 'de' ? 'Willkommen in der Benutzerverwaltung' : 'به بخش مدیریت کاربران خوش آمدید',
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
    users: {
      title: dict.users?.title || (locale === 'de' ? 'Benutzerverwaltung' : 'مدیریت کاربران'),
      all: dict.users?.all || (locale === 'de' ? 'Alle Benutzer' : 'همه کاربران'),
      admins: dict.users?.admins || (locale === 'de' ? 'Administratoren' : 'مدیران'),
      teachers: dict.users?.teachers || (locale === 'de' ? 'Lehrer' : 'اساتید'),
      students: dict.users?.students || (locale === 'de' ? 'Schüler' : 'دانش‌آموزان'),
      newUser: dict.users?.newUser || (locale === 'de' ? 'Neuer Benutzer' : 'کاربر جدید'),
      edit: dict.users?.edit || (locale === 'de' ? 'Bearbeiten' : 'ویرایش'),
      delete: dict.users?.delete || (locale === 'de' ? 'Löschen' : 'حذف'),
      confirmDelete: dict.users?.confirmDelete || (locale === 'de' ? 'Löschen bestätigen' : 'تأیید حذف'),
      cancelDelete: dict.users?.cancelDelete || (locale === 'de' ? 'Abbrechen' : 'لغو'),
      deleteSuccess: dict.users?.deleteSuccess || (locale === 'de' ? 'Erfolgreich gelöscht' : 'با موفقیت حذف شد'),
      deleteFailed: dict.users?.deleteFailed || (locale === 'de' ? 'Löschen fehlgeschlagen' : 'حذف ناموفق بود'),
      createUser: dict.users?.createUser || (locale === 'de' ? 'Benutzer erstellen' : 'ایجاد کاربر'),
      updateUser: dict.users?.updateUser || (locale === 'de' ? 'Benutzer aktualisieren' : 'بروزرسانی کاربر'),
      createSuccess: dict.users?.createSuccess || (locale === 'de' ? 'Erfolgreich erstellt' : 'با موفقیت ایجاد شد'),
      updateSuccess: dict.users?.updateSuccess || (locale === 'de' ? 'Erfolgreich aktualisiert' : 'با موفقیت بروزرسانی شد'),
      saveFailed: dict.users?.saveFailed || (locale === 'de' ? 'Speichern fehlgeschlagen' : 'ذخیره ناموفق بود'),
      goBack: common.goBack,
      noDataFound: common.noDataFound,
      requiredFieldsMissing: common.requiredFieldsMissing,
      name: dict.users?.name || (locale === 'de' ? 'Name' : 'نام'),
      email: dict.users?.email || (locale === 'de' ? 'E-Mail' : 'ایمیل'),
      role: dict.users?.role || (locale === 'de' ? 'Rolle' : 'نقش'),
      password: dict.users?.password || (locale === 'de' ? 'Passwort' : 'رمز عبور'),
      confirmPassword: dict.users?.confirmPassword || (locale === 'de' ? 'Passwort bestätigen' : 'تأیید رمز عبور'),
      save: common.save,
      cancel: common.cancel,
      createdAt: common.createdAt,
      updatedAt: common.updatedAt,
      actions: common.actions,
      search: common.search,
      filterBy: common.filterBy,
      admin: dict.users?.admin || (locale === 'de' ? 'Administrator' : 'مدیر'),
      teacher: dict.users?.teacher || (locale === 'de' ? 'Lehrer' : 'استاد'),
      student: dict.users?.student || (locale === 'de' ? 'Schüler' : 'دانش‌آموز'),
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      {/* Replace with actual UsersManagement component once created */}
      <UsersManagement locale={locale} translations={translations.users} />
    </DashboardLayout>
  );
} 