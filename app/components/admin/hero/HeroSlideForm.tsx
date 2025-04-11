'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import { HeroSlide } from '@/app/lib/hero';
import Button from '@/app/components/ui/Button';
import Image from 'next/image';

interface HeroSlideFormProps {
  locale: Locale;
  translations: {
    title: string;
    titleLabel: string;
    titleFaLabel: string;
    descriptionLabel: string;
    descriptionFaLabel: string;
    imageUrlLabel: string;
    buttonOneTextLabel: string;
    buttonOneFaLabel: string;
    buttonOneLinkLabel: string;
    buttonTwoTextLabel: string;
    buttonTwoFaLabel: string;
    buttonTwoLinkLabel: string;
    isActiveLabel: string;
    submitButton: string;
    cancelButton: string;
    requiredField: string;
    imageHelp: string;
    createSuccess: string;
    createError: string;
    uploadButton?: string;
    uploadingImage?: string;
    uploadError?: string;
  };
  mode: 'create' | 'edit';
  slideId?: string;
}

export default function HeroSlideForm({ 
  locale, 
  translations,
  mode,
  slideId
}: HeroSlideFormProps) {
  const router = useRouter();
  const isRtl = locale === 'fa';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    titleFa: '',
    description: '',
    descriptionFa: '',
    imageUrl: '',
    buttonOneText: '',
    buttonOneFa: '',
    buttonOneLink: '',
    buttonTwoText: '',
    buttonTwoFa: '',
    buttonTwoLink: '',
    isActive: true,
  });
  
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Fetch slide data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && slideId) {
      fetchSlideData();
    }
  }, [mode, slideId]);
  
  const fetchSlideData = async () => {
    try {
      const response = await fetch(`/api/hero/${slideId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch slide data');
      }
      
      const data = await response.json();
      setFormData({
        title: data.title || '',
        titleFa: data.titleFa || '',
        description: data.description || '',
        descriptionFa: data.descriptionFa || '',
        imageUrl: data.imageUrl || '',
        buttonOneText: data.buttonOneText || '',
        buttonOneFa: data.buttonOneFa || '',
        buttonOneLink: data.buttonOneLink || '',
        buttonTwoText: data.buttonTwoText || '',
        buttonTwoFa: data.buttonTwoFa || '',
        buttonTwoLink: data.buttonTwoLink || '',
        isActive: data.isActive,
      });
      
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching slide data:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Laden der Slide-Daten' 
          : 'خطا در بارگیری داده‌های اسلاید'
      );
      router.push(`/${locale}/admin/hero`);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    
    // Update image preview for imageUrl field
    if (name === 'imageUrl' && value) {
      setImagePreview(value);
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = translations.requiredField;
    }
    
    if (!formData.titleFa.trim()) {
      newErrors.titleFa = translations.requiredField;
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = translations.requiredField;
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const url = '/api/hero';
      const body = mode === 'create' 
        ? formData 
        : { ...formData, id: slideId };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        // Log more details about the error
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Error response:', response.status, errorData);
        throw new Error(`Failed to ${mode} slide: ${errorData.error || response.statusText}`);
      }
      
      toast.success(
        locale === 'de' 
          ? mode === 'create' ? 'Slide erfolgreich erstellt' : 'Slide erfolgreich aktualisiert'
          : mode === 'create' ? 'اسلاید با موفقیت ایجاد شد' : 'اسلاید با موفقیت به‌روزرسانی شد'
      );
      
      // Redirect back to hero management page
      router.push(`/${locale}/admin/hero`);
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} slide:`, error);
      toast.error(
        locale === 'de' 
          ? mode === 'create' ? 'Fehler beim Erstellen des Slides' : 'Fehler beim Aktualisieren des Slides'
          : mode === 'create' ? 'خطا در ایجاد اسلاید' : 'خطا در به‌روزرسانی اسلاید'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    router.push(`/${locale}/admin/hero`);
  };
  
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
      const response = await fetch('/api/upload', {
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
        imageUrl: data.url
      }));
      
      // Update image preview
      setImagePreview(data.url);
      
      // Clear any existing error for imageUrl
      if (errors.imageUrl) {
        setErrors({
          ...errors,
          imageUrl: '',
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title (German) */}
          <div className="col-span-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.titleLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Title (Farsi) */}
          <div className="col-span-1">
            <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.titleFaLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titleFa"
              name="titleFa"
              value={formData.titleFa}
              onChange={handleChange}
              className={`w-full rounded-md border ${errors.titleFa ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.titleFa && (
              <p className="mt-1 text-sm text-red-500">{errors.titleFa}</p>
            )}
          </div>
          
          {/* Description (German) */}
          <div className="col-span-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.descriptionLabel}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Description (Farsi) */}
          <div className="col-span-1">
            <label htmlFor="descriptionFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.descriptionFaLabel}
            </label>
            <textarea
              id="descriptionFa"
              name="descriptionFa"
              value={formData.descriptionFa}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Image URL and Upload */}
          <div className="col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.imageUrlLabel} <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col md:flex-row md:gap-4 mb-2">
              <div className="flex-1 mb-2 md:mb-0">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={isUploading ? 'opacity-70 cursor-not-allowed' : ''}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin mr-2"></div>
                      {translations.uploadingImage || (locale === 'de' ? 'Wird hochgeladen...' : 'در حال بارگذاری...')}
                    </div>
                  ) : (
                    translations.uploadButton || (locale === 'de' ? 'Bild hochladen' : 'بارگذاری تصویر')
                  )}
                </Button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {translations.imageHelp}
            </p>
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
            )}
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {locale === 'de' ? 'Bildvorschau' : 'پیش‌نمایش تصویر'}
                </p>
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized={process.env.NODE_ENV === 'development'}
                    onError={() => setImagePreview(null)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Button 1 Text (German) */}
          <div className="col-span-1">
            <label htmlFor="buttonOneText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.buttonOneTextLabel}
            </label>
            <input
              type="text"
              id="buttonOneText"
              name="buttonOneText"
              value={formData.buttonOneText}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Button 1 Text (Farsi) */}
          <div className="col-span-1">
            <label htmlFor="buttonOneFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.buttonOneFaLabel}
            </label>
            <input
              type="text"
              id="buttonOneFa"
              name="buttonOneFa"
              value={formData.buttonOneFa}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Button 1 Link */}
          <div className="col-span-2">
            <label htmlFor="buttonOneLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.buttonOneLinkLabel}
            </label>
            <input
              type="text"
              id="buttonOneLink"
              name="buttonOneLink"
              value={formData.buttonOneLink}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="/about"
            />
          </div>
          
          {/* Button 2 Text (German) */}
          <div className="col-span-1">
            <label htmlFor="buttonTwoText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.buttonTwoTextLabel}
            </label>
            <input
              type="text"
              id="buttonTwoText"
              name="buttonTwoText"
              value={formData.buttonTwoText}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Button 2 Text (Farsi) */}
          <div className="col-span-1">
            <label htmlFor="buttonTwoFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.buttonTwoFaLabel}
            </label>
            <input
              type="text"
              id="buttonTwoFa"
              name="buttonTwoFa"
              value={formData.buttonTwoFa}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Button 2 Link */}
          <div className="col-span-2">
            <label htmlFor="buttonTwoLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.buttonTwoLinkLabel}
            </label>
            <input
              type="text"
              id="buttonTwoLink"
              name="buttonTwoLink"
              value={formData.buttonTwoLink}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="/contact"
            />
          </div>
          
          {/* Active Status */}
          <div className="col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {translations.isActiveLabel}
              </label>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            {translations.cancelButton}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin mr-2"></div>
                {translations.submitButton}
              </div>
            ) : (
              translations.submitButton
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 