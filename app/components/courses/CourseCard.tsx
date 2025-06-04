'use client';

import { Locale } from '@/app/i18n/settings';
import { Card } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import { Course } from '@/app/types/course';
import Link from 'next/link';
import HtmlContent from '@/app/components/ui/HtmlContent';

interface CourseCardProps {
  course: Course;
  locale: Locale;
}

export default function CourseCard({ course, locale }: CourseCardProps) {
  const isRtl = locale === 'fa';
  
  // Format date according to locale
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };
  
  // Calculate course duration in weeks based on start and end dates
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    
    return locale === 'de' 
      ? `${diffWeeks} Wochen`
      : `${diffWeeks} هفته`;
  };
  
  // Add this function to truncate HTML content safely
  function truncateHtml(html: string, maxLength: number): string {
    // Remove HTML tags for length calculation
    const plainText = html.replace(/<[^>]+>/g, '');
    
    if (plainText.length <= maxLength) return html;
    
    // Find last space before maxLength
    const lastSpace = plainText.substring(0, maxLength).lastIndexOf(' ');
    const truncatedText = plainText.substring(0, lastSpace > 0 ? lastSpace : maxLength);
    
    return `<p>${truncatedText}...</p>`;
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <ImageWithFallback
          src={course.thumbnail || '/images/placeholder.jpg'}
          fallbackSrc="/images/placeholder.jpg"
          alt={locale === 'de' ? course.title : course.titleFa}
          className="w-full h-full object-cover"
          width={800}
          height={450}
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {locale === 'de' ? course.title : course.titleFa}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white">
            {course.level}
          </span>
        </div>
        
        <div className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3 overflow-hidden max-h-24">
          <HtmlContent
            content={locale === 'de' 
              ? (course.description ? truncateHtml(course.description, 150) : '')
              : (course.descriptionFa ? truncateHtml(course.descriptionFa, 150) : '')
            }
            locale={locale}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {locale === 'de' ? 'Dauer' : 'مدت'}
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {calculateDuration(course.startDate, course.endDate)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {locale === 'de' ? 'Startdatum' : 'تاریخ شروع'}
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatDate(course.startDate)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end">
          <Link href={`/${locale}/courses/${course.id}`}>
            <Button
              variant="default"
              size="sm"
            >
              {locale === 'de' ? 'Jetzt anmelden' : 'ثبت نام'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
} 