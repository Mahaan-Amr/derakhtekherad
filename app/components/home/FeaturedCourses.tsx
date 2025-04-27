'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { Course } from '@/app/types/course';
import CourseCard from '@/app/components/courses/CourseCard';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';

interface FeaturedCoursesProps {
  locale: Locale;
  courses?: Course[];
}

export default function FeaturedCourses({ locale, courses = [] }: FeaturedCoursesProps) {
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>(courses);
  const [loading, setLoading] = useState(courses.length === 0);
  
  const isRtl = locale === 'fa';

  // Fetch featured courses if not provided
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      if (courses.length > 0) {
        return;
      }
      
      try {
        setLoading(true);
        // Use a query parameter that's definitely supported by the database
        const response = await fetch('/api/courses?isActive=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured courses');
        }
        
        const data = await response.json();
        console.log('Fetched courses:', data);
        
        // Filter featured courses on the client side
        const featuredCourses = data.courses 
          ? data.courses.filter((course: Course) => course.featured)
          : [];
        
        setDisplayedCourses(featuredCourses);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedCourses();
  }, [courses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (displayedCourses.length === 0) {
    return null; // Don't render the section if no featured courses
  }

  return (
    <div className={`bg-white dark:bg-gray-900 py-16 sm:py-24 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {locale === 'de' ? 'Besondere Kurse' : 'دوره‌های ویژه'}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            {locale === 'de' 
              ? 'Entdecken Sie unsere hervorragenden Deutschkurse mit erfahrenen Lehrern'
              : 'برترین دوره‌های آموزش زبان آلمانی با تدریس اساتید مجرب'
            }
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCourses.map(course => (
            <CourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href={`/${locale}/courses`} passHref>
            <Button variant="outline" size="lg" className="hover:bg-primary-light/10 hover:text-primary-dark dark:hover:text-primary-light">
              {locale === 'de' ? 'Alle Kurse anzeigen' : 'مشاهده همه دوره‌ها'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 