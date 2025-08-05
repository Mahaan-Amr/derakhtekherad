'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { Course } from '@/app/types/course';
import CourseCard from './CourseCard';

interface CourseListProps {
  locale: Locale;
  translations: {
    title: string;
    description: string;
    customCoursesTitle: string;
    customCoursesDescription: string;
    contactUs: string;
    noCoursesFound: string;
  };
}

export default function CourseList({ locale, translations }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isRtl = locale === 'fa';
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        
        if (!response.ok) {
          throw new Error(`Error fetching courses: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data.courses && Array.isArray(data.courses) ? data.courses : []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {translations.title}
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            {translations.description}
          </p>
        </div>
        
        {courses.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                locale={locale} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {translations.noCoursesFound}
            </p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {translations.customCoursesTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            {translations.customCoursesDescription}
          </p>
          <div className="mt-6">
            <a 
              href={`/${locale}/contact`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium !text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              style={{ color: 'white' }}
            >
              {translations.contactUs}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 