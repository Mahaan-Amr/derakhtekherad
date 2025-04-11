'use client';

import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

// Define the category type
interface Category {
  id: string;
  name: string;
  nameFa: string;
}

// Define the blog post type
interface BlogPost {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  content: string;
  contentFa: string;
  thumbnail: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    user: {
      name: string;
    };
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
      nameFa: string;
    };
  }>;
  thumbnailUrl?: string;
  isPublished?: boolean;
}

// Define the translations interface to replace any
interface BlogTranslations {
  title: string;
  titleLabel: string;
  titleFaLabel: string;
  contentLabel: string;
  contentFaLabel: string;
  slug: string;
  publishedStatus: string;
  published: string;
  save: string;
  cancel: string;
  selectCategories: string;
  thumbnailUpload: string;
  newPost: string;
  edit: string;
  requiredFieldsMissing: string;
  [key: string]: string;
}

interface PostEditorProps {
  locale: Locale;
  translations: BlogTranslations;
  post: BlogPost | null;
  isNew: boolean;
  onComplete: (success: boolean) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ 
  locale, 
  translations, 
  post, 
  isNew,
  onComplete 
}) => {
  const { token } = useAuth();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    titleFa: '',
    slug: '',
    content: '',
    contentFa: '',
    thumbnail: '',
    published: true,
    selectedCategories: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isRtl = locale === 'fa';

  // For file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch all categories with useCallback to memoize the function
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('/api/blog/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setAllCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(locale === 'de' ? 'Fehler beim Laden der Kategorien' : 'خطا در بارگذاری دسته‌بندی‌ها');
    } finally {
      setLoadingCategories(false);
    }
  }, [locale]);

  // Populate form if editing an existing post
  useEffect(() => {
    if (post) {
      const thumbnailField = 
        'thumbnail' in post ? post.thumbnail :
        'thumbnailUrl' in post ? (post as any).thumbnailUrl : 
        '';
        
      const publishedField = 
        'published' in post ? !!post.published :
        'isPublished' in post ? !!(post as any).isPublished : 
        false;

      setFormData({
        title: post.title,
        titleFa: post.titleFa,
        slug: post.slug,
        content: post.content,
        contentFa: post.contentFa,
        thumbnail: thumbnailField || '',
        published: publishedField,
        selectedCategories: post.categories
          ? (Array.isArray(post.categories)
              ? post.categories.map(cat => {
                  if (typeof cat === 'string') return cat;
                  if (cat && typeof cat === 'object') {
                    // Handle CategoryPost structure
                    if ('category' in cat && cat.category && typeof cat.category === 'object') {
                      return cat.category.id;
                    }
                    // Handle direct category ID
                    if ('id' in cat) {
                      return cat.id;
                    }
                  }
                  return '';
                }).filter(id => id !== '') as string[]
              : [])
          : []
      });

      // Set preview for existing thumbnail
      if (thumbnailField) {
        setPreviewUrl(thumbnailField);
      }
    }
    
    // Fetch categories when component mounts
    fetchCategories();
  }, [post, fetchCategories]);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle category selection
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return { ...prev, selectedCategories: [...prev.selectedCategories, value] };
      } else {
        return { ...prev, selectedCategories: prev.selectedCategories.filter(id => id !== value) };
      }
    });
  };

  // Auto-generate slug from title
  const handleTitleBlur = () => {
    if (isNew && formData.title && !formData.slug) {
      // Convert title to lowercase, replace spaces with hyphens, and remove special characters
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  // Enhance the handleFileChange function to include more detailed logging
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      console.log('[Upload] No file selected');
      return;
    }
    
    console.log('[Upload] File selected:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[Upload] Invalid file type:', file.type);
      toast.error(locale === 'de' ? 'Die Datei muss ein Bild sein' : 'فایل باید تصویر باشد');
      return;
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', `${(file.size / 1024 / 1024).toFixed(2)} MB`);
      toast.error(
        locale === 'de' 
          ? 'Die Dateigröße darf 5MB nicht überschreiten' 
          : 'حجم فایل نباید بیشتر از 5 مگابایت باشد'
      );
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    console.log('[Upload] Creating file preview');
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      console.log('[Upload] Preview created, length:', result.length);
      setPreviewUrl(result);
    };
    reader.onerror = () => {
      console.error('[Upload] Error creating preview');
    };
    reader.readAsDataURL(file);
  };

  // Upload file to server
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      console.log('[Upload] Starting upload process for file:', selectedFile.name);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Get auth token
      const authToken = token || localStorage.getItem('token');
      console.log('[Upload] Authentication token retrieved:', authToken ? 'Token exists' : 'No token');
      
      console.log('[Upload] Sending request to /api/blog/upload');
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
        },
        body: formData,
      });
      
      setUploadProgress(50);
      
      console.log('[Upload] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('[Upload] Error response:', error);
        throw new Error(error.error || 'Upload failed');
      }
      
      setUploadProgress(90);
      const data = await response.json();
      console.log('[Upload] Success response:', data);
      
      setUploadProgress(100);
      
      // Update form with the new image URL
      const fileUrl = data.fileUrl;
      console.log('[Upload] Setting image URL in form:', fileUrl);
      setFormData(prev => ({ ...prev, thumbnail: fileUrl }));
      
      toast.success(
        locale === 'de' 
          ? 'Bild erfolgreich hochgeladen' 
          : 'تصویر با موفقیت آپلود شد'
      );
    } catch (error) {
      console.error('[Upload] Error uploading image:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Hochladen des Bildes' 
          : 'خطا در آپلود تصویر'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get auth token from localStorage
      const authToken = token || localStorage.getItem('token');
      console.log('[PostEditor] Starting to submit post, isNew:', isNew);
      
      // Validate required fields
      if (!formData.title || !formData.titleFa || !formData.slug || !formData.content || !formData.contentFa) {
        toast.error(translations.requiredFieldsMissing);
        setIsSubmitting(false);
        return;
      }

      console.log('[PostEditor] Submitting post with thumbnail URL:', formData.thumbnail);
      console.log('[PostEditor] Selected categories:', formData.selectedCategories);
      
      const url = isNew
        ? '/api/blog/posts'
        : `/api/blog/posts/${post?.id}`;

      console.log('[PostEditor] Submitting to URL:', url);
      const method = isNew ? 'POST' : 'PUT';

      // Include credentials for session authentication
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || ''}`,
        },
        credentials: 'include', // Include cookies for session authentication
        body: JSON.stringify({
          title: formData.title,
          titleFa: formData.titleFa,
          slug: formData.slug,
          content: formData.content,
          contentFa: formData.contentFa,
          thumbnail: formData.thumbnail,
          published: formData.published,
          categories: formData.selectedCategories, // Send as array of IDs
        }),
      });

      console.log('[PostEditor] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PostEditor] Error response:', errorData);
        throw new Error(errorData.error || `Failed to ${isNew ? 'create' : 'update'} post`);
      }

      const savedPost = await response.json();
      console.log('[PostEditor] Post saved successfully:', savedPost);

      toast.success(
        isNew
          ? locale === 'de' ? 'Beitrag erfolgreich erstellt' : 'پست با موفقیت ایجاد شد'
          : locale === 'de' ? 'Beitrag erfolgreich aktualisiert' : 'پست با موفقیت بروزرسانی شد'
      );
      onComplete(true);
    } catch (error) {
      console.error(`[PostEditor] Error ${isNew ? 'creating' : 'updating'} post:`, error);
      toast.error(
        isNew
          ? locale === 'de' ? 'Fehler beim Erstellen des Beitrags' : 'خطا در ایجاد پست'
          : locale === 'de' ? 'Fehler beim Aktualisieren des Beitrags' : 'خطا در بروزرسانی پست'
      );
      onComplete(false);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isNew ? translations.newPost : translations.edit}
        </h2>
        <button
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={() => onComplete(false)}
        >
          {translations.cancel}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.titleLabel} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleTitleBlur}
              required
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.titleFaLabel} *
            </label>
            <input
              type="text"
              id="titleFa"
              name="titleFa"
              value={formData.titleFa}
              onChange={handleInputChange}
              required
              className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-full"
            />
          </div>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.slug} *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {locale === 'de' 
              ? 'Der Slug wird in der URL verwendet. Nur Kleinbuchstaben, Zahlen und Bindestriche.' 
              : 'نامک در URL استفاده می‌شود. فقط حروف کوچک، اعداد و خط تیره.'}
          </p>
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.thumbnailUpload}
          </label>
          
          {/* Image Preview */}
          {previewUrl && (
            <div className="relative w-full h-48 mb-4 border rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                alt="Thumbnail preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onLoad={() => console.log('[Image] Preview image loaded successfully:', previewUrl)}
                onError={(e) => console.error('[Image] Error loading preview image:', previewUrl, e)}
              />
              <button
                type="button"
                onClick={() => {
                  console.log('[Image] Removing image preview');
                  setPreviewUrl('');
                  setSelectedFile(null);
                  setFormData(prev => ({ ...prev, thumbnail: '' }));
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                title={locale === 'de' ? 'Bild entfernen' : 'حذف تصویر'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Input */}
            <div>
              <input
                type="file"
                id="thumbnailFile"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="thumbnailFile"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {locale === 'de' ? 'Bild auswählen' : 'انتخاب تصویر'}
              </label>
              {selectedFile && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{selectedFile.name}</p>
              )}
            </div>
            
            {/* Upload Button */}
            <div>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedFile && !isUploading ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {locale === 'de' ? 'Hochladen' : 'آپلود'}
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Manual URL Input */}
          <div className="mt-4">
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {locale === 'de' ? 'Oder URL eingeben' : 'یا URL را وارد کنید'}
            </label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              placeholder={locale === 'de' ? 'https://beispiel.com/bild.jpg' : 'https://mesal.com/tasvir.jpg'}
              className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-full"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {locale === 'de' 
                ? 'Sie können eine URL direkt eingeben oder ein Bild hochladen' 
                : 'می‌توانید مستقیماً یک URL وارد کنید یا یک تصویر آپلود کنید'}
            </p>
          </div>
        </div>

        {/* Content Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <RichTextEditor
              label={translations.contentLabel + ' *'}
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              locale="de"
              required
              placeholder={translations.contentLabel}
            />
          </div>
          <div className="space-y-2">
            <RichTextEditor
              label={translations.contentFaLabel + ' *'}
              value={formData.contentFa}
              onChange={(value) => setFormData(prev => ({ ...prev, contentFa: value }))}
              locale="fa"
              required
              placeholder={translations.contentFaLabel}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.selectCategories}
          </label>
          
          {loadingCategories ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {locale === 'de' ? 'Kategorien werden geladen...' : 'در حال بارگذاری دسته‌بندی‌ها...'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allCategories.map(category => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    name="categories"
                    value={category.id}
                    checked={formData.selectedCategories.includes(category.id)}
                    onChange={handleCategoryChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {locale === 'de' ? category.name : category.nameFa}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published Status */}
        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleCheckboxChange}
            className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5 dark:border-gray-600 dark:bg-gray-800"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {translations.published}
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {locale === 'de' 
              ? '(Aktivieren Sie diese Option, um den Beitrag sofort zu veröffentlichen)' 
              : '(این گزینه را فعال کنید تا پست بلافاصله منتشر شود)'}
          </span>
        </div>

        {/* Submit Button */}
        <div className="mt-5">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 
              ${isRtl ? 'mr-auto' : 'ml-auto'} 
              ${isNew ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'} 
              text-white font-semibold transition-all duration-200 ease-in-out flex items-center space-x-2`}
            disabled={loading || isSubmitting}
          >
            {(loading || isSubmitting) && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isNew ? translations.newPost : translations.edit}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;