'use client';

import { useState, useEffect, useRef } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';

// Define props interface
interface StudentEditorProps {
  student: {
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
    enrollments: Array<any>;
  } | null;
  locale: Locale;
  translations: any;
  onSave: (studentData: any) => void;
  onCancel: () => void;
}

// Define the StudentEditor component
export default function StudentEditor({
  student,
  locale,
  translations,
  onSave,
  onCancel
}: StudentEditorProps) {
  // State for form data
  const [formData, setFormData] = useState({
    userId: '',
    phone: '',
    photo: ''
  });
  
  // State for form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // State for loading users
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  // State for image upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch available users who are not already students
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        const allUsers = await response.json();
        
        // Filter out users who are already students (unless we're editing this student)
        const response2 = await fetch('/api/students');
        if (!response2.ok) {
          throw new Error(`Failed to fetch students: ${response2.status}`);
        }
        
        const students = await response2.json();
        const studentUserIds = students.map((s: any) => s.user.id);
        
        // If we're editing a student, include their user in the list
        let filteredUsers;
        if (student) {
          filteredUsers = allUsers.filter((user: any) => 
            user.id === student.user.id || !studentUserIds.includes(user.id)
          );
        } else {
          filteredUsers = allUsers.filter((user: any) => 
            !studentUserIds.includes(user.id)
          );
        }
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [student]);
  
  // Initialize form data when student changes
  useEffect(() => {
    if (student) {
      setFormData({
        userId: student.user.id,
        phone: student.phone || '',
        photo: student.photo || ''
      });
    } else {
      setFormData({
        userId: '',
        phone: '',
        photo: ''
      });
    }
  }, [student]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(
        locale === 'de' 
          ? 'Die Datei muss ein Bild sein' 
          : 'فایل باید یک تصویر باشد'
      );
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Set uploading state
    setIsUploading(true);
    
    try {
      const response = await fetch('/api/students/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Upload response error:', response.status, errorData);
        throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        photo: data.url
      }));
      
      // Clear any existing error for photo
      if (errors.photo) {
        setErrors({
          ...errors,
          photo: '',
        });
      }
      
      toast.success(
        locale === 'de' 
          ? 'Bild erfolgreich hochgeladen' 
          : 'تصویر با موفقیت بارگذاری شد'
      );
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Provide more detailed error message
      let errorMessage = error.message || (
        locale === 'de' 
          ? 'Fehler beim Hochladen des Bildes' 
          : 'خطا در بارگذاری تصویر'
      );
      
      // Add specific error handling for common issues
      if (errorMessage.includes('401')) {
        errorMessage = locale === 'de' 
          ? 'Nicht autorisiert. Bitte melden Sie sich erneut an.' 
          : 'خطای دسترسی. لطفا مجددا وارد شوید.';
      } else if (errorMessage.includes('413')) {
        errorMessage = locale === 'de' 
          ? 'Die Datei ist zu groß.' 
          : 'حجم فایل بیش از حد مجاز است.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userId) {
      newErrors.userId = translations.errors.userRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {student ? translations.editStudent : translations.newStudent}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.fields.user}
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                errors.userId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={student !== null || loadingUsers}
            >
              <option value="">{translations.selectUser}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">{errors.userId}</p>
            )}
            {loadingUsers && (
              <p className="text-sm text-gray-500 mt-1">{translations.loadingUsers}</p>
            )}
          </div>
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.fields.phone}
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          {/* Photo URL and Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.fields.photo}
            </label>
            <div className="flex flex-col md:flex-row md:gap-4 mb-2">
              <div className="flex-1 mb-2 md:mb-0">
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="student-photo-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {locale === 'de' ? 'Hochladen...' : 'در حال بارگذاری...'}
                    </span>
                  ) : (
                    <span>{locale === 'de' ? 'Bild hochladen' : 'بارگذاری تصویر'}</span>
                  )}
                </button>
              </div>
            </div>
            {formData.photo && (
              <div className="mt-2">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-full border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-avatar.jpg';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {translations.actions.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {translations.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 