import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import MainLayout from '@/app/components/layouts/MainLayout';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import Button from '@/app/components/ui/Button';
import HtmlContent from '@/app/components/ui/HtmlContent';
import { generateSeoMetadata, generateCourseSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import Link from 'next/link';

interface CourseDetailPageProps {
  params: {
    locale: Locale;
    id: string;
  };
}

export async function generateMetadata({ 
  params 
}: CourseDetailPageProps): Promise<Metadata> {
  const { locale, id } = params;
  
  try {
    // Fetch course data for metadata
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!course) {
      return {
        title: locale === 'de' ? 'Kurs nicht gefunden | Derakhte Kherad' : 'دوره یافت نشد | درخت خرد',
      };
    }
    
    // Generate meta tags with SEO utility
    return generateSeoMetadata({
      title: {
        de: `${course.title} (${course.level})`,
        fa: `${course.titleFa} (${course.level})`
      },
      description: {
        de: course.description?.substring(0, 160).replace(/<[^>]+>/g, '') || `Deutschkurs ${course.level} mit ${course.teacher.user.name}`,
        fa: course.descriptionFa?.substring(0, 160).replace(/<[^>]+>/g, '') || `دوره زبان آلمانی ${course.level} با ${course.teacher.user.name}`
      },
      path: `courses/${id}`,
      image: {
        url: course.thumbnail || '/images/course-placeholder.jpg',
        alt: {
          de: `${course.title} - Deutschkurs ${course.level}`,
          fa: `${course.titleFa} - دوره زبان آلمانی ${course.level}`
        }
      },
      type: 'article'
    }, locale);
  } catch (error) {
    console.error('Error generating course metadata:', error);
    return {
      title: locale === 'de' ? 'Kurs | Derakhte Kherad' : 'دوره | درخت خرد',
    };
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { locale, id } = params;
  
  // Basic translations
  const translations = {
    navigation: {
      home: locale === 'de' ? 'Startseite' : 'خانه',
      about: locale === 'de' ? 'Über uns' : 'درباره ما',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      login: locale === 'de' ? 'Anmelden' : 'ورود',
      darkMode: locale === 'de' ? 'Dunkelmodus' : 'حالت تاریک',
      lightMode: locale === 'de' ? 'Hellmodus' : 'حالت روشن'
    },
    footer: {
      address: locale === 'de' ? 'Adresse' : 'آدرس',
      phone: locale === 'de' ? 'Telefon' : 'تلفن',
      email: locale === 'de' ? 'E-Mail' : 'ایمیل',
      rights: locale === 'de' ? 'Alle Rechte vorbehalten' : 'تمامی حقوق محفوظ است'
    },
    course: {
      level: locale === 'de' ? 'Niveau' : 'سطح',
      duration: locale === 'de' ? 'Dauer' : 'مدت',
      startDate: locale === 'de' ? 'Startdatum' : 'تاریخ شروع',
      endDate: locale === 'de' ? 'Enddatum' : 'تاریخ پایان',
      location: locale === 'de' ? 'Ort' : 'مکان',
      timeSlot: locale === 'de' ? 'Zeitfenster' : 'زمان برگزاری',
      capacity: locale === 'de' ? 'Kapazität' : 'ظرفیت',
      price: locale === 'de' ? 'Preis' : 'قیمت',
      teacher: locale === 'de' ? 'Lehrer' : 'استاد',
      backToCourses: locale === 'de' ? 'Zurück zu Kursen' : 'بازگشت به دوره‌ها',
      enroll: locale === 'de' ? 'Jetzt anmelden' : 'ثبت نام',
      weeks: locale === 'de' ? 'Wochen' : 'هفته',
      courseNotFound: locale === 'de' ? 'Kurs nicht gefunden' : 'دوره یافت نشد'
    }
  };
  
  // Fetch course data
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  
  // If course not found, return 404
  if (!course) {
    return notFound();
  }
  
  // Format date according to locale
  const formatDate = (dateString: Date) => {
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateString);
  };
  
  // Calculate course duration in weeks
  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    
    return `${diffWeeks} ${translations.course.weeks}`;
  };
  
  // Format price according to locale
  const formatPrice = (price: number) => {
    // Format number with comma separators
    const formattedNumber = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
    
    // Add the appropriate currency text
    return locale === 'de' 
      ? `${formattedNumber} Toman` 
      : `${formattedNumber} تومان`;
  };
  
  const isRtl = locale === 'fa';
  
  // Navigation translations
  const nav = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره ها',
    blog: locale === 'de' ? 'Blog' : 'بلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    signup: locale === 'de' ? 'Registrieren' : 'ثبت نام',
  };
  
  // Define footer for the MainLayout
  const footer = {
    about: {
      title: locale === 'de' ? 'Über uns' : 'درباره ما',
      description: locale === 'de' 
        ? 'Derakhte Kherad Sprachschule bietet hochwertigen Deutschunterricht und Unterstützung bei der Einwanderung nach Deutschland.' 
        : 'آموزشگاه زبان درخت خرد ارائه دهنده آموزش زبان آلمانی با کیفیت و پشتیبانی برای مهاجرت به آلمان است.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelllinks' : 'لینک‌های سریع',
      links: [
        { title: translations.navigation.home, href: `/${locale}` },
        { title: translations.navigation.courses, href: `/${locale}/courses` },
        { title: translations.navigation.blog, href: `/${locale}/blog` },
        { title: translations.navigation.contact, href: `/${locale}/contact` }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      address: locale === 'de' ? 'Musterstraße 123, 12345 Berlin, Deutschland' : 'خیابان نمونه، پلاک ۱۲۳، تهران، ایران',
      email: 'info@derakhtekherad.com',
      phone: '+49 123 456789'
    }
  };
  
  // Generate course structured data for SEO
  const courseSchema = generateCourseSchema(course, locale);
  
  // Generate breadcrumb structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': translations.navigation.home,
        'item': `${process.env.NEXT_PUBLIC_APP_URL}/${locale}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': translations.navigation.courses,
        'item': `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/courses`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': locale === 'de' ? course.title : course.titleFa,
        'item': `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/courses/${id}`
      }
    ]
  };
  
  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />
      <MainLayout locale={locale as Locale} navItems={nav} footer={footer}>
        <div className={`bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <a 
                href={`/${locale}/courses`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                ← {translations.course.backToCourses}
              </a>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Course Image */}
              <div className="rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={course.thumbnail || '/images/placeholder.jpg'}
                  fallbackSrc="/images/placeholder.jpg"
                  alt={locale === 'de' ? course.title : course.titleFa}
                  className="w-full h-full object-cover"
                  width={800}
                  height={500}
                  priority
                />
              </div>
              
              {/* Course Details */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {locale === 'de' ? course.title : course.titleFa}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white">
                    {course.level}
                  </span>
                </div>
                
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <HtmlContent
                    content={locale === 'de' ? course.description || '' : course.descriptionFa || ''}
                    locale={locale as Locale}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.duration}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {calculateDuration(course.startDate, course.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.startDate}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(course.startDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.endDate}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {formatDate(course.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.location}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {course.location}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.timeSlot}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {course.timeSlot}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.capacity}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {course.capacity}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {translations.course.teacher}
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                      {course.teacher.user.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{translations.course.price}</span>
                    <p className="text-2xl font-bold text-primary">{formatPrice(course.price)}</p>
                  </div>
                  
                  <Link href={`/${locale}/enrollment?courseId=${course.id}`}>
                    <Button
                      variant="default" 
                      size="lg"
                    >
                      {translations.course.enroll}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
} 