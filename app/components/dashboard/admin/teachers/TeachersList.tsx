'use client';

import { Locale } from '@/app/i18n/settings';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

// Define props
interface TeachersListProps {
  teachers: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    bio?: string;
    bioFa?: string;
    specialties?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
    courses: Array<{
      id: string;
      title: string;
      titleFa: string;
      level: string;
    }>;
  }>;
  locale: Locale;
  translations: any;
  onEditTeacher: (teacher: any) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onRefresh: () => void;
}

export default function TeachersList({ 
  teachers, 
  locale, 
  translations, 
  onEditTeacher, 
  onDeleteTeacher, 
  onRefresh 
}: TeachersListProps) {
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
        
        const response = await fetch(`/api/teachers?id=${id}`, {
          method: 'DELETE',
          headers,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to delete teacher: ${response.status}`);
        }
        
        toast.success(translations.deleteSuccess);
        onRefresh();
      } catch (err: any) {
        toast.error(err.message || translations.deleteFailed);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-left border-b">
              {translations.headers.name}
            </th>
            <th className="py-3 px-4 text-left border-b">
              {translations.headers.email}
            </th>
            <th className="py-3 px-4 text-left border-b">
              {translations.headers.specialties}
            </th>
            <th className="py-3 px-4 text-left border-b">
              {translations.headers.courses}
            </th>
            <th className="py-3 px-4 text-left border-b">
              {translations.headers.createdAt}
            </th>
            <th className="py-3 px-4 text-left border-b">
              {translations.headers.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <td className="py-3 px-4">
                {teacher.user.name}
              </td>
              <td className="py-3 px-4">
                {teacher.user.email}
              </td>
              <td className="py-3 px-4">
                {teacher.specialties || '-'}
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {teacher.courses.length > 0 
                    ? `${teacher.courses.length} ${translations.coursesCount}`
                    : translations.noCourses}
                </span>
                {teacher.courses.length > 0 && (
                  <div className="mt-1">
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-500 hover:text-blue-700">
                        {translations.showCourses}
                      </summary>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {teacher.courses.map(course => (
                          <li key={course.id}>
                            {locale === 'fa' && course.titleFa ? course.titleFa : course.title}
                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                              ({course.level})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                {formatDate(teacher.createdAt, locale)}
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditTeacher(teacher)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    {translations.actions.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    {translations.actions.delete}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 