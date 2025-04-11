import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import AdminLayout from '@/app/components/layouts/AdminLayout';
import ChartersList from '@/app/components/admin/charters/ChartersList';

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: locale === 'de' ? 'Prinzipien Verwaltung' : 'مدیریت منشورها',
    description: locale === 'de' 
      ? 'Verwalten Sie die Prinzipien und Werte Ihres Instituts.' 
      : 'مدیریت منشورها و ارزش‌های موسسه شما.',
  };
}

export default async function AdminChartersPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale;
  
  // Translations
  const translations = {
    dashboard: locale === 'de' ? 'Dashboard' : 'داشبورد',
    charters: locale === 'de' ? 'Prinzipien' : 'منشورها',
    welcome: locale === 'de' ? 'Willkommen in der Prinzipien-Verwaltung' : 'به مدیریت منشورها خوش آمدید',
    title: locale === 'de' ? 'Prinzipien verwalten' : 'مدیریت منشورها',
    description: locale === 'de' 
      ? 'Fügen Sie neue Prinzipien hinzu oder bearbeiten Sie bestehende.' 
      : 'منشورهای جدید اضافه کنید یا موارد موجود را ویرایش کنید.',
    addNew: locale === 'de' ? 'Neues Prinzip' : 'منشور جدید',
    noCharters: locale === 'de' ? 'Keine Prinzipien gefunden' : 'هیچ منشوری یافت نشد',
    deleteConfirm: locale === 'de' ? 'Sind Sie sicher, dass Sie dieses Prinzip löschen möchten?' : 'آیا مطمئن هستید که می‌خواهید این منشور را حذف کنید؟',
    actions: locale === 'de' ? 'Aktionen' : 'عملیات',
    edit: locale === 'de' ? 'Bearbeiten' : 'ویرایش',
    delete: locale === 'de' ? 'Löschen' : 'حذف',
    active: locale === 'de' ? 'Aktiv' : 'فعال',
    inactive: locale === 'de' ? 'Inaktiv' : 'غیرفعال',
    confirmDelete: locale === 'de' ? 'Ja, löschen' : 'بله، حذف شود',
    cancel: locale === 'de' ? 'Abbrechen' : 'انصراف',
    retryButton: locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد',
  };
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: translations.dashboard, href: `/${locale}/admin/dashboard` },
    { label: translations.charters, href: `/${locale}/admin/charters` },
  ];
  
  return (
    <AdminLayout 
      locale={locale} 
      breadcrumbs={breadcrumbs}
      pageTitle={translations.welcome}
    >
      <div className="space-y-6">
        <ChartersList locale={locale} translations={translations} />
      </div>
    </AdminLayout>
  );
} 