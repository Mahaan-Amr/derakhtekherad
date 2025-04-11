import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import AdminLayout from '@/app/components/layouts/AdminLayout';
import CharterForm from '@/app/components/admin/charters/CharterForm';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';

export async function generateMetadata({
  params
}: {
  params: { locale: string, id: string }
}): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: locale === 'de' ? 'Prinzip bearbeiten' : 'ویرایش منشور',
    description: locale === 'de' 
      ? 'Bearbeiten Sie ein bestehendes Prinzip.' 
      : 'ویرایش منشور موجود.',
  };
}

// Fetch charter data by ID
async function getCharter(id: string) {
  try {
    if (!id) return null;
    
    const charter = await prisma.charter.findUnique({
      where: { id },
    });
    
    if (!charter) {
      return null;
    }
    
    return {
      id: charter.id,
      title: charter.title,
      titleFa: charter.titleFa,
      description: charter.description,
      descriptionFa: charter.descriptionFa,
      iconName: charter.iconName || '',
      orderIndex: charter.orderIndex,
      isActive: charter.isActive,
    };
  } catch (error) {
    console.error('Error fetching charter:', error);
    return null;
  }
}

export default async function EditCharterPage({
  params
}: {
  params: { locale: Locale, id: string }
}) {
  const locale = params.locale;
  const charterId = params.id;
  
  // Fetch charter data
  const charter = await getCharter(charterId);
  
  // If charter not found, return 404
  if (!charter) {
    notFound();
  }
  
  // Translations
  const translations = {
    dashboard: locale === 'de' ? 'Dashboard' : 'داشبورد',
    charters: locale === 'de' ? 'Prinzipien' : 'منشورها',
    editCharter: locale === 'de' ? 'Prinzip bearbeiten' : 'ویرایش منشور',
    title: locale === 'de' ? 'Prinzip bearbeiten' : 'ویرایش منشور',
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
    { label: translations.editCharter, href: `/${locale}/admin/charters/edit/${charterId}` },
  ];
  
  return (
    <AdminLayout 
      locale={locale} 
      pageTitle={translations.title}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <CharterForm 
          locale={locale} 
          translations={translations} 
          editMode={true}
          initialData={charter}
        />
      </div>
    </AdminLayout>
  );
} 