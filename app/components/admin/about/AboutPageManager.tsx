 'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import Button from '@/app/components/ui/Button';
import Image from 'next/image';

interface AboutPageData {
  id?: string;
  titleDe: string;
  titleFa: string;
  storyTitleDe: string;
  storyTitleFa: string;
  storyContentDe: string;
  storyContentFa: string;
  storyImage?: string;
  missionTitleDe: string;
  missionTitleFa: string;
  missionContentDe: string;
  missionContentFa: string;
  valuesTitleDe: string;
  valuesTitleFa: string;
  value1TitleDe: string;
  value1TitleFa: string;
  value1ContentDe: string;
  value1ContentFa: string;
  value2TitleDe: string;
  value2TitleFa: string;
  value2ContentDe: string;
  value2ContentFa: string;
  value3TitleDe: string;
  value3TitleFa: string;
  value3ContentDe: string;
  value3ContentFa: string;
}

interface AboutPageManagerProps {
  locale: Locale;
  translations: {
    title: string;
    mainTitle: string;
    storySection: string;
    missionSection: string;
    valuesSection: string;
    saveButton: string;
    cancelButton: string;
    resetButton: string;
    loading: string;
    error: string;
    success: string;
    german: string;
    persian: string;
    uploadImage: string;
    removeImage: string;
    storyTitle: string;
    storyContent: string;
    missionTitle: string;
    missionContent: string;
    valuesTitle: string;
    value1Title: string;
    value1Content: string;
    value2Title: string;
    value2Content: string;
    value3Title: string;
    value3Content: string;
  };
}

export default function AboutPageManager({ 
  locale, 
  translations 
}: AboutPageManagerProps) {
  const [aboutData, setAboutData] = useState<AboutPageData>({
    titleDe: 'Über',
    titleFa: 'درباره ما',
    storyTitleDe: 'Unsere Geschichte',
    storyTitleFa: 'داستان ما',
    storyContentDe: '',
    storyContentFa: '',
    storyImage: '/images/about-image-1.jpg',
    missionTitleDe: 'Unsere Mission',
    missionTitleFa: 'ماموریت ما',
    missionContentDe: '',
    missionContentFa: '',
    valuesTitleDe: 'Unsere Werte',
    valuesTitleFa: 'ارزش‌های ما',
    value1TitleDe: 'Qualität',
    value1TitleFa: 'کیفیت',
    value1ContentDe: '',
    value1ContentFa: '',
    value2TitleDe: 'Innovation',
    value2TitleFa: 'نوآوری',
    value2ContentDe: '',
    value2ContentFa: '',
    value3TitleDe: 'Inklusion',
    value3TitleFa: 'شمول',
    value3ContentDe: '',
    value3ContentFa: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'story' | 'mission' | 'values'>('main');
  
  const isRtl = locale === 'fa';
  
  // Fetch about page data on component mount
  useEffect(() => {
    fetchAboutData();
  }, []);
  
  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/about');
      
      if (!response.ok) {
        if (response.status === 404) {
          // No data found, use defaults
          setIsLoading(false);
          return;
        }
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setAboutData(data);
    } catch (error: any) {
      console.error('Error fetching about data:', error);
      setError(error.message || 'Failed to load about page data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      toast.success(translations.success);
    } catch (error: any) {
      console.error('Error saving about data:', error);
      toast.error(error.message || 'Failed to save about page data.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = async () => {
    if (confirm(locale === 'de' ? 'Sind Sie sicher, dass Sie alle Änderungen zurücksetzen möchten?' : 'آیا مطمئن هستید که می‌خواهید تمام تغییرات را بازنشانی کنید؟')) {
      try {
        setIsSaving(true);
        
        const response = await fetch('/api/about', {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
          throw new Error(errorMessage);
        }
        
        await fetchAboutData();
        toast.success(locale === 'de' ? 'Zurückgesetzt' : 'بازنشانی شد');
      } catch (error: any) {
        console.error('Error resetting about data:', error);
        toast.error(error.message || 'Failed to reset about page data.');
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/about/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setAboutData(prev => ({
        ...prev,
        storyImage: data.url
      }));
      
      toast.success(locale === 'de' ? 'Bild erfolgreich hochgeladen' : 'تصویر با موفقیت آپلود شد');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image.');
    }
  };
  
  const handleRemoveImage = () => {
    setAboutData(prev => ({
      ...prev,
      storyImage: undefined
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">{translations.loading}</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <p className="text-red-800 dark:text-red-200">{translations.error}</p>
        <Button 
          onClick={fetchAboutData}
          className="mt-2"
          variant="secondary"
        >
          {locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد'}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          {[
            { key: 'main', label: locale === 'de' ? 'Haupttitel' : 'عنوان اصلی' },
            { key: 'story', label: locale === 'de' ? 'Geschichte' : 'داستان' },
            { key: 'mission', label: locale === 'de' ? 'Mission' : 'ماموریت' },
            { key: 'values', label: locale === 'de' ? 'Werte' : 'ارزش‌ها' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Main Title Tab */}
      {activeTab === 'main' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.german} - {translations.mainTitle}
              </label>
              <input
                type="text"
                value={aboutData.titleDe}
                onChange={(e) => setAboutData(prev => ({ ...prev, titleDe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.persian} - {translations.mainTitle}
              </label>
              <input
                type="text"
                value={aboutData.titleFa}
                onChange={(e) => setAboutData(prev => ({ ...prev, titleFa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Story Section Tab */}
      {activeTab === 'story' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.german} - {translations.storyTitle}
              </label>
              <input
                type="text"
                value={aboutData.storyTitleDe}
                onChange={(e) => setAboutData(prev => ({ ...prev, storyTitleDe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.persian} - {translations.storyTitle}
              </label>
              <input
                type="text"
                value={aboutData.storyTitleFa}
                onChange={(e) => setAboutData(prev => ({ ...prev, storyTitleFa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.german} - {translations.storyContent}
              </label>
              <textarea
                value={aboutData.storyContentDe}
                onChange={(e) => setAboutData(prev => ({ ...prev, storyContentDe: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.persian} - {translations.storyContent}
              </label>
              <textarea
                value={aboutData.storyContentFa}
                onChange={(e) => setAboutData(prev => ({ ...prev, storyContentFa: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              />
            </div>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {translations.uploadImage}
            </label>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              {aboutData.storyImage && (
                <Button
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="sm"
                >
                  {translations.removeImage}
                </Button>
              )}
            </div>
            {aboutData.storyImage && (
              <div className="mt-4">
                <Image
                  src={aboutData.storyImage}
                  alt="Story image"
                  width={200}
                  height={150}
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mission Section Tab */}
      {activeTab === 'mission' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.german} - {translations.missionTitle}
              </label>
              <input
                type="text"
                value={aboutData.missionTitleDe}
                onChange={(e) => setAboutData(prev => ({ ...prev, missionTitleDe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.persian} - {translations.missionTitle}
              </label>
              <input
                type="text"
                value={aboutData.missionTitleFa}
                onChange={(e) => setAboutData(prev => ({ ...prev, missionTitleFa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.german} - {translations.missionContent}
              </label>
              <textarea
                value={aboutData.missionContentDe}
                onChange={(e) => setAboutData(prev => ({ ...prev, missionContentDe: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.persian} - {translations.missionContent}
              </label>
              <textarea
                value={aboutData.missionContentFa}
                onChange={(e) => setAboutData(prev => ({ ...prev, missionContentFa: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Values Section Tab */}
      {activeTab === 'values' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.german} - {translations.valuesTitle}
              </label>
              <input
                type="text"
                value={aboutData.valuesTitleDe}
                onChange={(e) => setAboutData(prev => ({ ...prev, valuesTitleDe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translations.persian} - {translations.valuesTitle}
              </label>
              <input
                type="text"
                value={aboutData.valuesTitleFa}
                onChange={(e) => setAboutData(prev => ({ ...prev, valuesTitleFa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                dir="rtl"
              />
            </div>
          </div>
          
          {/* Value 1 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">{translations.value1Title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.german} - {translations.value1Title}
                </label>
                <input
                  type="text"
                  value={aboutData.value1TitleDe}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value1TitleDe: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.persian} - {translations.value1Title}
                </label>
                <input
                  type="text"
                  value={aboutData.value1TitleFa}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value1TitleFa: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.german} - {translations.value1Content}
                </label>
                <textarea
                  value={aboutData.value1ContentDe}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value1ContentDe: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.persian} - {translations.value1Content}
                </label>
                <textarea
                  value={aboutData.value1ContentFa}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value1ContentFa: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          
          {/* Value 2 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">{translations.value2Title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.german} - {translations.value2Title}
                </label>
                <input
                  type="text"
                  value={aboutData.value2TitleDe}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value2TitleDe: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.persian} - {translations.value2Title}
                </label>
                <input
                  type="text"
                  value={aboutData.value2TitleFa}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value2TitleFa: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.german} - {translations.value2Content}
                </label>
                <textarea
                  value={aboutData.value2ContentDe}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value2ContentDe: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.persian} - {translations.value2Content}
                </label>
                <textarea
                  value={aboutData.value2ContentFa}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value2ContentFa: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          
          {/* Value 3 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">{translations.value3Title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.german} - {translations.value3Title}
                </label>
                <input
                  type="text"
                  value={aboutData.value3TitleDe}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value3TitleDe: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.persian} - {translations.value3Title}
                </label>
                <input
                  type="text"
                  value={aboutData.value3TitleFa}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value3TitleFa: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.german} - {translations.value3Content}
                </label>
                <textarea
                  value={aboutData.value3ContentDe}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value3ContentDe: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translations.persian} - {translations.value3Content}
                </label>
                <textarea
                  value={aboutData.value3ContentFa}
                  onChange={(e) => setAboutData(prev => ({ ...prev, value3ContentFa: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleReset}
          variant="secondary"
          disabled={isSaving}
        >
          {translations.resetButton}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (locale === 'de' ? 'Wird gespeichert...' : 'در حال ذخیره...') : translations.saveButton}
        </Button>
      </div>
    </div>
  );
}