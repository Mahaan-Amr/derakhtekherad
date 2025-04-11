'use client';

import { useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import StudentCoursesModal from './StudentCoursesModal';

// Define props
interface StudentsListProps {
  students: Array<{
    id: string;
    user: {
      name: string;
      email: string;
    };
    phone?: string;
    photo?: string;
    createdAt: string;
    enrollments: Array<any>;
  }>;
  locale: Locale;
  translations: any;
  onEditStudent: (student: any) => void;
  onDeleteStudent: (studentId: string) => void;
  onRefresh: () => void;
}

// Define component
export default function StudentsList({ 
  students, 
  locale, 
  translations, 
  onEditStudent, 
  onDeleteStudent, 
  onRefresh 
}: StudentsListProps) {
  // State for showing courses modal
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm(translations.confirmDelete)) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Create headers with authorization if token exists
        const headers: HeadersInit = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/students?id=${id}`, {
          method: 'DELETE',
          headers,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to delete student: ${response.status}`);
        }
        
        toast.success(translations.deleteSuccess);
        onRefresh();
      } catch (err: any) {
        toast.error(err.message || translations.deleteFailed);
      }
    }
  };

  const handleViewCourses = (student: any) => {
    setSelectedStudent(student);
    setShowCoursesModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {translations.headers.name}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {translations.headers.email}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {translations.headers.phone}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {translations.headers.courses}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {translations.headers.createdAt}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {translations.headers.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {students.map(student => (
            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                <div className="flex items-center">
                  {student.photo ? (
                    <img 
                      src={student.photo} 
                      alt={student.user.name} 
                      className="h-10 w-10 rounded-full mr-2 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-avatar.jpg';
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-lg">
                        {student.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{student.user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {student.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {student.phone || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                <button 
                  onClick={() => handleViewCourses(student)}
                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {student.enrollments.length} {translations.courseCount}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {formatDate(student.createdAt, locale)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEditStudent(student)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  {translations.actions.edit}
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  {translations.actions.delete}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Student Courses Modal */}
      {showCoursesModal && selectedStudent && (
        <StudentCoursesModal
          student={selectedStudent}
          locale={locale}
          translations={translations}
          onClose={() => setShowCoursesModal(false)}
        />
      )}
    </div>
  );
} 