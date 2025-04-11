'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import StudentsList from './StudentsList';
import StudentEditor from './StudentEditor';

// Define component props
interface StudentsManagementProps {
  locale: Locale;
  translations: any;
}

// Define student type
interface Student {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  phone?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
  enrollments: Array<{
    id: string;
    courseId: string;
    course?: {
      id: string;
      title: string;
      titleFa: string;
      level: string;
    }
  }>;
}

// Define the students management component
export default function StudentsManagement({ locale, translations }: StudentsManagementProps) {
  // State for students data
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for editor
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Fetch students data
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }
      
      const data = await response.json();
      setStudents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
      toast.error(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Handle filtering students by search term
  const filteredStudents = students.filter(student => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.user.name.toLowerCase().includes(searchLower) ||
        student.user.email.toLowerCase().includes(searchLower) ||
        (student.phone && student.phone.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Handle edit student
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowEditor(true);
  };
  
  // Handle create new student
  const handleCreateStudent = () => {
    setEditingStudent(null);
    setShowEditor(true);
  };
  
  // Handle delete student
  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm(translations.confirmDelete)) {
      try {
        console.log(`Attempting to delete student with ID: ${studentId}`);
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Create headers with authorization if token exists
        const headers: HeadersInit = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/students?id=${studentId}`, {
          method: 'DELETE',
          headers,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error(`Delete student error: ${response.status}`, data);
          // Extract the detailed error message from the response
          const errorMessage = data.error || `Failed to delete student: ${response.status}`;
          throw new Error(errorMessage);
        }
        
        toast.success(translations.deleteSuccess);
        fetchStudents(); // Refresh the list
      } catch (err: any) {
        console.error(`Error deleting student ${studentId}:`, err);
        toast.error(err.message || translations.deleteFailed);
      }
    }
  };
  
  // Handle save student
  const handleSaveStudent = async (studentData: any) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // Create headers with authorization if token exists
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (editingStudent) {
        // Update existing student
        const response = await fetch(`/api/students?id=${editingStudent.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(studentData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to update student: ${response.status}`);
        }
        
        toast.success(translations.updateSuccess);
      } else {
        // Create new student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers,
          body: JSON.stringify(studentData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to create student: ${response.status}`);
        }
        
        toast.success(translations.createSuccess);
      }
      
      setShowEditor(false);
      fetchStudents(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || translations.saveFailed);
    }
  };
  
  // Handle close editor
  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{translations.title}</h1>
      
      {/* Search controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder={translations.search}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <button
            onClick={handleCreateStudent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {translations.newStudent}
          </button>
        </div>
      </div>
      
      {/* Students list */}
      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          {translations.noDataFound}
        </div>
      ) : (
        <StudentsList
          students={filteredStudents}
          locale={locale}
          translations={translations}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
          onRefresh={fetchStudents}
        />
      )}
      
      {/* Student editor */}
      {showEditor && (
        <StudentEditor
          student={editingStudent}
          locale={locale}
          translations={translations}
          onSave={handleSaveStudent}
          onCancel={handleCloseEditor}
        />
      )}
    </div>
  );
} 