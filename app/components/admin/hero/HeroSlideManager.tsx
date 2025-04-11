'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import { HeroSlide } from '@/app/lib/hero';
import Button from '@/app/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeroSlideManagerProps {
  locale: Locale;
  translations: {
    title: string;
    noSlides: string;
    createButton: string;
    editButton: string;
    deleteButton: string;
    german: string;
    persian: string;
    active: string;
    inactive: string;
    confirmDelete: string;
    cancel: string;
    confirm: string;
    orderIndex: string;
    status: string;
    actions: string;
  };
}

export default function HeroSlideManager({ 
  locale, 
  translations 
}: HeroSlideManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);
  
  const isRtl = locale === 'fa';
  const router = useRouter();
  
  // Fetch slides on component mount
  useEffect(() => {
    fetchSlides();
  }, []);
  
  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/hero');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Sort slides by order index
      const sortedSlides = data.sort((a: HeroSlide, b: HeroSlide) => a.orderIndex - b.orderIndex);
      setSlides(sortedSlides);
    } catch (error: any) {
      console.error('Error fetching slides:', error);
      setError(error.message || 'Failed to load slides. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const slideIndex = slides.findIndex(slide => slide.id === id);
    if (
      (direction === 'up' && slideIndex === 0) || 
      (direction === 'down' && slideIndex === slides.length - 1)
    ) {
      return; // Can't move up if already at top or down if already at bottom
    }
    
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? slideIndex - 1 : slideIndex + 1;
    
    // Swap the slides
    [newSlides[slideIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[slideIndex]];
    
    // Update order indices
    newSlides.forEach((slide, index) => {
      slide.orderIndex = index;
    });
    
    // Update UI immediately
    setSlides(newSlides);
    
    // Update the two affected slides in the database
    const slideToUpdate1 = newSlides[slideIndex];
    const slideToUpdate2 = newSlides[targetIndex];
    
    try {
      const updatePromises = [
        fetch('/api/hero', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: slideToUpdate1.id,
            orderIndex: slideToUpdate1.orderIndex
          }),
        }),
        fetch('/api/hero', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: slideToUpdate2.id,
            orderIndex: slideToUpdate2.orderIndex
          }),
        })
      ];
      
      await Promise.all(updatePromises);
      
      toast.success(
        locale === 'de' 
          ? 'Reihenfolge erfolgreich aktualisiert' 
          : 'ترتیب با موفقیت به‌روزرسانی شد'
      );
    } catch (error) {
      console.error('Error updating slide order:', error);
      // Revert changes on error
      fetchSlides();
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Aktualisieren der Reihenfolge' 
          : 'خطا در به‌روزرسانی ترتیب'
      );
    }
  };
  
  const toggleSlideActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/hero', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isActive: !currentStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update slide status');
      }
      
      // Update slide in state
      setSlides(slides.map(slide => 
        slide.id === id ? { ...slide, isActive: !currentStatus } : slide
      ));
      
      toast.success(
        locale === 'de' 
          ? 'Status erfolgreich aktualisiert' 
          : 'وضعیت با موفقیت به‌روزرسانی شد'
      );
    } catch (error) {
      console.error('Error updating slide status:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Aktualisieren des Status' 
          : 'خطا در به‌روزرسانی وضعیت'
      );
    }
  };
  
  const confirmDelete = async () => {
    if (!slideToDelete) return;
    
    try {
      const response = await fetch(`/api/hero?id=${slideToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete slide');
      }
      
      // Remove slide from state
      setSlides(slides.filter(slide => slide.id !== slideToDelete));
      
      toast.success(
        locale === 'de' 
          ? 'Slide erfolgreich gelöscht' 
          : 'اسلاید با موفقیت حذف شد'
      );
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Löschen des Slides' 
          : 'خطا در حذف اسلاید'
      );
    } finally {
      setSlideToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setSlideToDelete(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchSlides}
          className="mt-2 text-sm text-primary hover:underline"
        >
          {locale === 'de' ? 'Erneut versuchen' : 'تلاش مجدد'}
        </button>
      </div>
    );
  }
  
  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">
          {locale === 'de' ? 'Hero-Slides Übersicht' : 'نمای کلی اسلایدهای اصلی'}
        </h2>
        <Link href={`/${locale}/admin/hero/create`} passHref>
          <Button 
            variant="default" 
          >
            {translations.createButton}
          </Button>
        </Link>
      </div>
      
      {slides.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">{translations.noSlides}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {locale === 'de' ? 'Vorschau' : 'پیش‌نمایش'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {locale === 'de' ? 'Titel' : 'عنوان'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {translations.orderIndex}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {translations.status}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {translations.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {slides.map((slide) => (
                <tr key={slide.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-20 h-12 rounded-md overflow-hidden">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        unoptimized={process.env.NODE_ENV === 'development'}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {slide.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {slide.titleFa}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{slide.orderIndex + 1}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleReorder(slide.id, 'up')}
                          disabled={slide.orderIndex === 0}
                          className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleReorder(slide.id, 'down')}
                          disabled={slide.orderIndex === slides.length - 1}
                          className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleSlideActive(slide.id, slide.isActive)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        slide.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400'
                      }`}
                    >
                      {slide.isActive ? translations.active : translations.inactive}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                      <Link href={`/${locale}/admin/hero/edit/${slide.id}`} passHref>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                        >
                          {translations.editButton}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSlideToDelete(slide.id)}
                        className="text-red-600"
                      >
                        {translations.deleteButton}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {slideToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {translations.confirmDelete}
            </h3>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                onClick={cancelDelete}
              >
                {translations.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                {translations.confirm}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 