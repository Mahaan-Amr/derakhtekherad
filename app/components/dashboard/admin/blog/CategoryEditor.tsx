'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';

// Define the Category interface
interface Category {
  id: string;
  name: string;
  nameFa: string;
  slug: string;
  description: string | null;
  descriptionFa: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define the BlogTranslations interface
interface BlogTranslations {
  title: string;
  posts: string;
  categories: string;
  newPost: string;
  newCategory: string;
  publishedStatus: string;
  published: string;
  draft: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  thumbnailUpload: string;
  titleLabel: string;
  titleFaLabel: string;
  contentLabel: string;
  contentFaLabel: string;
  selectCategories: string;
  save: string;
  cancel: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
  search: string;
  filterBy: string;
  author: string;
  category: string;
  nameLabel: string;
  nameFaLabel: string;
  descriptionLabel: string;
  descriptionFaLabel: string;
  postCount: string;
  noDataFound: string;
  [key: string]: string;
}

interface CategoryEditorProps {
  locale: Locale;
  translations: BlogTranslations;
  category: Category | null;
  isNew: boolean;
  onComplete: (success: boolean) => void;
}

const CategoryEditor: React.FC<CategoryEditorProps> = ({
  locale,
  translations,
  category,
  isNew,
  onComplete
}) => {
  const { token } = useAuth(); // Get token from auth context
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameFa: '',
    slug: '',
    description: '',
    descriptionFa: ''
  });

  const isRtl = locale === 'fa';

  // Initialize form data if editing an existing category
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        nameFa: category.nameFa,
        slug: category.slug,
        description: category.description || '',
        descriptionFa: category.descriptionFa || ''
      });
    }
  }, [category]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name if slug is empty or name field is being changed
    if (name === 'name' && (!formData.slug || formData.slug === autoGenerateSlug(formData.name))) {
      setFormData(prev => ({
        ...prev,
        slug: autoGenerateSlug(value)
      }));
    }
  };

  // Auto-generate slug from name
  const autoGenerateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.nameFa || !formData.slug) {
      toast.error(
        locale === 'de' 
          ? 'Bitte füllen Sie alle erforderlichen Felder aus' 
          : 'لطفاً تمام فیلدهای الزامی را پر کنید'
      );
      return;
    }

    try {
      setLoading(true);
      
      // Get token from auth context instead of localStorage
      console.log('Auth token from context:', token ? 'Token exists' : 'No token found');
      
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/blog/categories' : `/api/blog/categories/${category?.id}`;
      
      console.log('Making request to:', url);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          name: formData.name,
          nameFa: formData.nameFa,
          slug: formData.slug,
          description: formData.description || null,
          descriptionFa: formData.descriptionFa || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Response error:', response.status, errorData);
        throw new Error(`Failed to save category: ${response.status} ${errorData?.error || ''}`);
      }

      toast.success(
        isNew 
          ? locale === 'de' ? 'Kategorie erfolgreich erstellt' : 'دسته‌بندی با موفقیت ایجاد شد'
          : locale === 'de' ? 'Kategorie erfolgreich aktualisiert' : 'دسته‌بندی با موفقیت بروزرسانی شد'
      );
      
      onComplete(true);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Speichern der Kategorie' 
          : 'خطا در ذخیره دسته‌بندی'
      );
      onComplete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      <h2 className="text-2xl font-bold mb-6">
        {isNew ? translations.newCategory : translations.edit}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
        
        {/* Name (Persian) */}
        <div className="space-y-2">
          <label htmlFor="nameFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.nameFaLabel}
          </label>
          <input
            type="text"
            id="nameFa"
            name="nameFa"
            value={formData.nameFa}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            dir="rtl"
            required
          />
        </div>
        
        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.slug}
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.descriptionLabel}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        {/* Description (Persian) */}
        <div className="space-y-2">
          <label htmlFor="descriptionFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.descriptionFaLabel}
          </label>
          <textarea
            id="descriptionFa"
            name="descriptionFa"
            value={formData.descriptionFa}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            dir="rtl"
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onComplete(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            {translations.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                {translations.save}
              </span>
            ) : (
              translations.save
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEditor;
