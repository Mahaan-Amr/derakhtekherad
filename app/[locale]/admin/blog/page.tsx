import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import BlogManagement from '@/app/components/dashboard/admin/blog/BlogManagement';
import { getDictionary } from '@/app/i18n';

// Dynamic metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.blog?.title || 'Blog Management',
    description: dict.blog?.description || 'Manage blog posts and categories',
  };
}

// Define the admin blog management page component
export default async function AdminBlogPage({
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
      title: locale === 'de' ? 'Blog-Verwaltung' : 'مدیریت وبلاگ',
      welcome: locale === 'de' ? 'Willkommen in der Blog-Verwaltung' : 'به بخش مدیریت وبلاگ خوش آمدید',
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
    blog: {
      title: dict.blog?.title || (locale === 'de' ? 'Blog-Verwaltung' : 'مدیریت وبلاگ'),
      posts: dict.blog?.posts || (locale === 'de' ? 'Beiträge' : 'نوشته‌ها'),
      categories: dict.blog?.categories || (locale === 'de' ? 'Kategorien' : 'دسته‌بندی‌ها'),
      newPost: dict.blog?.newPost || (locale === 'de' ? 'Neuer Beitrag' : 'نوشته جدید'),
      newCategory: dict.blog?.newCategory || (locale === 'de' ? 'Neue Kategorie' : 'دسته‌بندی جدید'),
      publishedStatus: dict.blog?.publishedStatus || (locale === 'de' ? 'Veröffentlichungsstatus' : 'وضعیت انتشار'),
      published: dict.blog?.published || (locale === 'de' ? 'Veröffentlicht' : 'منتشر شده'),
      draft: dict.blog?.draft || (locale === 'de' ? 'Entwurf' : 'پیش‌نویس'),
      edit: dict.blog?.edit || (locale === 'de' ? 'Bearbeiten' : 'ویرایش'),
      delete: dict.blog?.delete || (locale === 'de' ? 'Löschen' : 'حذف'),
      confirmDelete: dict.blog?.confirmDelete || (locale === 'de' ? 'Löschen bestätigen' : 'تأیید حذف'),
      cancelDelete: dict.blog?.cancelDelete || (locale === 'de' ? 'Abbrechen' : 'لغو'),
      deleteSuccess: dict.blog?.deleteSuccess || (locale === 'de' ? 'Erfolgreich gelöscht' : 'با موفقیت حذف شد'),
      deleteFailed: dict.blog?.deleteFailed || (locale === 'de' ? 'Löschen fehlgeschlagen' : 'حذف ناموفق بود'),
      createPost: dict.blog?.createPost || (locale === 'de' ? 'Beitrag erstellen' : 'ایجاد نوشته'),
      updatePost: dict.blog?.updatePost || (locale === 'de' ? 'Beitrag aktualisieren' : 'بروزرسانی نوشته'),
      createSuccess: dict.blog?.createSuccess || (locale === 'de' ? 'Erfolgreich erstellt' : 'با موفقیت ایجاد شد'),
      updateSuccess: dict.blog?.updateSuccess || (locale === 'de' ? 'Erfolgreich aktualisiert' : 'با موفقیت بروزرسانی شد'),
      saveFailed: dict.blog?.saveFailed || (locale === 'de' ? 'Speichern fehlgeschlagen' : 'ذخیره ناموفق بود'),
      categoryCreateSuccess: dict.blog?.categoryCreateSuccess || (locale === 'de' ? 'Kategorie erfolgreich erstellt' : 'دسته‌بندی با موفقیت ایجاد شد'),
      categoryUpdateSuccess: dict.blog?.categoryUpdateSuccess || (locale === 'de' ? 'Kategorie erfolgreich aktualisiert' : 'دسته‌بندی با موفقیت بروزرسانی شد'),
      categoryDeleteSuccess: dict.blog?.categoryDeleteSuccess || (locale === 'de' ? 'Kategorie erfolgreich gelöscht' : 'دسته‌بندی با موفقیت حذف شد'),
      categoryDeleteFailed: dict.blog?.categoryDeleteFailed || (locale === 'de' ? 'Kategorie löschen fehlgeschlagen' : 'حذف دسته‌بندی ناموفق بود'),
      createCategory: dict.blog?.createCategory || (locale === 'de' ? 'Kategorie erstellen' : 'ایجاد دسته‌بندی'),
      updateCategory: dict.blog?.updateCategory || (locale === 'de' ? 'Kategorie aktualisieren' : 'بروزرسانی دسته‌بندی'),
      goBack: common.goBack,
      noDataFound: common.noDataFound,
      requiredFieldsMissing: common.requiredFieldsMissing,
      thumbnailUpload: dict.blog?.thumbnailUpload || (locale === 'de' ? 'Thumbnail hochladen' : 'آپلود تصویر بند‌انگشتی'),
      titleLabel: dict.blog?.titleLabel || (locale === 'de' ? 'Titel' : 'عنوان'),
      titleFaLabel: dict.blog?.titleFaLabel || (locale === 'de' ? 'Titel (Farsi)' : 'عنوان (فارسی)'),
      contentLabel: dict.blog?.contentLabel || (locale === 'de' ? 'Inhalt' : 'محتوا'),
      contentFaLabel: dict.blog?.contentFaLabel || (locale === 'de' ? 'Inhalt (Farsi)' : 'محتوا (فارسی)'),
      selectCategories: dict.blog?.selectCategories || (locale === 'de' ? 'Kategorien auswählen' : 'انتخاب دسته‌بندی‌ها'),
      save: common.save,
      cancel: common.cancel,
      slug: dict.blog?.slug || (locale === 'de' ? 'Slug' : 'نامک'),
      createdAt: common.createdAt,
      updatedAt: common.updatedAt,
      actions: common.actions,
      search: common.search,
      filterBy: common.filterBy,
      author: dict.blog?.author || (locale === 'de' ? 'Autor' : 'نویسنده'),
      category: dict.blog?.category || (locale === 'de' ? 'Kategorie' : 'دسته‌بندی'),
      nameLabel: dict.blog?.nameLabel || (locale === 'de' ? 'Name' : 'نام'),
      nameFaLabel: dict.blog?.nameFaLabel || (locale === 'de' ? 'Name (Farsi)' : 'نام (فارسی)'),
      descriptionLabel: dict.blog?.descriptionLabel || (locale === 'de' ? 'Beschreibung' : 'توضیحات'),
      descriptionFaLabel: dict.blog?.descriptionFaLabel || (locale === 'de' ? 'Beschreibung (Farsi)' : 'توضیحات (فارسی)'),
      postCount: dict.blog?.postCount || (locale === 'de' ? 'Beitragsanzahl' : 'تعداد نوشته‌ها'),
    }
  };

  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <BlogManagement locale={locale} translations={translations.blog} />
    </DashboardLayout>
  );
}