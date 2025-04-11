'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// Define types
interface TeacherStudentsManagementProps {
  locale: Locale;
  translations: any;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Student {
  id: string;
  user: User;
  phone?: string;
  photo?: string;
  enrollments: Enrollment[];
}

interface Course {
  id: string;
  title: string;
  titleFa: string;
  _count: {
    enrollments: number;
  };
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN';
  course: {
    id: string;
    title: string;
    titleFa: string;
  };
}

interface ApiResponse {
  students: Student[];
  courses: Course[];
  totalCount: number;
}

interface StudentDetail {
  id: string;
  user: User;
  phone?: string;
  photo?: string;
  enrollments: Enrollment[];
  statistics: {
    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;
    avgGrade: number | null;
    totalAssignments: number;
    completionRate: number;
  };
  submissions: any[];
}

export default function TeacherStudentsManagement({ locale, translations }: TeacherStudentsManagementProps) {
  // Authentication token
  const { token } = useAuth();
  
  // State variables
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  // Fetch students when component mounts or filters change
  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token, selectedCourseId, searchTerm]);

  // Fetch students from API
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedCourseId) {
        params.append('courseId', selectedCourseId);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/students/teacher?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      setStudents(data.students);
      setCourses(data.courses);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch detailed student information
  const fetchStudentDetails = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/teacher?studentId=${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedStudent(data.student);
      setShowStudentDetails(true);
    } catch (err) {
      console.error('Error fetching student details:', err);
      // Could show an error notification here
    }
  };

  // Handle course filter change
  const handleCourseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Get enrollment status label based on status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: locale === 'de' ? 'Aktiv' : 'فعال',
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      case 'COMPLETED':
        return {
          label: locale === 'de' ? 'Abgeschlossen' : 'تکمیل شده',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      case 'WITHDRAWN':
        return {
          label: locale === 'de' ? 'Zurückgezogen' : 'انصراف داده',
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        };
    }
  };

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (locale === 'de') {
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } else {
      // Persian date formatting
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {translations.myStudents}
        </h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {/* Course filter dropdown */}
          <select
            value={selectedCourseId}
            onChange={handleCourseFilterChange}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">{translations.allCourses}</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {locale === 'de' ? course.title : course.titleFa} 
                ({course._count.enrollments})
              </option>
            ))}
          </select>
          
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={translations.searchStudents}
            />
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-700 dark:text-gray-300">{translations.loading}</span>
        </div>
      ) : error ? (
        // Error state
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">{translations.error}</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={fetchStudents}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            {translations.retryButton}
          </button>
        </div>
      ) : students.length === 0 ? (
        // Empty state
        <div className="text-center text-gray-700 dark:text-gray-300 py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium">
            {selectedCourseId 
              ? translations.noStudentsInCourse 
              : translations.noStudents}
          </h3>
          {selectedCourseId && (
            <button
              onClick={() => setSelectedCourseId('')}
              className="mt-2 text-primary hover:text-primary-dark"
            >
              {translations.viewAllStudents}
            </button>
          )}
        </div>
      ) : (
        // Students list
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.student}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.contact}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.enrolledCourses}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.photo ? (
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={student.photo}
                            alt={student.user.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{student.user.email}</div>
                    {student.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{student.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {student.enrollments.map(enrollment => {
                        const statusInfo = getStatusLabel(enrollment.status);
                        return (
                          <span 
                            key={enrollment.id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                          >
                            {locale === 'de' ? enrollment.course.title : enrollment.course.titleFa}
                            <span className="mx-1">-</span>
                            {statusInfo.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => fetchStudentDetails(student.id)}
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      {translations.viewDetails}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Student details modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStudent.user.name}
                </h2>
                <button
                  onClick={() => {
                    setShowStudentDetails(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Student info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {translations.studentInfo}
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    {selectedStudent.photo ? (
                      <div className="h-20 w-20 relative mr-4">
                        <Image
                          src={selectedStudent.photo}
                          alt={selectedStudent.user.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedStudent.user.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {selectedStudent.user.email}
                      </div>
                      {selectedStudent.phone && (
                        <div className="text-gray-600 dark:text-gray-300">
                          {selectedStudent.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Performance metrics */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {translations.performance}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{translations.totalAssignments}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent.statistics.totalAssignments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{translations.submittedAssignments}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent.statistics.totalSubmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{translations.gradedAssignments}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent.statistics.gradedSubmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{translations.pendingAssignments}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent.statistics.pendingSubmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{translations.avgGrade}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedStudent.statistics.avgGrade !== null 
                          ? `${selectedStudent.statistics.avgGrade.toFixed(1)}/100` 
                          : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{translations.completionRate}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedStudent.statistics.completionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enrollments */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {translations.enrolledCourses}
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedStudent.enrollments.map(enrollment => {
                      const statusInfo = getStatusLabel(enrollment.status);
                      return (
                        <div key={enrollment.id} className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {locale === 'de' ? enrollment.course.title : enrollment.course.titleFa}
                          </span>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-600 dark:text-gray-300">{translations.status}:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Recent submissions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {translations.recentSubmissions}
                </h3>
                
                {selectedStudent.submissions.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2">{translations.noSubmissions}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {translations.assignment}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {translations.course}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {translations.submissionDate}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {translations.status}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {translations.grade}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedStudent.submissions.map(submission => (
                          <tr key={submission.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {locale === 'de' ? submission.assignment.title : submission.assignment.titleFa}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {courses.find(c => c.id === submission.assignment.courseId)
                                ? locale === 'de' 
                                  ? courses.find(c => c.id === submission.assignment.courseId)?.title 
                                  : courses.find(c => c.id === submission.assignment.courseId)?.titleFa
                                : submission.assignment.courseId
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(submission.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                submission.status === 'GRADED' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {submission.status === 'GRADED' ? translations.graded : translations.ungraded}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {submission.grade !== null && submission.grade !== undefined 
                                ? `${submission.grade}/100` 
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowStudentDetails(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  {translations.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 