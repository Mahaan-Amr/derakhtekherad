'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';

// Define component props
interface UserEditorProps {
  user: any | null;
  locale: Locale;
  translations: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
}

// Define the user editor component
export default function UserEditor({ user, locale, translations, onSave, onCancel }: UserEditorProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    password: '',
    confirmPassword: '',
  });
  
  // Error state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'STUDENT',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = translations.requiredFieldsMissing;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = translations.requiredFieldsMissing;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Only validate password for new users or if password is provided
    if (!user || formData.password.trim()) {
      if (!user && !formData.password.trim()) {
        newErrors.password = translations.requiredFieldsMissing;
      } else if (formData.password.trim() && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      
      // Only include password if provided
      if (formData.password.trim()) {
        Object.assign(userData, { password: formData.password });
      }
      
      onSave(userData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {user ? translations.updateUser : translations.createUser}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1">{translations.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1">{translations.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Role */}
          <div className="mb-4">
            <label className="block mb-1">{translations.role}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="ADMIN">{translations.admin}</option>
              <option value="TEACHER">{translations.teacher}</option>
              <option value="STUDENT">{translations.student}</option>
            </select>
          </div>
          
          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1">
              {translations.password} {user && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block mb-1">{translations.confirmPassword}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {translations.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {translations.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 