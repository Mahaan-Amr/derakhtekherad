'use client';

import React from 'react';
import { Locale } from '@/app/i18n/settings';

interface StudentDashboardContentProps {
  locale: Locale;
  translations: {
    title: string;
    welcome: string;
    overview: string;
    courses: string;
    students: string;
    enrollments: string;
    assignments: string;
    settings: string;
    enrolledCourses: string;
    completedAssignments: string;
    averageGrade: string;
    upcomingDeadlines: string;
  };
}

const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  locale,
  translations,
}) => {
  const isRtl = locale === 'fa';

  // Placeholder data for demonstration
  const stats = [
    { 
      id: 'courses', 
      name: translations.enrolledCourses, 
      value: '3', 
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      ),
    },
    { 
      id: 'assignments', 
      name: translations.completedAssignments, 
      value: '8', 
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      ),
    },
    { 
      id: 'grade', 
      name: translations.averageGrade, 
      value: '87%', 
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
    },
    { 
      id: 'deadlines', 
      name: translations.upcomingDeadlines, 
      value: '2', 
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
  ];

  // Placeholder enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: 'German A1 for Beginners',
      teacher: 'Sarah Schmidt',
      progress: 65,
      nextClass: locale === 'de' ? 'Montag, 14:00 Uhr' : 'دوشنبه، ساعت ۱۴:۰۰',
    },
    {
      id: 2,
      title: 'German Pronunciation',
      teacher: 'Thomas Müller',
      progress: 40,
      nextClass: locale === 'de' ? 'Mittwoch, 16:30 Uhr' : 'چهارشنبه، ساعت ۱۶:۳۰',
    },
    {
      id: 3,
      title: 'German Culture & History',
      teacher: 'Anna Weber',
      progress: 25,
      nextClass: locale === 'de' ? 'Freitag, 10:00 Uhr' : 'جمعه، ساعت ۱۰:۰۰',
    },
  ];

  // Placeholder upcoming assignments
  const upcomingAssignments = [
    {
      id: 1,
      title: locale === 'de' ? 'Grammatikübung' : 'تمرین گرامر',
      course: 'German A1',
      deadline: locale === 'de' ? 'Morgen, 23:59 Uhr' : 'فردا، ساعت ۲۳:۵۹',
      status: 'pending',
    },
    {
      id: 2,
      title: locale === 'de' ? 'Leseverständnis' : 'تمرین خواندن',
      course: 'German A1',
      deadline: locale === 'de' ? 'In 3 Tagen' : '۳ روز دیگر',
      status: 'pending',
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

      {/* Enrolled Courses */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {translations.courses}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <div 
              key={course.id}
              className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {locale === 'de' ? 'Lehrer' : 'استاد'}: {course.teacher}
                </p>
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === 'de' ? 'Fortschritt' : 'پیشرفت'}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 bg-blue-600 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {locale === 'de' ? 'Nächste Klasse' : 'کلاس بعدی'}: {course.nextClass}
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  {locale === 'de' ? 'Zum Kurs gehen' : 'رفتن به دوره'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {translations.upcomingDeadlines}
        </h2>
        <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingAssignments.map((assignment) => (
              <li key={assignment.id} className="p-4">
                <div className={`flex items-start ${isRtl ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <div className={`flex-shrink-0 p-1 ${
                    assignment.status === 'pending' 
                      ? 'text-yellow-500' 
                      : assignment.status === 'completed' 
                        ? 'text-green-500' 
                        : 'text-red-500'
                  }`}>
                    {assignment.status === 'pending' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                    ) : assignment.status === 'completed' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {assignment.course} • {locale === 'de' ? 'Fällig' : 'موعد تحویل'}: {assignment.deadline}
                    </p>
                  </div>
                  <div>
                    <button className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                      {locale === 'de' ? 'Ansehen' : 'مشاهده'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {locale === 'de' ? 'Schnellzugriff' : 'دسترسی سریع'}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="p-3 text-center text-blue-600 transition-colors bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
            {locale === 'de' ? 'Alle Kurse' : 'همه دوره‌ها'}
          </button>
          <button className="p-3 text-center text-green-600 transition-colors bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
            {locale === 'de' ? 'Zeitplan' : 'برنامه زمانی'}
          </button>
          <button className="p-3 text-center text-purple-600 transition-colors bg-purple-100 rounded-md hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800">
            {locale === 'de' ? 'Materialien' : 'منابع آموزشی'}
          </button>
          <button className="p-3 text-center text-yellow-600 transition-colors bg-yellow-100 rounded-md hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">
            {locale === 'de' ? 'Hilfe' : 'راهنما'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardContent; 