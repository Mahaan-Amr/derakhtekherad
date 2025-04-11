'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';

interface AdminDashboardContentProps {
  locale: Locale;
  translations: {
    title: string;
    welcome: string;
    overview: string;
    users?: string;
    courses: string;
    teachers?: string;
    students?: string;
    enrollments?: string;
    payments?: string;
    settings: string;
    totalUsers?: string;
    activeCourses?: string;
    newStudents?: string;
    revenue?: string;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
}

interface DashboardStats {
  totalUsers: number;
  activeCourses: number;
  newStudents: number;
  revenue: number;
  userGrowthPercent: number;
  courseGrowthPercent: number;
  studentGrowthPercent: number;
  revenueGrowthPercent: number;
  latestUsers: any[];
  latestCourses: any[];
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({ 
  locale, 
  translations 
}) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/dashboard/stats', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [token]);
  
  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, isPositive }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-light rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {typeof value === 'number' && title === translations.revenue
                    ? new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'fa-IR', {
                        style: 'currency',
                        currency: locale === 'de' ? 'EUR' : 'IRR',
                        maximumFractionDigits: 0,
                      }).format(value)
                    : value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {change}
            </span>{' '}
            <span className="text-gray-500 dark:text-gray-400">
              {locale === 'de' ? 'im Vergleich zum Vormonat' : 'نسبت به ماه قبل'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  
  if (!stats) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate">
            {translations.welcome}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {locale === 'de' 
              ? `Hier können Sie alle Aspekte von Derakhte Kherad verwalten.`
              : `در اینجا می‌توانید تمام جنبه‌های درخت خرد را مدیریت کنید.`}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={translations.totalUsers || ''}
          value={stats.totalUsers}
          icon={
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          change={`${Math.abs(stats.userGrowthPercent)}%`}
          isPositive={stats.userGrowthPercent >= 0}
        />
        <StatCard
          title={translations.activeCourses || ''}
          value={stats.activeCourses}
          icon={
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          }
          change={`${Math.abs(stats.courseGrowthPercent)}%`}
          isPositive={stats.courseGrowthPercent >= 0}
        />
        <StatCard
          title={translations.newStudents || ''}
          value={stats.newStudents}
          icon={
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
          change={`${Math.abs(stats.studentGrowthPercent)}%`}
          isPositive={stats.studentGrowthPercent >= 0}
        />
        <StatCard
          title={translations.revenue || ''}
          value={stats.revenue}
          icon={
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          change={`${Math.abs(stats.revenueGrowthPercent)}%`}
          isPositive={stats.revenueGrowthPercent >= 0}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {locale === 'de' ? 'Neueste Benutzer' : 'کاربران جدید'}
            </h3>
            <button className="text-sm text-primary hover:text-primary-dark">
              {locale === 'de' ? 'Alle anzeigen' : 'مشاهده همه'}
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.latestUsers.map((user) => (
                  <li key={user.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.role === 'STUDENT' 
                            ? locale === 'de' ? 'Student' : 'دانش‌آموز' 
                            : user.role === 'TEACHER'
                            ? locale === 'de' ? 'Lehrer' : 'آموزگار'
                            : locale === 'de' ? 'Admin' : 'مدیر'}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {locale === 'de' ? 'Neu' : 'جدید'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Recent Courses */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {locale === 'de' ? 'Neueste Kurse' : 'دوره‌های جدید'}
            </h3>
            <button className="text-sm text-primary hover:text-primary-dark">
              {locale === 'de' ? 'Alle anzeigen' : 'مشاهده همه'}
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.latestCourses.map((course) => (
                  <li key={course.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
                          {course.level.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {locale === 'de' ? course.title : course.titleFa}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {course.teacher.user.name} • {course._count.enrollments} {locale === 'de' ? 'Studenten' : 'دانش‌آموز'}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white">
                          {locale === 'de' ? 'Aktiv' : 'فعال'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent; 