import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import AdminLayout from '@/app/components/layouts/AdminLayout';
import CharterForm from '@/app/components/admin/charters/CharterForm';

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: locale === 'de' ? 'Neues Prinzip hinzufügen' : 'افزودن منشور جدید',
    description: locale === 'de' 
      ? 'Erstellen Sie ein neues Prinzip für Ihr Institut.' 
      : 'ایجاد منشور جدید برای موسسه شما.',
  };
}

export default async function NewCharterPage({
  params
}: {
  params: { locale: Locale }
}) {
  const locale = params.locale;
  
  // Translations
  const translations = {
    dashboard: locale === 'de' ? 'Dashboard' : 'داشبورد',
    charters: locale === 'de' ? 'Prinzipien' : 'منشورها',
    newCharter: locale === 'de' ? 'Neues Prinzip' : 'منشور جدید',
    title: locale === 'de' ? 'Neues Prinzip erstellen' : 'ایجاد منشور جدید',
    titlePlaceholder: locale === 'de' ? 'Titel des Prinzips eingeben' : 'عنوان منشور را وارد کنید',
    titleFa: locale === 'de' ? 'Persischer Titel' : 'عنوان فارسی',
    titleFaPlaceholder: locale === 'de' ? 'Persischen Titel eingeben' : 'عنوان فارسی را وارد کنید',
    description: locale === 'de' ? 'Beschreibung' : 'توضیحات',
    descriptionPlaceholder: locale === 'de' ? 'Beschreibung des Prinzips eingeben' : 'توضیحات منشور را وارد کنید',
    descriptionFa: locale === 'de' ? 'Persische Beschreibung' : 'توضیحات فارسی',
    descriptionFaPlaceholder: locale === 'de' ? 'Persische Beschreibung eingeben' : 'توضیحات فارسی را وارد کنید',
    iconName: locale === 'de' ? 'Icon Name (optional)' : 'نام آیکون (اختیاری)',
    iconNamePlaceholder: locale === 'de' ? 'z.B. fas fa-book' : 'مثلا fas fa-book',
    orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب نمایش',
    isActive: locale === 'de' ? 'Aktiv' : 'فعال',
    save: locale === 'de' ? 'Speichern' : 'ذخیره',
    cancel: locale === 'de' ? 'Abbrechen' : 'انصراف',
    backToList: locale === 'de' ? 'Zurück zur Liste' : 'بازگشت به لیست',
    createSuccess: locale === 'de' ? 'Prinzip erfolgreich erstellt' : 'منشور با موفقیت ایجاد شد',
    updateSuccess: locale === 'de' ? 'Prinzip erfolgreich aktualisiert' : 'منشور با موفقیت بروزرسانی شد',
    errorOccurred: locale === 'de' ? 'Ein Fehler ist aufgetreten' : 'خطایی رخ داده است',
  };
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: translations.dashboard, href: `/${locale}/admin/dashboard` },
    { label: translations.charters, href: `/${locale}/admin/charters` },
    { label: translations.newCharter, href: `/${locale}/admin/charters/new` },
  ];
  
  return (
    <AdminLayout 
      locale={locale} 
      breadcrumbs={breadcrumbs}
      pageTitle={translations.title}
    >
      <div className="space-y-6">
        <CharterForm 
          locale={locale} 
          translations={translations} 
        />
      </div>
    </AdminLayout>
  );
} 