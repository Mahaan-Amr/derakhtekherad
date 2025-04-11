'use client';

import React from 'react';
import { Locale } from '@/app/i18n/settings';

interface TeacherDashboardContentProps {
  locale: Locale;
  translations: {
    title: string;
    welcome: string;
    overview: string;
    courses: string;
    students: string;
    assignments: string;
    materials: string;
    schedule: string;
    settings: string;
    totalStudents: string;
    activeCourses: string;
    pendingAssignments: string;
    upcomingClasses: string;
  };
}

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({
  locale,
  translations,
}) => {
  const isRtl = locale === 'fa';

  // Placeholder data for demonstration
  const stats = [
    { 
      id: 'students', 
      name: translations.totalStudents, 
      value: '45', 
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
    { 
      id: 'courses', 
      name: translations.activeCourses, 
      value: '6', 
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      ),
    },
    { 
      id: 'assignments', 
      name: translations.pendingAssignments, 
      value: '12', 
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
    },
    { 
      id: 'classes', 
      name: translations.upcomingClasses, 
      value: '4', 
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
    },
  ];

  // Placeholder course data
  const courses = [
    {
      id: 1,
      title: 'German A1 Intensive',
      students: 12,
      progress: 75,
      nextClass: locale === 'de' ? 'Morgen, 15:00 Uhr' : 'فردا، ساعت ۱۵:۰۰',
    },
    {
      id: 2,
      title: 'German B1 Regular',
      students: 8,
      progress: 60,
      nextClass: locale === 'de' ? 'Mittwoch, 17:30 Uhr' : 'چهارشنبه، ساعت ۱۷:۳۰',
    },
    {
      id: 3,
      title: 'German A2 Weekend',
      students: 15,
      progress: 40,
      nextClass: locale === 'de' ? 'Samstag, 10:00 Uhr' : 'شنبه، ساعت ۱۰:۰۰',
    },
    {
      id: 4,
      title: 'German Conversation Club',
      students: 10,
      progress: 30,
      nextClass: locale === 'de' ? 'Freitag, 18:00 Uhr' : 'جمعه، ساعت ۱۸:۰۰',
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {translations.title}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {translations.welcome}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div 
            key={stat.id}
            className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
            <div className={`flex items-center ${isRtl ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="p-3 bg-gray-100 rounded-full dark:bg-gray-700">
                {stat.icon}
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {translations.courses}
        </h2>
        <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    {locale === 'de' ? 'Kursname' : 'نام دوره'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    {locale === 'de' ? 'Schüler' : 'دانش‌آموزان'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    {locale === 'de' ? 'Fortschritt' : 'پیشرفت'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    {locale === 'de' ? 'Nächste Klasse' : 'کلاس بعدی'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.students}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {course.progress}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.nextClass}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {locale === 'de' ? 'Schnelle Aktionen' : 'اقدامات سریع'}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button className="p-3 text-center text-blue-600 transition-colors bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
              {locale === 'de' ? 'Kurs hinzufügen' : 'افزودن دوره'}
            </button>
            <button className="p-3 text-center text-green-600 transition-colors bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
              {locale === 'de' ? 'Aufgabe erstellen' : 'ایجاد تکلیف'}
            </button>
            <button className="p-3 text-center text-purple-600 transition-colors bg-purple-100 rounded-md hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800">
              {locale === 'de' ? 'Materialien hochladen' : 'آپلود مطالب'}
            </button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {locale === 'de' ? 'Kommende Ereignisse' : 'رویدادهای پیش رو'}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {locale === 'de' ? 'Mo' : 'دو'}
              </div>
              <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {locale === 'de' ? 'A1 Prüfungsvorbereitung' : 'آمادگی آزمون A1'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {locale === 'de' ? '10:00 - 12:00 Uhr' : '۱۰:۰۰ - ۱۲:۰۰'}
                </p>
              </div>
            </li>
            <li className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                {locale === 'de' ? 'Mi' : 'چه'}
              </div>
              <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {locale === 'de' ? 'B1 Konversationspraxis' : 'تمرین مکالمه B1'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {locale === 'de' ? '15:30 - 17:30 Uhr' : '۱۵:۳۰ - ۱۷:۳۰'}
                </p>
              </div>
            </li>
            <li className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                {locale === 'de' ? 'Fr' : 'جم'}
              </div>
              <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {locale === 'de' ? 'Lehrerkonferenz' : 'جلسه معلمان'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {locale === 'de' ? '13:00 - 14:00 Uhr' : '۱۳:۰۰ - ۱۴:۰۰'}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardContent; 