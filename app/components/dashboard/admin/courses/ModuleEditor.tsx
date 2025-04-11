'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/ui/Button';
import { CourseModule } from '@/app/types/course';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

interface ModuleEditorProps {
  locale: Locale;
  translations: {
    title: string;
    courses: string;
    modules: string;
    newModule: string;
    edit: string;
    delete: string;
    confirmDelete: string;
    save: string;
    cancel: string;
    noDataFound: string;
    moduleTitle: string;
    moduleTitleFa: string;
    orderIndex: string;
    descriptionLabel: string;
    descriptionFaLabel: string;
    [key: string]: string;
  };
  courseId: string;
  module: CourseModule | null;
  onComplete: (success: boolean) => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({
  locale,
  translations,
  courseId,
  module,
  onComplete
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleFa: '',
    description: '',
    descriptionFa: '',
    orderIndex: 0
  });

  const isRtl = locale === 'fa';
  const isNew = !module;

  // Initialize form data if editing an existing module
  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title,
        titleFa: module.titleFa,
        description: module.description || '',
        descriptionFa: module.descriptionFa || '',
        orderIndex: module.orderIndex
      });
    }
  }, [module]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['title', 'titleFa'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(
        locale === 'de'
          ? 'Bitte füllen Sie alle erforderlichen Felder aus'
          : 'لطفاً تمام فیلدهای الزامی را پر کنید'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/courses/modules' : `/api/courses/modules/${module?.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          courseId: courseId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to save module: ${response.status} ${errorData?.error || ''}`);
      }
      
      toast.success(
        isNew
          ? locale === 'de' ? 'Modul erfolgreich erstellt' : 'ماژول با موفقیت ایجاد شد'
          : locale === 'de' ? 'Modul erfolgreich aktualisiert' : 'ماژول با موفقیت بروزرسانی شد'
      );
      
      onComplete(true);
    } catch (error) {
      console.error('Error saving module:', error);
      toast.error(
        locale === 'de'
          ? 'Fehler beim Speichern des Moduls'
          : 'خطا در ذخیره ماژول'
      );
      onComplete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.moduleTitle} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          
          {/* Title (Farsi) */}
          <div className="space-y-2">
            <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.moduleTitleFa} *
            </label>
            <input
              type="text"
              id="titleFa"
              name="titleFa"
              value={formData.titleFa}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              dir="rtl"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <RichTextEditor
              label={translations.descriptionLabel}
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              locale="de"
              height="150px"
            />
          </div>
          
          {/* Description (Farsi) */}
          <div className="space-y-2">
            <RichTextEditor
              label={translations.descriptionFaLabel}
              value={formData.descriptionFa}
              onChange={(value) => setFormData(prev => ({ ...prev, descriptionFa: value }))}
              locale="fa"
              height="150px"
            />
          </div>
          
          {/* Order Index */}
          <div className="space-y-2">
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.orderIndex}
            </label>
            <input
              type="number"
              id="orderIndex"
              name="orderIndex"
              value={formData.orderIndex}
              onChange={handleNumberChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onComplete(false)}
            type="button"
          >
            {translations.cancel}
          </Button>
          <Button
            variant="default"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {locale === 'de' ? 'Speichern...' : 'در حال ذخیره...'}
              </span>
            ) : (
              translations.save
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModuleEditor; 