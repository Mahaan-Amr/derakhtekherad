'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

// Define the props interface for the component
interface TeacherCoursesManagementProps {
  locale: Locale;
  translations: {
    title: string;
    welcome: string;
    courses: string;
    noCourses: string;
    loading: string;
    error: string;
    retryButton: string;
    courseDetails: string;
    showDetails: string;
    close: string;
    level: string;
    capacity: string;
    startDate: string;
    endDate: string;
    studentCount: string;
    moduleCount: string;
    assignmentCount: string;
    studentList: string;
    enrolledStudents: string;
    noStudents: string;
    viewAssignments: string;
    createAssignment: string;
    [key: string]: string;
  };
}

// Types for API response
interface CourseStudent {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Enrollment {
  id: string;
  student: CourseStudent;
  status: string;
}

interface Course {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  level: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  timeSlot: string;
  location: string;
  isActive: boolean;
  featured: boolean;
  thumbnail: string | null;
  _count: {
    enrollments: number;
    modules: number;
    assignments: number;
  };
  enrollments?: Enrollment[];
}

interface ApiResponse {
  courses: Course[];
}

// TeacherCoursesManagement component
const TeacherCoursesManagement: React.FC<TeacherCoursesManagementProps> = ({
  locale,
  translations
}) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showStudents, setShowStudents] = useState<boolean>(false);
  const isRtl = locale === 'fa';

  // Format date according to locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const includeStudents = true; // We want student data
      const url = `/api/courses/teacher?includeStudents=${includeStudents}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setCourses(data.courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(translations.error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of courses
  useEffect(() => {
    fetchCourses();
  }, [token]);

  // Handle course selection for detailed view
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  // Handle closing the detailed view
  const handleCloseDetails = () => {
    setSelectedCourse(null);
    setShowStudents(false);
  };

  // Handle toggling student list visibility
  const handleToggleStudents = () => {
    setShowStudents(!showStudents);
  };

  // Render the course card
  const renderCourseCard = (course: Course) => {
    return (
      <div 
        key={course.id} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col h-full">
          {/* Course thumbnail */}
          <div className="mb-4 relative h-40 w-full rounded-lg overflow-hidden">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={locale === 'de' ? course.title : course.titleFa}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
                <svg 
                  className="h-16 w-16 text-gray-400 dark:text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* Course title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {locale === 'de' ? course.title : course.titleFa}
          </h3>
          
          {/* Course details */}
          <div className="space-y-2 flex-grow mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {translations.level}:
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {course.level}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {translations.studentCount}:
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {course._count.enrollments} / {course.capacity}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {translations.startDate}:
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {formatDate(course.startDate)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {translations.moduleCount}:
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {course._count.modules}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {translations.assignmentCount}:
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {course._count.assignments}
              </span>
            </div>
          </div>
          
          {/* View Details Button */}
          <button
            onClick={() => handleCourseSelect(course)}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            {translations.showDetails}
          </button>
        </div>
      </div>
    );
  };

  // Course details modal
  const renderCourseDetails = () => {
    if (!selectedCourse) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {translations.courseDetails}
            </h2>
            <button 
              onClick={handleCloseDetails}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Course content */}
          <div className="px-6 py-4">
            {/* Course title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === 'de' ? selectedCourse.title : selectedCourse.titleFa}
            </h3>
            
            {/* Course thumbnail */}
            {selectedCourse.thumbnail && (
              <div className="mb-6 rounded-lg overflow-hidden relative h-64 w-full">
                <Image
                  src={selectedCourse.thumbnail}
                  alt={locale === 'de' ? selectedCourse.title : selectedCourse.titleFa}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            
            {/* Course description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {locale === 'de' ? 'Beschreibung' : 'توضیحات'}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {locale === 'de' ? selectedCourse.description : selectedCourse.descriptionFa}
              </p>
            </div>
            
            {/* Course details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {locale === 'de' ? 'Kursdetails' : 'جزئیات دوره'}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.level}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.capacity}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.studentCount}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse._count.enrollments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.startDate}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDate(selectedCourse.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.endDate}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDate(selectedCourse.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{locale === 'de' ? 'Zeitplan' : 'زمان‌بندی'}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{locale === 'de' ? 'Ort' : 'مکان'}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {locale === 'de' ? 'Materialien & Aufgaben' : 'مطالب و تکالیف'}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.moduleCount}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse._count.modules}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{translations.assignmentCount}:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedCourse._count.assignments}</span>
                  </div>
                </div>
                
                {/* Actions for modules and assignments */}
                <div className="mt-6 space-y-3">
                  <Link href={`/${locale}/teacher/assignments?courseId=${selectedCourse.id}`} className="block w-full">
                    <button className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">
                      {translations.viewAssignments}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Students section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={handleToggleStudents}
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {translations.enrolledStudents} ({selectedCourse._count.enrollments})
                </h4>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform ${showStudents ? 'rotate-180' : ''} transition-transform`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showStudents && (
                <div className="mt-4">
                  {selectedCourse.enrollments && selectedCourse.enrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {locale === 'de' ? 'Name' : 'نام'}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {locale === 'de' ? 'E-Mail' : 'ایمیل'}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {locale === 'de' ? 'Status' : 'وضعیت'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                          {selectedCourse.enrollments.map((enrollment) => (
                            <tr key={enrollment.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {enrollment.student.user.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                  {enrollment.student.user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${enrollment.status === 'ACTIVE' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                    : enrollment.status === 'COMPLETED'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                  }`}
                                >
                                  {enrollment.status === 'ACTIVE' 
                                    ? locale === 'de' ? 'Aktiv' : 'فعال'
                                    : enrollment.status === 'COMPLETED'
                                      ? locale === 'de' ? 'Abgeschlossen' : 'تکمیل شده'
                                      : locale === 'de' ? 'Abgebrochen' : 'لغو شده'
                                  }
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      {translations.noStudents}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {translations.title}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {translations.welcome}
        </p>
      </div>
      
      {/* Content */}
      <div className="mb-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">{translations.loading}</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex flex-col items-center justify-center h-64">
            <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchCourses}
              className="py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
            >
              {translations.retryButton}
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center h-64">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {translations.noCourses}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => renderCourseCard(course))}
          </div>
        )}
      </div>
      
      {/* Course details modal */}
      {selectedCourse && renderCourseDetails()}
    </div>
  );
};

export default TeacherCoursesManagement; 