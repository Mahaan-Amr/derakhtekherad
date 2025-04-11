'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CharterFormProps {
  locale: string;
  editMode?: boolean;
  initialData?: {
    id: string;
    title: string;
    titleFa: string;
    description: string;
    descriptionFa: string;
    iconName?: string;
    orderIndex: number;
    isActive: boolean;
  };
  translations: {
    title: string;
    titlePlaceholder: string;
    titleFa: string;
    titleFaPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    descriptionFa: string;
    descriptionFaPlaceholder: string;
    iconName: string;
    iconNamePlaceholder: string;
    orderIndex: string;
    isActive: string;
    save: string;
    cancel: string;
    backToList: string;
    createSuccess: string;
    updateSuccess: string;
    errorOccurred: string;
  };
}

const CharterForm: React.FC<CharterFormProps> = ({
  locale,
  editMode = false,
  initialData,
  translations,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    titleFa: initialData?.titleFa || '',
    description: initialData?.description || '',
    descriptionFa: initialData?.descriptionFa || '',
    iconName: initialData?.iconName || '',
    orderIndex: initialData?.orderIndex || 0,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });
  
  const [errors, setErrors] = useState<{
    title?: string;
    titleFa?: string;
    description?: string;
    descriptionFa?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = locale === 'de' ? 'Titel ist erforderlich' : 'عنوان الزامی است';
      isValid = false;
    }

    if (!formData.titleFa.trim()) {
      newErrors.titleFa = locale === 'de' ? 'Persischer Titel ist erforderlich' : 'عنوان فارسی الزامی است';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = locale === 'de' ? 'Beschreibung ist erforderlich' : 'توضیحات الزامی است';
      isValid = false;
    }

    if (!formData.descriptionFa.trim()) {
      newErrors.descriptionFa = locale === 'de' ? 'Persische Beschreibung ist erforderlich' : 'توضیحات فارسی الزامی است';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'orderIndex') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const method = editMode ? 'PUT' : 'POST';
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/charters', {
        method,
        headers,
        credentials: 'include', // Include cookies for NextAuth session
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        // If authentication fails, check auth status to debug
        if (response.status === 401 || response.status === 403) {
          await checkAuthStatus();
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }
      
      const successMessage = editMode 
        ? translations.updateSuccess 
        : translations.createSuccess;
      
      toast.success(successMessage);
      
      // Redirect back to the charters list
      router.push(`/${locale}/admin/charters`);
    } catch (error) {
      console.error('Error saving charter:', error);
      toast.error(translations.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to check auth status for debugging
  const checkAuthStatus = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/auth/status', {
        headers,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth Status Debug:', data);
        
        // Check if there's an issue with admin profile
        if (data.sessionAuth?.role === 'ADMIN' && !data.sessionAuth?.adminProfile?.exists) {
          toast.error('Your admin account is missing an admin profile. Please contact the system administrator.');
        } else if (data.tokenAuth?.role === 'ADMIN' && !data.tokenAuth?.adminProfile?.exists) {
          toast.error('Your admin account is missing an admin profile. Please contact the system administrator.');
        }
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/admin/charters`);
  };

  const isRtl = locale === 'fa';

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {editMode ? `${translations.title} (${formData.title})` : translations.title}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title (German) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.title}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={translations.titlePlaceholder}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Title (Farsi) */}
          <div>
            <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.titleFa}
            </label>
            <input
              type="text"
              id="titleFa"
              name="titleFa"
              value={formData.titleFa}
              onChange={handleChange}
              placeholder={translations.titleFaPlaceholder}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                errors.titleFa ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
              }`}
              dir="rtl"
            />
            {errors.titleFa && (
              <p className="mt-1 text-sm text-red-500">{errors.titleFa}</p>
            )}
          </div>
          
          {/* Description (German) */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.description}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={translations.descriptionPlaceholder}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                errors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          {/* Description (Farsi) */}
          <div className="md:col-span-2">
            <label htmlFor="descriptionFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.descriptionFa}
            </label>
            <textarea
              id="descriptionFa"
              name="descriptionFa"
              value={formData.descriptionFa}
              onChange={handleChange}
              placeholder={translations.descriptionFaPlaceholder}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                errors.descriptionFa ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
              }`}
              dir="rtl"
            />
            {errors.descriptionFa && (
              <p className="mt-1 text-sm text-red-500">{errors.descriptionFa}</p>
            )}
          </div>
          
          {/* Icon Name */}
          <div>
            <label htmlFor="iconName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.iconName}
            </label>
            <input
              type="text"
              id="iconName"
              name="iconName"
              value={formData.iconName}
              onChange={handleChange}
              placeholder={translations.iconNamePlaceholder}
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {locale === 'de' 
                ? 'Optional. Beispiel: "fas fa-book" für ein Buch-Icon von Font Awesome.' 
                : 'اختیاری. مثال: "fas fa-book" برای آیکون کتاب از Font Awesome.'}
            </p>
          </div>
          
          {/* Order Index */}
          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.orderIndex}
            </label>
            <input
              type="number"
              id="orderIndex"
              name="orderIndex"
              value={formData.orderIndex}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          
          {/* Is Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.isActive}
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="border-gray-300 text-gray-700 dark:text-gray-300"
          >
            {translations.cancel}
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            isLoading={loading}
            className="bg-primary text-white"
          >
            {translations.save}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CharterForm; 