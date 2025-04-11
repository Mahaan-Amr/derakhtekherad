'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import TeachersList from './TeachersList';
import TeacherEditor from './TeacherEditor';

// Define component props
interface TeachersManagementProps {
  locale: Locale;
  translations: any;
}

// Define teacher type
interface Teacher {
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
}

// Define the teachers management component
export default function TeachersManagement({ locale, translations }: TeachersManagementProps) {
  // State for teachers data
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for editor
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Fetch teachers data
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teachers');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch teachers: ${response.status}`);
      }
      
      const data = await response.json();
      setTeachers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teachers');
      toast.error(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchTeachers();
  }, []);
  
  // Handle filtering teachers by search term
  const filteredTeachers = teachers.filter(teacher => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        teacher.user.name.toLowerCase().includes(searchLower) ||
        teacher.user.email.toLowerCase().includes(searchLower) ||
        (teacher.specialties && teacher.specialties.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Handle edit teacher
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowEditor(true);
  };
  
  // Handle create new teacher
  const handleCreateTeacher = () => {
    setEditingTeacher(null);
    setShowEditor(true);
  };
  
  // Handle delete teacher
  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm(translations.confirmDelete)) {
      try {
        console.log(`Attempting to delete teacher with ID: ${teacherId}`);
        
        const response = await fetch(`/api/teachers?id=${teacherId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error(`Delete teacher error: ${response.status}`, data);
          // Extract the detailed error message from the response
          const errorMessage = data.error || `Failed to delete teacher: ${response.status}`;
          throw new Error(errorMessage);
        }
        
        toast.success(translations.deleteSuccess);
        fetchTeachers(); // Refresh the list
      } catch (err: any) {
        console.error(`Error deleting teacher ${teacherId}:`, err);
        toast.error(err.message || translations.deleteFailed);
      }
    }
  };
  
  // Handle save teacher
  const handleSaveTeacher = async (teacherData: any) => {
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
      
      if (editingTeacher) {
        // Update existing teacher
        const response = await fetch(`/api/teachers?id=${editingTeacher.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(teacherData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to update teacher: ${response.status}`);
        }
        
        toast.success(translations.updateSuccess);
      } else {
        // Create new teacher
        const response = await fetch('/api/teachers', {
          method: 'POST',
          headers,
          body: JSON.stringify(teacherData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to create teacher: ${response.status}`);
        }
        
        toast.success(translations.createSuccess);
      }
      
      setShowEditor(false);
      fetchTeachers(); // Refresh the list
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
            onClick={handleCreateTeacher}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {translations.newTeacher}
          </button>
        </div>
      </div>
      
      {/* Teachers list */}
      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          {error}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          {translations.noDataFound}
        </div>
      ) : (
        <TeachersList
          teachers={filteredTeachers}
          locale={locale}
          translations={translations}
          onEditTeacher={handleEditTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onRefresh={fetchTeachers}
        />
      )}
      
      {/* Teacher editor */}
      {showEditor && (
        <TeacherEditor
          teacher={editingTeacher}
          locale={locale}
          translations={translations}
          onSave={handleSaveTeacher}
          onCancel={handleCloseEditor}
        />
      )}
    </div>
  );
} 