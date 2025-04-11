'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// Define types
interface TeacherAssignmentsManagementProps {
  locale: Locale;
  translations: any;
}

interface Course {
  id: string;
  title: string;
  titleFa: string;
  level: string;
  description: string;
  descriptionFa: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Assignment {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  dueDate: string;
  courseId: string;
  course?: Course;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    submissions: number;
  }
}

interface Student {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  student: Student;
  content: string;
  attachmentUrl?: string;
  grade?: number;
  feedback?: string;
  isLate: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  gradedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function TeacherAssignmentsManagement({ locale, translations }: TeacherAssignmentsManagementProps) {
  // Authentication token
  const { token } = useAuth();
  
  // State variables
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleFa: '',
    description: '',
    descriptionFa: '',
    dueDate: '',
    courseId: '',
    attachmentUrl: '',
  });
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Fetch assignments when component mounts or when filters change
  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchAssignments();
    }
  }, [token, selectedCourseId]);

  // Fetch teacher's courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/courses/teacher?includeInactive=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let url = '/api/assignments/teacher';
      
      // Add course filter if selected
      if (selectedCourseId) {
        url += `?courseId=${selectedCourseId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: ApiResponse<Assignment[]> = await response.json();
      
      if (data.success) {
        setAssignments(data.data);
      } else {
        setError(data.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch submissions for a specific assignment
  const fetchSubmissions = async (assignmentId: string) => {
    setSubmissionsLoading(true);
    
    try {
      const response = await fetch(`/api/submissions?assignmentId=${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: ApiResponse<Submission[]> = await response.json();
      
      if (data.success) {
        setSubmissions(data.data);
      } else {
        console.error('Error fetching submissions:', data.message);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Handle course filter change
  const handleCourseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(e.target.value);
  };

  // Open assignment form for creating a new assignment
  const handleCreateAssignment = () => {
    setFormData({
      title: '',
      titleFa: '',
      description: '',
      descriptionFa: '',
      dueDate: '',
      courseId: selectedCourseId || '',
      attachmentUrl: '',
    });
    setIsEditMode(false);
    setShowAssignmentForm(true);
  };

  // Open assignment form for editing an assignment
  const handleEditAssignment = (assignment: Assignment) => {
    setFormData({
      title: assignment.title,
      titleFa: assignment.titleFa,
      description: assignment.description,
      descriptionFa: assignment.descriptionFa,
      dueDate: assignment.dueDate.split('T')[0], // Format date for input
      courseId: assignment.courseId,
      attachmentUrl: assignment.attachmentUrl || '',
    });
    setSelectedAssignment(assignment);
    setIsEditMode(true);
    setShowAssignmentForm(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteConfirm(true);
  };

  // View submissions for an assignment
  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment.id);
    setShowSubmissionsModal(true);
  };

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (locale === 'de') {
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } else {
      // Persian date formatting (simplified for example)
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    }
  };

  // Component JSX
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {translations.assignments}
        </h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <select
            value={selectedCourseId}
            onChange={handleCourseFilterChange}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">{translations.allCourses}</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {locale === 'de' ? course.title : course.titleFa}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleCreateAssignment}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {translations.createAssignment}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-700 dark:text-gray-300">{translations.loading}</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">{translations.error}</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={fetchAssignments}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            {translations.retryButton}
          </button>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300 py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium">{translations.noAssignments}</h3>
          {selectedCourseId && (
            <button
              onClick={() => setSelectedCourseId('')}
              className="mt-2 text-primary hover:text-primary-dark"
            >
              {translations.allCourses}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {locale === 'de' ? assignment.title : assignment.titleFa}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{translations.dueDate}: {formatDate(assignment.dueDate)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>
                    {translations.submissionCount}: {assignment._count?.submissions || 0}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                  {locale === 'de' ? assignment.description : assignment.descriptionFa}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleViewSubmissions(assignment)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    {translations.viewSubmissions}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAssignment(assignment)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(assignment)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

  {/* Delete confirmation modal */}
  {showDeleteConfirm && selectedAssignment && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {translations.deleteAssignment}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {translations.confirmDelete}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {translations.cancel}
            </button>
            <button
              onClick={async () => {
                if (!token || !selectedAssignment) return;
                
                try {
                  const response = await fetch(`/api/assignments?id=${selectedAssignment.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                  }
                  
                  // Remove the deleted assignment from state
                  setAssignments(assignments.filter(a => a.id !== selectedAssignment.id));
                  setShowDeleteConfirm(false);
                  setSelectedAssignment(null);
                } catch (err) {
                  console.error('Error deleting assignment:', err);
                  // Could show an error notification here
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              {translations.deleteAssignment}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
  
  {/* Assignment form modal */}
  {showAssignmentForm && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? translations.editAssignment : translations.createAssignment}
            </h2>
            <button
              onClick={() => setShowAssignmentForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!token) return;
            
            try {
              // Determine if we're creating or updating
              const method = isEditMode ? 'PUT' : 'POST';
              let url = '/api/assignments';
              
              // For updates, add the ID as a query parameter
              if (isEditMode && selectedAssignment) {
                url += `?id=${selectedAssignment.id}`;
              }
              
              const response = await fetch(url, {
                method,
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: formData.title,
                  titleFa: formData.titleFa,
                  description: formData.description,
                  descriptionFa: formData.descriptionFa,
                  dueDate: formData.dueDate,
                  courseId: formData.courseId
                })
              });
              
              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
              
              // Refresh assignments list
              fetchAssignments();
              
              // Close form
              setShowAssignmentForm(false);
              setSelectedAssignment(null);
            } catch (err) {
              console.error('Error saving assignment:', err);
              // Could show an error notification here
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {translations.title} (DE)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {translations.title} (FA)
                </label>
                <input
                  type="text"
                  value={formData.titleFa}
                  onChange={(e) => setFormData({...formData, titleFa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {translations.dueDate}
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {translations.course}
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{translations.selectCourse}</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {locale === 'de' ? course.title : course.titleFa}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.description} (DE)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.description} (FA)
              </label>
              <textarea
                value={formData.descriptionFa}
                onChange={(e) => setFormData({...formData, descriptionFa: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.attachment}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  onChange={async (e) => {
                    if (!e.target.files || !e.target.files[0] || !token) return;
                    
                    // Create form data and append file
                    const formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    
                    try {
                      const response = await fetch('/api/assignments/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        },
                        body: formData
                      });
                      
                      if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                      }
                      
                      const data = await response.json();
                      
                      // Set the attachment URL in the form state
                      setFormData(prev => ({
                        ...prev,
                        attachmentUrl: data.fileUrl
                      }));
                    } catch (err) {
                      console.error('Error uploading file:', err);
                      // Could show an error notification here
                    }
                  }}
                  className="block w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                    file:bg-primary file:text-white hover:file:bg-primary-dark
                    dark:file:bg-primary dark:file:text-white"
                />
                {formData.attachmentUrl && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {translations.fileUploaded}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAssignmentForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {translations.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
              >
                {translations.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )}
  
  {/* Submissions modal */}
  {showSubmissionsModal && selectedAssignment && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {translations.submissions}: {locale === 'de' ? selectedAssignment.title : selectedAssignment.titleFa}
            </h2>
            <button
              onClick={() => {
                setShowSubmissionsModal(false);
                setSelectedAssignment(null);
                setSubmissions([]);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {submissionsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-700 dark:text-gray-300">{translations.loading}</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center text-gray-700 dark:text-gray-300 py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium">{translations.noSubmissions}</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.student}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.submittedOn}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.status}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.grade}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {submissions.map(submission => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {submission.student.photo ? (
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={submission.student.photo}
                                alt={submission.student.name}
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
                              {submission.student.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {submission.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(submission.createdAt)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {submission.isLate ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {translations.late}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {translations.onTime}
                            </span>
                          )}
                        </div>
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
                        {submission.grade !== null && submission.grade !== undefined ? `${submission.grade}/100` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {submission.attachmentUrl && (
                            <a 
                              href={submission.attachmentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </a>
                          )}
                          <button 
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            onClick={() => {
                              // Handle grading logic here
                              console.log('Grade submission:', submission.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setShowSubmissionsModal(false);
                setSelectedAssignment(null);
                setSubmissions([]);
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