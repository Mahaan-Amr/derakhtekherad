'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import Button from '@/app/components/ui/Button';

interface FeatureFormProps {
  locale: Locale;
  translations: any;
  mode: 'create' | 'edit';
  featureId?: string;
}

interface FormData {
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  iconName: string;
  isActive: boolean;
  orderIndex: number;
}

interface FormErrors {
  title?: string;
  titleFa?: string;
  description?: string;
  descriptionFa?: string;
  iconName?: string;
}

// Available icon options
const iconOptions = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'building', label: 'Building' },
  { value: 'shield', label: 'Shield' },
  { value: 'language', label: 'Language' },
  { value: 'book', label: 'Book' },
  { value: 'globe', label: 'Globe' },
  { value: 'certificate', label: 'Certificate' },
];

export default function FeatureForm({ 
  locale, 
  translations, 
  mode,
  featureId
}: FeatureFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    titleFa: '',
    description: '',
    descriptionFa: '',
    iconName: 'teacher',
    isActive: true,
    orderIndex: 0
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  
  // Fetch feature data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && featureId) {
      const fetchFeature = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/features/${featureId}`);
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const feature = await response.json();
          setFormData({
            title: feature.title,
            titleFa: feature.titleFa,
            description: feature.description,
            descriptionFa: feature.descriptionFa,
            iconName: feature.iconName,
            isActive: feature.isActive,
            orderIndex: feature.orderIndex
          });
        } catch (error) {
          console.error('Error fetching feature:', error);
          toast.error(
            locale === 'de' 
              ? 'Fehler beim Laden des Features' 
              : 'خطا در بارگذاری ویژگی'
          );
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchFeature();
    }
  }, [featureId, mode, locale]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } 
    // Handle number inputs
    else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    }
    // Handle all other inputs
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is changed
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = translations.form.required;
    }
    
    if (!formData.titleFa.trim()) {
      newErrors.titleFa = translations.form.required;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = translations.form.required;
    }
    
    if (!formData.descriptionFa.trim()) {
      newErrors.descriptionFa = translations.form.required;
    }
    
    if (!formData.iconName) {
      newErrors.iconName = translations.form.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const url = '/api/features';
      const body = mode === 'create' 
        ? formData 
        : { ...formData, id: featureId };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      toast.success(
        locale === 'de' 
          ? mode === 'create' ? 'Feature erfolgreich erstellt' : 'Feature erfolgreich aktualisiert'
          : mode === 'create' ? 'ویژگی با موفقیت ایجاد شد' : 'ویژگی با موفقیت به‌روزرسانی شد'
      );
      
      // Redirect back to features management page
      router.push(`/${locale}/admin/features`);
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} feature:`, error);
      toast.error(
        locale === 'de' 
          ? mode === 'create' ? 'Fehler beim Erstellen des Features' : 'Fehler beim Aktualisieren des Features'
          : mode === 'create' ? 'خطا در ایجاد ویژگی' : 'خطا در به‌روزرسانی ویژگی'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* Title (German) */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translations.form.title} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder={translations.form.titlePlaceholder}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      {/* Title (Farsi) */}
      <div>
        <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translations.form.titleFa} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="titleFa"
          name="titleFa"
          value={formData.titleFa}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder={translations.form.titleFaPlaceholder}
          dir="rtl"
        />
        {errors.titleFa && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.titleFa}</p>
        )}
      </div>
      
      {/* Description (German) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translations.form.description} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder={translations.form.descriptionPlaceholder}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>
      
      {/* Description (Farsi) */}
      <div>
        <label htmlFor="descriptionFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translations.form.descriptionFa} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descriptionFa"
          name="descriptionFa"
          rows={3}
          value={formData.descriptionFa}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder={translations.form.descriptionFaPlaceholder}
          dir="rtl"
        ></textarea>
        {errors.descriptionFa && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descriptionFa}</p>
        )}
      </div>
      
      {/* Icon Name */}
      <div>
        <label htmlFor="iconName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translations.form.iconName} <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex items-center space-x-3">
          <select
            id="iconName"
            name="iconName"
            value={formData.iconName}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-primary rounded-full">
            {renderFeatureIcon(formData.iconName)}
          </div>
        </div>
        {errors.iconName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.iconName}</p>
        )}
      </div>
      
      {/* Order Index */}
      <div>
        <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translations.form.orderIndex}
        </label>
        <input
          type="number"
          id="orderIndex"
          name="orderIndex"
          value={formData.orderIndex}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {translations.form.orderIndexHelp}
        </p>
      </div>
      
      {/* Active Status */}
      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-700"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {translations.form.isActive}
        </label>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/admin/features`)}
          disabled={isSubmitting}
        >
          {translations.form.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {translations.form.saving}
            </span>
          ) : mode === 'create' ? translations.form.create : translations.form.update}
        </Button>
      </div>
    </form>
  );
}

// Helper function to render icons based on iconName
function renderFeatureIcon(iconName: string) {
  switch (iconName) {
    case 'teacher':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'building':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'shield':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'language':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      );
    case 'book':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'globe':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'certificate':
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
} 