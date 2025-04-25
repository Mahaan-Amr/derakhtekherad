'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/app/i18n/settings';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import Button from '@/app/components/ui/Button';
import { toast } from 'react-hot-toast';

// Custom SVG components
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

interface Statistic {
  id: string;
  title: string;
  titleFa: string;
  value: string;
  orderIndex: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export default function StatisticsPage({
  params
}: {
  params: { locale: Locale }
}) {
  const { locale } = params;
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistic[]>([]);
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
      title: locale === 'de' ? 'Statistiken verwalten' : 'مدیریت آمار',
      welcome: locale === 'de' ? 'Verwalten Sie die Statistiken Ihrer Seite' : 'آمار سایت خود را مدیریت کنید',
      newStatistic: locale === 'de' ? 'Neue Statistik' : 'آمار جدید',
      overview: locale === 'de' ? 'Übersicht' : 'نمای کلی',
      users: locale === 'de' ? 'Benutzer' : 'کاربران',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      features: locale === 'de' ? 'Features' : 'ویژگی‌ها',
      statistics: locale === 'de' ? 'Statistiken' : 'آمار',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      students: locale === 'de' ? 'Schüler' : 'دانش‌آموزان',
      enrollments: locale === 'de' ? 'Einschreibungen' : 'ثبت‌نام‌ها',
      payments: locale === 'de' ? 'Zahlungen' : 'پرداخت‌ها',
      settings: locale === 'de' ? 'Einstellungen' : 'تنظیمات',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    },
    statistics: {
      id: locale === 'de' ? 'ID' : 'شناسه',
      title: locale === 'de' ? 'Titel (DE)' : 'عنوان (آلمانی)',
      titleFa: locale === 'de' ? 'Titel (FA)' : 'عنوان (فارسی)',
      value: locale === 'de' ? 'Wert' : 'مقدار',
      orderIndex: locale === 'de' ? 'Reihenfolge' : 'ترتیب',
      isActive: locale === 'de' ? 'Aktiv' : 'فعال',
      actions: locale === 'de' ? 'Aktionen' : 'عملیات',
      edit: locale === 'de' ? 'Bearbeiten' : 'ویرایش',
      delete: locale === 'de' ? 'Löschen' : 'حذف',
      confirmDelete: locale === 'de' ? 'Sind Sie sicher, dass Sie diese Statistik löschen möchten?' : 'آیا مطمئن هستید که می‌خواهید این آمار را حذف کنید؟',
      loading: locale === 'de' ? 'Laden...' : 'در حال بارگذاری...',
      error: locale === 'de' ? 'Fehler beim Laden der Statistiken' : 'خطا در بارگذاری آمار',
      noStatistics: locale === 'de' ? 'Keine Statistiken gefunden' : 'هیچ آماری یافت نشد',
      addSuccess: locale === 'de' ? 'Statistik erfolgreich hinzugefügt' : 'آمار با موفقیت اضافه شد',
      updateSuccess: locale === 'de' ? 'Statistik erfolgreich aktualisiert' : 'آمار با موفقیت به‌روزرسانی شد',
      deleteSuccess: locale === 'de' ? 'Statistik erfolgreich gelöscht' : 'آمار با موفقیت حذف شد',
      saveFailed: locale === 'de' ? 'Fehler beim Speichern der Statistik' : 'خطا در ذخیره آمار',
      deleteFailed: locale === 'de' ? 'Fehler beim Löschen der Statistik' : 'خطا در حذف آمار',
    }
  };
  
  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/statistics');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setStatistics(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(translations.statistics.error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatistics();
  }, [translations.statistics.error]);
  
  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm(translations.statistics.confirmDelete)) {
      try {
        const response = await fetch(`/api/statistics?id=${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Remove the deleted statistic from the state
        setStatistics(statistics.filter(stat => stat.id !== id));
        toast.success(translations.statistics.deleteSuccess);
      } catch (error) {
        console.error('Error deleting statistic:', error);
        toast.error(translations.statistics.deleteFailed);
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
          onClick={() => router.push(`/${locale}/admin/statistics/new`)}
          className="flex items-center gap-2"
        >
          <PlusIcon />
          {translations.dashboard.newStatistic}
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
      ) : statistics.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          {translations.statistics.noStatistics}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.statistics.title}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.statistics.value}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.statistics.orderIndex}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.statistics.isActive}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {translations.statistics.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {statistics.map((stat) => (
                  <tr key={stat.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{stat.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.titleFa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{stat.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {stat.orderIndex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stat.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {stat.isActive 
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
                          onClick={() => router.push(`/${locale}/admin/statistics/edit/${stat.id}`)}
                          className="inline-flex items-center"
                        >
                          <PencilIcon />
                          {translations.statistics.edit}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(stat.id)}
                          className="inline-flex items-center"
                        >
                          <TrashIcon />
                          {translations.statistics.delete}
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