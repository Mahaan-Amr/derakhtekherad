'use client';

import { useState, useEffect, useCallback } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import CategoryEditor from './CategoryEditor';
import { useAuth } from '@/app/context/AuthContext';

// Define BlogTranslations interface
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

// Define the blog category type
interface Category {
  id: string;
  name: string;
  nameFa: string;
  slug: string;
  description: string | null;
  descriptionFa: string | null;
  createdAt: string;
  updatedAt: string;
  posts: Array<{ postId: string }>;
}

interface CategoriesListProps {
  locale: Locale;
  translations: BlogTranslations;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ locale, translations }) => {
  const { token } = useAuth(); // Get token from auth context
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const isRtl = locale === 'fa';

  // Fetch categories from the API with useCallback to memoize the function
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(locale === 'de' ? 'Fehler beim Laden der Kategorien' : 'خطا در بارگذاری دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category deletion
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm(translations.confirmDelete)) {
      return;
    }

    // Check if category has posts
    const category = categories.find(c => c.id === id);
    if (category && category.posts.length > 0) {
      toast.error(
        locale === 'de' 
          ? 'Kategorie enthält Beiträge und kann nicht gelöscht werden' 
          : 'این دسته‌بندی شامل پست است و نمی‌تواند حذف شود'
      );
      return;
    }

    try {
      console.log('Making DELETE request with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Response error:', response.status, errorData);
        throw new Error(`Failed to delete category: ${response.status} ${errorData?.error || ''}`);
      }

      // Remove the deleted category from the state
      setCategories(categories.filter(category => category.id !== id));
      toast.success(locale === 'de' ? 'Kategorie erfolgreich gelöscht' : 'دسته‌بندی با موفقیت حذف شد');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(locale === 'de' ? 'Fehler beim Löschen der Kategorie' : 'خطا در حذف دسته‌بندی');
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.nameFa.includes(searchTerm) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (category.descriptionFa && category.descriptionFa.includes(searchTerm))
    );
  });

  // Handle category creation or editing completion
  const handleEditorComplete = (success: boolean) => {
    if (success) {
      fetchCategories(); // Refresh the categories list
    }
    setIsEditing(false);
    setIsCreating(false);
    setSelectedCategory(null);
  };

  if (isEditing || isCreating) {
    return (
      <CategoryEditor 
        locale={locale} 
        translations={translations} 
        category={selectedCategory} 
        isNew={isCreating}
        onComplete={handleEditorComplete} 
      />
    );
  }

  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-grow max-w-md">
          <input
            type="text"
            placeholder={translations.search}
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => {
            setSelectedCategory(null);
            setIsCreating(true);
          }}
        >
          {translations.newCategory}
        </button>
      </div>

      {/* Categories table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.nameLabel}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.slug}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.descriptionLabel}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.postCount}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {locale === 'de' ? category.name : category.nameFa}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {locale === 'de' 
                        ? category.description || '-' 
                        : category.descriptionFa || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {category.posts?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsEditing(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {translations.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={category.posts?.length > 0}
                      >
                        {translations.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">{translations.noDataFound}</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;