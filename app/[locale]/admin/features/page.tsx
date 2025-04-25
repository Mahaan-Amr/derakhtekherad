'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import Button from '@/app/components/ui/Button';
import { toast } from 'react-hot-toast';

// Custom SVG components to replace Heroicons
const PlusIcon = () => (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PencilIcon = () => (
  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface FeatureItem {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  iconName: string;
  orderIndex: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeaturesPage({
  params
}: {
  params: { locale: Locale }
}) {
  const { locale } = params;
  const router = useRouter();
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      title: locale === 'de' ? 'Features verwalten' : 'مدیریت ویژگی‌ها',
      welcome: locale === 'de' ? 'Verwalten Sie die "Warum uns wählen" Features' : 'ویژگی‌های "چرا ما را انتخاب کنید" را مدیریت کنید',
      newFeature: locale === 'de' ? 'Neues Feature' : 'ویژگی جدید',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      users: locale === 'de' ? 'Benutzer' : 'کاربران',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      features: locale === 'de' ? 'Features' : 'ویژگی‌ها',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      students: locale === 'de' ? 'Schüler' : 'دانش‌آموزان',
      enrollments: locale === 'de' ? 'Einschreibungen' : 'ثبت‌نام‌ها',
      payments: locale === 'de' ? 'Zahlungen' : 'پرداخت‌ها',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    },
    features: {
      id: locale === 'de' ? 'ID' : 'شناسه',
      title: locale === 'de' ? 'Titel (DE)' : 'عنوان (آلمانی)',
      titleFa: locale === 'de' ? 'Titel (FA)' : 'عنوان (فارسی)',
      description: locale === 'de' ? 'Beschreibung (DE)' : 'توضیحات (آلمانی)',
      descriptionFa: locale === 'de' ? 'Beschreibung (FA)' : 'توضیحات (فارسی)',
      iconName: locale === 'de' ? 'Icon Name' : 'نام آیکون',
      orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب',
      isActive: locale === 'de' ? 'Aktiv' : 'فعال',
      actions: locale === 'de' ? 'Aktionen' : 'عملیات',
      edit: locale === 'de' ? 'Bearbeiten' : 'ویرایش',
      delete: locale === 'de' ? 'Löschen' : 'حذف',
      confirmDelete: locale === 'de' ? 'Sind Sie sicher, dass Sie dieses Feature löschen möchten?' : 'آیا مطمئن هستید که می‌خواهید این ویژگی را حذف کنید؟',
      loading: locale === 'de' ? 'Laden...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Features' : 'خطا در بارگذاری ویژگی‌ها',
      noFeatures: locale === 'de' ? 'Keine Features gefunden' : 'هیچ ویژگی یافت نشد',
      addSuccess: locale === 'de' ? 'Feature erfolgreich hinzugefügt' : 'ویژگی با موفقیت اضافه شد',
      updateSuccess: locale === 'de' ? 'Feature erfolgreich aktualisiert' : 'ویژگی با موفقیت به‌روزرسانی شد',
      deleteSuccess: locale === 'de' ? 'Feature erfolgreich gelöscht' : 'ویژگی با موفقیت حذف شد',
      saveFailed: locale === 'de' ? 'Fehler beim Speichern des Features' : 'خطا در ذخیره ویژگی',
      deleteFailed: locale === 'de' ? 'Fehler beim Löschen des Features' : 'خطا در حذف ویژگی',
    }
  };
  
  // Fetch features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/features');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setFeatures(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching features:', error);
        setError(translations.features.error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeatures();
  }, [translations.features.error]);
  
  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm(translations.features.confirmDelete)) {
      try {
        const response = await fetch(`/api/features?id=${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Remove the deleted feature from the state
        setFeatures(features.filter(feature => feature.id !== id));
        toast.success(translations.features.deleteSuccess);
      } catch (error) {
        console.error('Error deleting feature:', error);
        toast.error(translations.features.deleteFailed);
      }
    }
  };
  
  return (
    <DashboardLayout 
      locale={locale} 
      translations={translations} 
      role="admin"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{translations.dashboard.title}</h1>
        <Button 
          onClick={() => router.push(`/${locale}/admin/features/new`)}
          className="flex items-center gap-2"
        >
          <PlusIcon />
          {translations.dashboard.newFeature}
        </Button>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {translations.dashboard.welcome}
      </p>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : features.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          {translations.features.noFeatures}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.features.title}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.features.iconName}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.features.orderIndex}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.features.isActive}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.features.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {features.map((feature) => (
                  <tr key={feature.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{feature.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{feature.titleFa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex-shrink-0 mr-2 flex items-center justify-center bg-primary rounded-full">
                          {renderFeatureIcon(feature.iconName)}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">{feature.iconName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {feature.orderIndex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        feature.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {feature.isActive 
                          ? (locale === 'de' ? 'Ja' : 'بله') 
                          : (locale === 'de' ? 'Nein' : 'خیر')
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/${locale}/admin/features/edit/${feature.id}`)}
                          className="inline-flex items-center"
                        >
                          <PencilIcon />
                          {translations.features.edit}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(feature.id)}
                          className="inline-flex items-center"
                        >
                          <TrashIcon />
                          {translations.features.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Helper function to render icons based on iconName
function renderFeatureIcon(iconName: string) {
  switch (iconName) {
    case 'teacher':
      return (
        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'building':
      return (
        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'shield':
      return (
        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    // Add more icons as needed
    default:
      return (
        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
} 